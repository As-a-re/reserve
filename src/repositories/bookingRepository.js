const db=require('../config/db');
async function lockResource(client,id){ await client.query('SELECT id FROM resources WHERE id=$1 AND active=true FOR UPDATE',[id]); }
async function findOverlap(client,resourceId,start,end){ const r=await client.query(`SELECT id FROM bookings WHERE resource_id=$1 AND status='confirmed' AND tstzrange(starts_at,ends_at,'[)') && tstzrange($2::timestamptz,$3::timestamptz,'[)') LIMIT 1`,[resourceId,start,end]); return r.rows[0]; }
async function create(client,data){ const r=await client.query(`INSERT INTO bookings(id,resource_id,user_id,starts_at,ends_at,status) VALUES($1,$2,$3,$4,$5,'confirmed') RETURNING *`,[data.id,data.resourceId,data.userId,data.startsAt,data.endsAt]); return r.rows[0]; }
async function cancel(client,id,userId){ const r=await client.query(`UPDATE bookings SET status='cancelled' WHERE id=$1 AND user_id=$2 AND status='confirmed' RETURNING *`,[id,userId]); return r.rows[0]; }
async function getById(id){ const r=await db.query('SELECT * FROM bookings WHERE id=$1',[id]); return r.rows[0]; }
module.exports={db,lockResource,findOverlap,create,cancel,getById};
