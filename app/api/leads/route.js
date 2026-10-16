import { getSupabaseAdmin } from "../../../lib/server-clients";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date().toISOString();
    const { data, error } = await getSupabaseAdmin()
      .from("leads")
      .select("id,postcode,job_type,created_at,checkout_reservation_expires_at")
      .or("status.is.null,status.neq.sold")
      .or(`checkout_reservation_expires_at.is.null,checkout_reservation_expires_at.lt.${now}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const leads = (data || []).map((lead) => ({
      id: lead.id,
      jobType: lead.job_type || "Roofing work",
      area: lead.postcode?.replace(/\s/g, "").match(/^([A-Z]{1,2}\d[A-Z\d]?)\d[A-Z]{2}$/i)?.[1] || "London",
    }));

    return Response.json({ leads }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Unable to load available leads:", error);
    return Response.json(
      { error: "Available leads are temporarily unavailable." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
