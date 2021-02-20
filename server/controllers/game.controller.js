// eslint-disable-next-line no-unused-vars
const config = require("../../config/config.js");
const Game = require("../models/Game.js");

//Projections
// eslint-disable-next-line no-unused-vars
const projections = {
    public: { _id: 0 },
    private: { _id: 0 },
    party: { _id: 0 },
    all: {}
}

// Identical error handling per route for security reasons
const throwError = (res, code, message, err) => {
    if (config.isDev){
        if (err) console.log("Unexpected error: ", err);
    }
    return res.status(code).json({message: message});
}

// Middleware that attaches game info to the req
// eslint-disable-next-line no-unused-vars
const attachGameInfo = (req, res, next, id) => {
    next();
}

// Display list of all the user's games.
const game_list = (req, res) => {
    return throwError(res, 500, "Not Implemented.");
}

// Display detail page for a specific game.
const game_detail = (req, res) => {
    return throwError(res, 500, "Not Implemented.");
}

const delete_game = (req, res) => {
    return throwError(res, 500, "Not Implemented.");
}

const update_game = (req, res) => {
    return throwError(res, 500, "Not Implemented.");
}

const create_game = (req, res) => {
    const game = new Game(req.body);
    Game.create(game).then(newGame => {
        if(!newGame) return throwError(res, 500, "Error creating game.")
        return res.status(200).json(newGame);
    }).catch(err => {
        throwError(res, 500, "Error creating game.", err)
    });
}


module.exports = { game_list, game_detail, delete_game, update_game, create_game, attachGameInfo }