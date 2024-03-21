const { json } = require('express');
const jwt =require('jsonwebtoken')

const authGuard = (req, res, next) => {
  //  get header authorization
  const authHeader = req.headers.authorization;

  //  check header authorization
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "You are not authenticated",
    });
  }
  // get token from header authorization
  // format: 'Bearer token'
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You donot have access",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};



const authGuardAdmin = (req, res, next) => {
  //  get header authorization
  const authHeader = req.headers.authorization;
  // console.log(authHeader)
  //  check header authorization
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "You are not authenticated",
    });
  }
  // get token from header authorization
  // format: 'Bearer token'
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You donot have access",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // check if user is admin or not
    if(req.user.isAdmin==false){
      return res.json({
        success:false,
        message:"Permission denied!!!"
      })
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};


module.exports = authGuardAdmin;
