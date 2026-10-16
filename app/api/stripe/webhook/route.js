import { markLeadSold } from "../../../../lib/lead-purchases";
import { getStripe } from "../../../../lib/server-clients";

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event;
  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Unable to verify Stripe webhook:", error);
    return Response.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    try {
      await markLeadSold(event.data.object);
    } catch (error) {
      console.error("Unable to mark paid lead as sold:", error);
      return Response.json({ error: "Unable to process paid lead." }, { status: 500 });
    }
  }

  return Response.json({ received: true });
}
