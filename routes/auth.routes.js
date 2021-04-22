const express = require('express')
const router  = express.Router()

const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/User.model')


// GET signup page
router.get('/signup', (req, res) => {
  res.render('user/signup')
})

// POST signup
router.post('/signup', (req, res) => {
  const {username, password} = req.body
  // Check if username and password are not empty
  // Check if the username already exists
  if(username === "" || password === ""){
    res.render('user/signup', {errorMessage: "You have to fill all the fields"})
  }

  User.findOne({username})
    .then(user => {

      if(user){
        res.render('user/signup', {errorMessage: "This username already exists"})

      }else{
        const hashedPassword = bcrypt.hashSync(password, 10)
        User.create({username, password: hashedPassword})
          .then(result=>{
            res.redirect('/login')
          })
      }
    })
    .catch(error => {
      res.send(error)
    })
})


// GET login page
router.get('/login', (req, res) => {
  res.render('user/login', {errorMessage: req.flash('error')})
})

// POST login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

// LOGOUT
router.get('/logout', (req, res)=>{
  req.logout()
  res.redirect('/')
})


module.exports = router