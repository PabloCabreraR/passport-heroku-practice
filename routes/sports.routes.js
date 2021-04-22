const express = require('express')
const router  = express.Router()

const Sport = require('../models/Sport.model')
const User = require('../models/User.model')

// Middleware CheckForAuth
// req.isAuthenticated() --true si esta logeado.
const checkForAuth = (req, res, next) => {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page */
router.get('/new', checkForAuth, (req, res, next) => {
  res.render('sports/newSport')
})

router.post('/new', (req, res) => {
  // req.user te da acceso al usuario que tiene la sesion iniciada.
  Sport.create(req.body)
    .then(result => {
      User.findByIdAndUpdate(req.user._id, {$push: {sports: result._id}})
      .then(()=>{
        res.redirect('/profile')
      })
    })
    .catch(error => {
      res.render('error')
    })
})

module.exports = router