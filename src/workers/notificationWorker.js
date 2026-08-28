require('dotenv').config();
const {Worker}=require('bullmq');
const {dlq,connection}=require('../services/queue');
const failureRate=Number(process.env.NOTIFICATION_FAILURE_RATE||0.30);
const worker=new Worker('notifications',async job=>{
  console.log(`[notification] ${job.name} ${job.id} attempt ${job.attemptsMade+1}`);
  await new Promise(r=>setTimeout(r,150));
  if(Math.random()<failureRate) throw new Error('Simulated third-party gateway failure (30%)');
  console.log(`[notification] delivered ${job.name}`,job.data);
},{connection});
worker.on('completed',j=>console.log(`Job ${j.id} completed`));
worker.on('failed',async(j,e)=>{
  console.error(`Job ${j?.id} failed after attempt ${j?.attemptsMade}: ${e.message}`);
  if(j?.attemptsMade>=4){
    await dlq.add('dead-letter', {originalJobId:j.id,name:j.name,data:j.data,error:e.message,failedAt:new Date().toISOString(),attempts:j.attemptsMade});
    console.error(`DLQ: ${j.id} routed to notifications-dlq`);
  }
});
