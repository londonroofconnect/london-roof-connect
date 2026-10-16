import { getSupabaseAdmin } from "./server-clients";

export const LEAD_PRICE_GBP_PENCE = 2500;

export class PurchaseError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function markLeadSold(session) {
  const leadId = session.metadata?.lead_id;
  const reservationId = session.metadata?.reservation_id;
  if (
    session.mode !== "payment"
    || session.payment_status !== "paid"
    || session.currency !== "gbp"
    || session.amount_total !== LEAD_PRICE_GBP_PENCE
    || !leadId
    || !reservationId
  ) {
    throw new PurchaseError("Payment has not been confirmed for this lead.", 402);
  }

  const supabase = getSupabaseAdmin();
  const { data: lead, error: lookupError } = await supabase
    .from("leads")
    .select("id,status,checkout_reservation_id,stripe_checkout_session_id")
    .eq("id", leadId)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (!lead) throw new PurchaseError("This lead is no longer available.", 404);

  if (lead.status === "sold") {
    if (lead.stripe_checkout_session_id !== session.id) {
      throw new PurchaseError("This lead has already been purchased.", 409);
    }
    return;
  }

  if (lead.checkout_reservation_id !== reservationId) {
    throw new PurchaseError("This lead reservation has expired or is no longer valid.", 409);
  }

  const { data: updated, error: updateError } = await supabase
    .from("leads")
    .update({
      status: "sold",
      sold_at: new Date().toISOString(),
      stripe_checkout_session_id: session.id,
      checkout_reservation_id: null,
      checkout_reservation_expires_at: null,
    })
    .eq("id", leadId)
    .eq("checkout_reservation_id", reservationId)
    .or("status.is.null,status.neq.sold")
    .select("id")
    .maybeSingle();

  if (updateError) throw updateError;
  if (updated) return;

  const { data: current, error: currentError } = await supabase
    .from("leads")
    .select("status,stripe_checkout_session_id")
    .eq("id", leadId)
    .maybeSingle();

  if (currentError) throw currentError;
  if (current?.status !== "sold" || current.stripe_checkout_session_id !== session.id) {
    throw new PurchaseError("This lead has already been purchased or its reservation expired.", 409);
  }
}

export async function getPurchasedLead(session) {
  await markLeadSold(session);

  const { data: lead, error } = await getSupabaseAdmin()
    .from("leads")
    .select("name,phone,postcode,job_type,description")
    .eq("id", session.metadata.lead_id)
    .eq("status", "sold")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();

  if (error) throw error;
  if (!lead) throw new PurchaseError("Purchased lead details could not be loaded.", 404);

  return {
    name: lead.name,
    phone: lead.phone,
    postcode: lead.postcode,
    jobType: lead.job_type,
    description: lead.description,
  };
}
