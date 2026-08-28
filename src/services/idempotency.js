const redis=require('../config/redis');
async function acquire(key){ const lock=`idem:lock:${key}`; const ok=await redis.set(lock,'processing','NX','EX',30); if(ok) return {owner:true,lock}; const cached=await redis.get(`idem:response:${key}`); return {owner:false,cached:cached?JSON.parse(cached):null}; }
async function save(key,response){ await redis.set(`idem:response:${key}`,JSON.stringify(response),'EX',86400); await redis.del(`idem:lock:${key}`); }
module.exports={acquire,save};
