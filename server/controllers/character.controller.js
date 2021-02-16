// eslint-disable-next-line no-unused-vars
const Character = require("../models/Character.js");

// Display list of all the user's characters.
const character_list = (req, res) => {
    res.status(501).send('NOT IMPLEMENTED: character list');
}

// Display detail page for a specific character.
const character_detail = (req, res) => {
    res.send();
    // Character.find(
    //     {
    //         characterid: req.params.characterid
    //     },
    //     (err, character) => {
    //         if (err) return next(err);
    //         if (res.locals.auth && res.locals.auth.username == character.player.username) {
    //             return res.status(200).json(character.private);
    //         }
    //         return res.status(400).json(character.public);
    // })
    res.status(501).send('NOT IMPLEMENTED: character details');
}

const delete_character = (req, res) => {
    res.status(501).send('NOT IMPLEMENTED: delete character');
}

const update_character = (req, res) => {
    res.status(501).send('NOT IMPLEMENTED: update character');
}

const create_character = (req, res) => {
    res.status(501).send('NOT IMPLEMENTED: create character');
}

module.exports = { character_list, character_detail, delete_character, update_character, create_character }