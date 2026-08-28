const jwt = require('jsonwebtoken');
function signAccess(user){ return jwt.sign({sub:user.id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.ACCESS_TOKEN_TTL||'15m'}); }
function signRefresh(user){ return jwt.sign({sub:user.id,role:user.role,type:'refresh'},process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.REFRESH_TOKEN_TTL||'7d'}); }
module.exports={signAccess,signRefresh};
