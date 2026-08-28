const redis=require('../config/redis');
async function bookingRateLimit(req,res,next){ const key=`rate:booking:${req.ip}:${req.user?.id||'anonymous'}`; const now=Date.now(); const windowMs=60000; const member=`${now}-${Math.random()}`; const tx=redis.multi().zremrangebyscore(key,0,now-windowMs).zadd(key,now,member).zcard(key).expire(key,61); const out=await tx.exec(); const count=out[2][1]; if(count>10){ return res.status(429).json({error:'Too Many Requests',message:'Maximum 10 booking requests per minute exceeded'}); } next(); }
module.exports={bookingRateLimit};
