const jwt = require('jsonwebtoken');
module.exports = (req, res, next) =>{
  try{
    const token  = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'secretkey');
    console.log(verify);
    next(); // if token is valid then we call next() to continue to the next middleware or route handler
  }catch(err)
  {
    return res.status(401).json({
      msg: "invalid token",
    })
  }
}