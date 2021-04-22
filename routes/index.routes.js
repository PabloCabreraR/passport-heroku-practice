const express = require('express')
const User = require('../models/User.model')
const router  = express.Router()

const checkForAuth = (req, res, next) => {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page */
router.get('/', (req, res) => {
  res.render('index')
})

router.get('/profile', checkForAuth, (req, res) =>{
  User.findById(req.user._id)
    .populate('sports')
    .then(result => {
      res.render('user/profile', result)
    })
    .catch(error => {
      res.render('error')
    })
})

module.exports = router
