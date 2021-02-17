<<<<<<< HEAD
=======
const jwt = require("jsonwebtoken");
const validator = require('validator');
const User = require("../../models/User.js");

>>>>>>> backend/routing
// Express middleware to verify a user's credentials and pass them on to the calling route for usage.
// Restricts access to only signed-in users on the route it is applied to
const authenticateUser = (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const userCookie = req.cookies.auth; //Reminder: cookie MUST be set with the auth header

<<<<<<< HEAD
  if(!userCookie) {
    res.status(401).send("No authorization token found. Please login to continue if this is your profile.");
    res.locals.auth = null;
    return next();
=======
  if (!userCookie) {
    return res.status(401).send("No authorization token found. Please login to continue if this is your profile.");
>>>>>>> backend/routing
  }

  jwt.verify(userCookie, `${process.env.JWT_SECRET}`, (error, decoded) => {
    if (error) {
<<<<<<< HEAD
      res.status(403).send("Authorization token could not be verified. Please clear your cookies and sign in again.")
      res.locals.auth = null;
      return next();
=======
      return res.status(403).send("Authorization token could not be verified. Please clear your cookies and sign in again.")
>>>>>>> backend/routing
    }
    res.locals.auth = decoded; //Automatically adds the JWT payload to the middleware chain for further use.
    return next(); //Proceeds beyond the middleware to the actual route.
  });
}

<<<<<<< HEAD
module.exports = authenticateUser;
=======
//Deauthenticates a signed-in user
// const deauthenticateUser = (req, res, next) => {
//   res.clearCookie('auth').send("Cookie cleared.");
// }

const validateLoginForm = (req, res, next) => {
  const errors = {};
  let isFormValid = true;

  const {email, username, password} = req.body

  if(username && email){
    return res.status(400).json({
      success: false,
      message: "Please provide your email OR username.",
    });
  } else {
    if ((!username) && (!req.body || typeof email !== "string" || email.trim().length === 0)) {
      isFormValid = false;
      errors.email = "Please provide your email address.";
    } 
    if ((!email) && (!req.body || typeof username !== "string" || username.trim().length === 0)){
      isFormValid = false;
      errors.email = "Please provide your email address.";
    }
  
    if (!req.body || typeof password !== "string" || password.trim().length === 0) {
      isFormValid = false;
      errors.password = "Please provide your password.";
    }

    if (!isFormValid) {
      return res.status(400).json({
        success: false,
        message: "Check the form for errors.",
        errors: errors,
      });
    }
  }

  return next();
}

function validateRegistrationForm(req, res, next) {
  const errors = {};
  let isFormValid = true;

  const { email, username, password } = req.body

  if (!req.body || typeof email !== "string" || !validator.isEmail(email)) {
    isFormValid = false;
    errors.email = "Please provide a correct email address.";
  }

  if (!req.body || typeof password !== "string" || password.trim().length < 8) {
    isFormValid = false;
    errors.password = "Password must have at least 8 characters.";
  }

  if (!req.body || typeof username !== "string" || username.trim().length === 0) {
    isFormValid = false;
    errors.username = "Please provide your username.";
  }

  User.findOne({ email: email }).then((user) => {
    if (user) {
      isFormValid = false;
      errors.email = "This email is already taken.";
    }
  }).catch(err => console.log(err.message));

  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      isFormValid = false;
      errors.username = "This username is already taken.";
    }
  }).catch(err => console.log(err.message));

  if (!isFormValid) {
    return res.status(400).json({
      success: false,
      message: "Check the form for errors.",
      errors: errors,
    });
  }

  return next();
}

module.exports = { authenticateUser, validateLoginForm, validateRegistrationForm }
>>>>>>> backend/routing

/*
JWT+cookie initialization upon successful login:
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({username: username, //any other data//}, process.env.JWT_SECRET, (error, token) => {
    if (error)
      return res.status(500).send("Error in creating authentication token. Please try again.");
    
      res.cookie('auth', token, 
        {maxAge: 360000, httpOnly: true})
        .send("Authentication cookie set."); //MAY REQUIRE cors package with use with fetch()...CHECK!
  });
Cookie deletion on successful logout:
  res.clearCookie('auth').send("Cookie cleared.");
Password hashing upon successful signup:
  const bcrypt = require('bcrypt');
  let hashedPassword;
  bcrypt.hash(password, 10, (error, hash) => {
    if (error) 
      return res.status(500).send("Some error who knows.");
    hashedPassword = hash;
  })
Password hashing for verification on login:
  const bcrypt = require('bcrypt');
  bcrypt.compare(password, hash, (error, result) => {
    if (error) 
      return res.status(500).send("Database comparison error.");
    if (!result)
      return res.status(404).send("Incorrect login.");
  })
*/

/* 
How to restrict a route to authenticated users only:
    app.get('/whatever', authenticateUser, (req, res) => {
      //stuff
    });
*/
