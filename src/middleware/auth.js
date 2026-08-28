const jwt=require('jsonwebtoken');
function authenticate(req,res,next){ const h=req.headers.authorization; if(!h?.startsWith('Bearer ')) return res.status(401).json({error:'Unauthorized'}); try { req.user=jwt.verify(h.slice(7),process.env.JWT_SECRET); next(); } catch { return res.status(401).json({error:'Invalid or expired access token'}); } }
function authorize(...roles){ return (req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({error:'Forbidden'}); }
module.exports={authenticate,authorize};
