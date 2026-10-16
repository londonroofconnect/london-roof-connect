import { cookies } from "next/headers";
import { getPurchasedLead, PurchaseError } from "../../../../lib/lead-purchases";
import { getStripe } from "../../../../lib/server-clients";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid payment confirmation request." }, { status: 400 });
    }
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
    if (!sessionId.startsWith("cs_test_") || sessionId.length > 255) {
      return Response.json({ error: "A valid checkout session is required." }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const reservationId = session.metadata?.reservation_id;
    const checkoutCookie = reservationId
      ? (await cookies()).get(`lrc_checkout_${reservationId}`)?.value
      : null;
    if (checkoutCookie !== session.id) {
      throw new PurchaseError("This checkout must be completed in the browser where it was started.", 403);
    }

    const lead = await getPurchasedLead(session);
    return Response.json({ lead }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof PurchaseError) {
      return Response.json(
        { error: error.message },
        { status: error.status, headers: { "Cache-Control": "private, no-store" } },
      );
    }

    console.error("Unable to confirm lead purchase:", error);
    return Response.json(
      { error: "Payment could not be confirmed. Please refresh or contact support." },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
