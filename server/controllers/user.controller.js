const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/User.js");

// Projections  https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
const projections = {
    public: { _id: 0, password: 0 },
    private: { _id: 0, password: 0 },
    friends: { _id: 0, password: 0 }
}

// Middleware that attaches character info to the req
const attachUserInfo = (req, res, next) => {
    User.findById(req.locals.auth.id, projections.all).then(user => {
        if (!user) return throwError(res, 401, "No Content.");
        req.user = user;
        return next();
    }).catch(err => throwError(res, 401, "No Content.", err));
}

// Identical error handling per route for security reasons
const throwError = (res, code, message, err) => {
    if (process.env.NODE_ENV === 'development'){
        if (err) console.log("Unexpected error: ", err);
    }
    return res.status(code).json({message: message});
}

// Display lists of users.
const user_list = (req, res) => {
    const query = req.query;
    const projection = projections.public
    if(query){
        User.find(query, projection).then(users => {
            if(!users) throwError(res, 500, "Database Error");
            return res.status(200).json(users);
        }).catch(err => {
            return throwError(res, 500, "Database Error", err);
        })
    } else {
        return res.status(501).send('NOT IMPLEMENTED: user list');
    }
}

// Display detail page for a specific user.
const user_detail = (req, res) => {
    // TODO: Alter this check if we want user info to be truly public, i.e. show the existance of users to the outside world
    if (!res.locals.auth) return throwError(res, 401, "No Content.");

    let projection = projections.public;

    if (res.locals.auth.username == req.params.userid) {
        projection = projections.private
    } else if (res.locals.auth.username){
        // Friend/party exclusive info?
        User.find({username: res.locals.auth.username}).then(user => {
            if (user && user.friends && user.friends.includes(res.locals.auth.id)) {
                projection = projections.friends
            }
        })
    }

    // Defaults to username parameter
    User.find({username: req.params.username}, projection).then(user => {
        if (!user) return throwError(res, 401, "No Content.");
        return res.status(200).json(user);
    }).catch(err => throwError(res, 401, "No Content.", err));
}

// Delete user
const delete_user = (req, res) => {
    let query = { username: req.params.username }

    //Checks that the user id's match
    User.findOne(query).then(user => {
        if(!user) return throwError(res, 403, "Action Forbidden.");
        if(user.id !== res.locals.auth.id) return throwError(res, 403, "Action Forbidden.");
    })

    User.findOneAndDelete(query, (err, deletedUser) => {
        if (err) return throwError(res, 403, "Action Forbidden.", err);
        if(deletedUser){
            return res.status(200).send('Successfully deleted user.');
        } else {
            return throwError(res, 403, "Action Forbidden.");
        }
    })
}

// Update user
const update_user = async(req, res) => {
    let query = { username: req.params.username }
    let oldUser = {}
    console.log("Attempting to update user:", req.params.username);
    //Checks that the user id's match
    User.findOne(query).then(user => {
        if(!user) return throwError(res, 403, "Action forbidden.");
        if(user.id !== res.locals.auth.id) return throwError(res, 403, "Action forbidden.")
        oldUser = user;
        console.log("Found user:", req.params.username);
    }).catch(err => throwError(res, 403, "Action forbidden.", err))

    const updates = req.body

    // TODO: Add old password check to change password
    if (updates.password) {
        console.log("Updating password.");
        try {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            updates.password = hashedPassword;
        } catch(err) {
            if(err) return throwError(res, 403, "Action forbidden.", err);
        }
    }

    console.log("Applying:", updates);

    User.findOneAndUpdate(query, {$set: updates}, { new: true })
    .then(newUser => {
        if(!newUser) 
            return throwError(res, 403, "Action forbidden.")
        
        newUser.save()
        console.log("Successfully updated user:", req.params.username);
        
        if(Object.keys(updates).includes('password')){
            return res.clearCookie('auth').status(200).json({old: oldUser, new: newUser});
        } else {
            return res.status(200).json({old: oldUser, new: newUser});
        }
    }).catch(err => throwError(res, 403, "Action forbidden.", err));
    // return res.status(500).send('hashing error');
}

// Register user
const register_user = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err || !hash) return throwError(res, 500, "Error registering user.");
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });
        //TODO: Write this function
        // sendAuthenticationEmail(req, user);
        User.create(user).then(newUser => {
            if(!newUser) return throwError(res, 500, "Error registering user.")
            return res.status(200).json(newUser);
        }).catch(err => throwError(res, 500, "Error registering user.", err));
    })
}

// Login user
const login_user = (req, res) => {
    // Log in with either username or email
    let query = {}
    if (req.body.email && !req.body.username){
        query = { email: req.body.email };
    } else if (req.body.username && !req.body.email){
        query = { username: req.body.username };
    }

    User.findOne(query).then(user => {
        console.log("Attempting to sign in user:", user.username);
        if (!user) return throwError(res, 401, "Invalid credentials.");
        bcrypt.compare(req.body.password, user.password).then(response => {
            if (response === false) return throwError(res, 401, "Invalid credentials.");
            // TODO: Research if this is safe to leave id in payload
            const jwtPayload = { 
                id: user.id,
                username: user.username,
            };
            console.log("Successfully signed in user: ", user.username);
            jwt.sign(jwtPayload, `${process.env.JWT_SECRET}`, (error, token) => {
                if (error) return throwError(res, 401, "Invalid credentials.", error)
                /*
                //MAY REQUIRE cors package with use with fetch()...CHECK!
                //TODO: EMAIL VERIFICATION
                if (user.email_verified === false) {
                    const error = new Error('Email has not been verified');
                    error.name = 'UnverifiedEmail';
                    return done(error);
                }
                */
                return res.status(200).cookie('auth', token, { maxAge: 360000, httpOnly: false }).send("Authentication cookie set.");
            });
        }).catch(err => throwError(res, 401, "Invalid credentials.", err));
    }).catch(err => throwError(res, 401, "Invalid credentials.", err));
}

// Logout user
const logout_user = (req, res) => {
    res.clearCookie('auth').status(200).send("Successfully logged out. Cookie cleared.");
}

module.exports = { user_list, user_detail, delete_user, update_user, register_user, login_user, logout_user, attachUserInfo }