const jwt = require('jsonwebtoken')
const { Error } = require('mongoose')
const userModel = require('../models/user')

const auth = async (req,res,next)=>{
  try {
      const token = req.header('Authorization').replace('Bearer ','')
      const decoded = jwt.verify(token,'thisisharshreddiar')
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