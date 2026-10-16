import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { LEAD_PRICE_GBP_PENCE } from "../../../lib/lead-purchases";
import { getSupabaseAdmin, getStripe } from "../../../lib/server-clients";

const checkoutDurationSeconds = 30 * 60;
const reservationGraceSeconds = 5 * 60;

export async function POST(request) {
  let reservationId;
  let leadId;
  let supabase;
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid checkout request." }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid checkout request." }, { status: 400 });
    }
    leadId = typeof body.leadId === "string"
      ? body.leadId
      : typeof body.leadId === "number" ? String(body.leadId) : "";
    if (!leadId || leadId.length > 100) {
      return Response.json({ error: "Choose a valid lead before checkout." }, { status: 400 });
    }

    const stripe = getStripe();
    supabase = getSupabaseAdmin();
    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!configuredSiteUrl) throw new Error("Missing public site URL configuration.");
    const siteUrl = new URL(configuredSiteUrl);
    const localHttp = siteUrl.protocol === "http:" && siteUrl.hostname === "localhost";
    if (siteUrl.protocol !== "https:" && !localHttp) {
      throw new Error("The public site URL must use HTTPS.");
    }

    reservationId = randomUUID();
    const expiresAtSeconds = Math.floor(Date.now() / 1000) + checkoutDurationSeconds;
    const reservationExpiresAt = new Date((expiresAtSeconds + reservationGraceSeconds) * 1000).toISOString();
    const now = new Date().toISOString();

    const { data: reservedLead, error: reservationError } = await supabase
      .from("leads")
      .update({
        checkout_reservation_id: reservationId,
        checkout_reservation_expires_at: reservationExpiresAt,
      })
      .eq("id", leadId)
      .or("status.is.null,status.neq.sold")
      .or(`checkout_reservation_expires_at.is.null,checkout_reservation_expires_at.lt.${now}`)
      .select("id")
      .maybeSingle();

    if (reservationError) throw reservationError;
    if (!reservedLead) {
      return Response.json({ error: "This lead is no longer available. Refresh the list and choose another." }, { status: 409 });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{
          price_data: {
            currency: "gbp",
            product_data: { name: "London Roof Connect — Lead Access" },
            unit_amount: LEAD_PRICE_GBP_PENCE,
          },
          quantity: 1,
        }],
        metadata: { lead_id: leadId, reservation_id: reservationId },
        payment_intent_data: {
          metadata: { lead_id: leadId, reservation_id: reservationId },
        },
        expires_at: expiresAtSeconds,
        success_url: `${siteUrl.origin}/roofer?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl.origin}/roofer?payment=cancelled`,
      });

      if (!session.url) throw new Error("Stripe did not return a checkout URL.");
      const response = NextResponse.json(
        { url: session.url },
        { headers: { "Cache-Control": "no-store" } },
      );
      response.cookies.set(`lrc_checkout_${reservationId}`, session.id, {
        httpOnly: true,
        secure: siteUrl.protocol === "https:",
        sameSite: "lax",
        path: "/api/checkout/complete",
        maxAge: checkoutDurationSeconds + reservationGraceSeconds,
      });
      return response;
    } catch (error) {
      const { error: releaseError } = await supabase
        .from("leads")
        .update({
          checkout_reservation_id: null,
          checkout_reservation_expires_at: null,
        })
        .eq("id", leadId)
        .eq("checkout_reservation_id", reservationId);

      if (releaseError) console.error("Unable to release failed checkout reservation:", releaseError);
      throw error;
    }
  } catch (error) {
    console.error("Unable to create Stripe checkout:", error);
    return Response.json(
      { error: "Checkout could not be started. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
