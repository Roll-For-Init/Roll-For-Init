// eslint-disable-next-line no-unused-vars
const Party = require("../models/Party.js");

//Projections
// eslint-disable-next-line no-unused-vars
const projections = {
    public: { _id: 0 },
    private: { _id: 0 },
    all: {}
}

// Identical error handling per route for security reasons
const throwError = (res, code, message, err) => {
    if (process.env.NODE_ENV === 'development'){
        if (err) console.log("Unexpected error: ", err);
    }
    return res.status(code).json({message: message});
}

// Middleware that attaches party info to the req
// eslint-disable-next-line no-unused-vars
const attachPartyInfo = (req, res, next, id) => {
    next();
}

// Display list of all the user's partys.
const party_list = (req, res) => {
    return throwError(res, 500, "Not Implemented.");
}

// Display detail page for a specific party.
const party_detail = (req, res) => {
    return throwError(res, 500, "Not Implemented.");
}

const delete_party = (req, res) => {
    return throwError(res, 500, "Not Implemented.");
}

const update_party = (req, res) => {
    return throwError(res, 500, "Not Implemented.");
}

const create_party = (req, res) => {
    const party = new Party(req.body);
    Party.create(party).then(newParty => {
        if(!newParty) return throwError(res, 500, "Error creating party.")
        return res.status(200).json(newParty);
    }).catch(err => {
        throwError(res, 500, "Error creating party.", err)
    });
}


module.exports = { party_list, party_detail, delete_party, update_party, create_party, attachPartyInfo }