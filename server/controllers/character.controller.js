// eslint-disable-next-line no-unused-vars
const config = require('../../config/config.js');
const Character = require('../models/Character.js');

//Projections
const projections = {
  public: { _id: 0, password: 0 },
  private: { _id: 0, password: 0 },
  party: { _id: 0, password: 0 },
  all: {},
};

// Identical error handling per route for security reasons
const throwError = (res, code, message, err) => {
  if (config.isDev) {
    if (err) console.log('Unexpected error: ', err);
  }
  return res.status(code).json({ message: message });
};

// Middleware that attaches character info to the req
const attachCharacterInfo = (req, res, next, id) => {
  let projection = projections.public;
  if (req.ownership === true) {
    projection = projections.private;
  } else if (req.character.party) {
    req.character.party.forEach(partyMember => {
      if (partyMember.player.id === req.user.id) {
        projection = projections.party;
      }
    });
  }
  Character.findById(id, projection)
    .then(character => {
      if (!character) return throwError(res, 401, 'No Content.');
      req.character = character;
      return next();
    })
    .catch(err => throwError(res, 401, 'No Content.', err));
};

// Display list of all the user's characters.
const character_list = (req, res) => {
  const query = req.query;
  const projection = projections.public;
  if (query) {
    Character.find(query, projection)
      .then(characters => {
        if (!characters) throwError(res, 500, 'Database Error');
        return res.status(200).json(characters);
      })
      .catch(err => {
        return throwError(res, 500, 'Database Error', err);
      });
  } else {
    return res.status(501).send('NOT IMPLEMENTED: character list');
  }
};

// Display detail page for a specific character.
const character_detail = (req, res) => {
  return res.status(200).json(req.character);
};

const delete_character = (req, res) => {
  Character.findByIdAndDelete(req.params.characterid)
    .then(deletedCharacter => {
      if (deletedCharacter) {
        return res.status(200).send('Successfully deleted character.');
      } else {
        return throwError(res, 403, 'Action Forbidden.');
      }
    })
    .catch(err => {
      return throwError(res, 403, 'Action Forbidden.', err);
    });
};

const update_character = (req, res) => {
  let id = req.params.characterid;
  let oldCharacter = {};
  console.log('Attempting to update character:', req.params.characterid);
  const updates = req.body;
  console.log('Applying:', updates);
  Character.findByIdAndUpdate(id, { $set: updates }, { new: true })
    .then(newCharacter => {
      if (!newCharacter) return throwError(res, 403, 'Action forbidden.');
      newCharacter.save();
      console.log('Successfully updated character:', req.params.username);
      if (Object.keys(updates).includes('name')) {
        //Do stuff on update name
        return res.status(200).json({ old: oldCharacter, new: newCharacter });
      } else {
        return res.status(200).json({ old: oldCharacter, new: newCharacter });
      }
    })
    .catch(err => throwError(res, 403, 'Action forbidden.', err));
};

const create_character = (req, res) => {
  console.log('in create character', req.body);
  const character = new Character(req.body);
  Character.create(character)
    .then(newCharacter => {
      if (!newCharacter)
        return throwError(res, 500, 'Error registering character.');
      return res.status(200).json(newCharacter);
    })
    .catch(err => {
      throwError(res, 500, 'Error registering character.', err);
    });
};

module.exports = {
  character_list,
  character_detail,
  delete_character,
  update_character,
  create_character,
  attachCharacterInfo,
};
