const r=require('express').Router(); const c=require('../controllers/authController'); r.post('/register',c.register);r.post('/login',c.login);r.post('/refresh',c.refresh);module.exports=r;
