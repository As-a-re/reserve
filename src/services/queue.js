const {Queue}=require('bullmq');
const u=new URL(process.env.REDIS_URL||'redis://localhost:6379');
const connection={host:u.hostname,port:Number(u.port||6379),password:u.password||undefined};
const queue=new Queue('notifications',{connection});
const dlq=new Queue('notifications-dlq',{connection});
async function enqueue(type,payload){return queue.add(type,payload,{attempts:4,backoff:{type:'exponential',delay:2000},removeOnComplete:100,removeOnFail:false});}
module.exports={queue,dlq,enqueue,connection};
