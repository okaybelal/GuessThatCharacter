import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: any, res: any) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await sql`DELETE FROM rooms WHERE updated_at < now() - interval '24 hours' RETURNING code`;
  res.status(200).json({ deleted: rows.length });
}
