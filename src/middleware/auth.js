const jwt = require('jsonwebtoken')
const { Error } = require('mongoose')
require("dotenv").config()

const jwtkey  = process.env.JWTKEY; // JWTKEY is obtained from env file which is used as key to hash the id
const userModel = require('../models/user') // User Model is imported

const auth = async (req,res,next)=>{
  try {
      // Token is obtained form header of request and it contains 'Bearer ' so it is replaced by ''
      const token = req.header('Authorization').replace('Bearer ','')
      const decoded = jwt.verify(token,jwtkey) // Verification of token using secret key.. It returns user
      const user = await userModel.findOne({_id : decoded._id,'tokens.token': token})
      if(!user){
          throw new Error();
      }
      req.token = token
      req.user = user
      next()
  } catch (e) {
      res.status(401).send("Not autheticated")
  }
}

module.exports = auth