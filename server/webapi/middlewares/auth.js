const jwt = require("jsonwebtoken");

const verifyemployer = (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader) return res.status(401).json({ error: "No token provided" });

  const token = authheader.split(" ")[1];
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(401).json({error: "Unauthorized acess" });
    req.user = decoded;
  });
  next();

};

const verifyemployee = (req,res,next) => {
  if(req.user.role === 'admin') return next() ;
  res.status(403).json({error: 'You are not authorized'});
}

module.exports = { verifyUser , verifyadmin };
