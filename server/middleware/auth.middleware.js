const jwt = require('jsonwebtoken')

function auth(req, res, next){
  const token = req.header('x-auth-token')

  //Check for token
  if(!token) res.status(401).json({msg: "No token, authorizaton denied"})
  
  try{
    //Verify Token
    const decoded = jwt.verify(token, '123test456')
    //Add user from payload
    req.user = decoded;
    next();
  } catch(e) {
    res.status(400).json({msg: "Token is not valid"})
  }
}

module.exports = auth;