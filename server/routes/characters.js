const router = require("express").Router();
const character_controller = require('../controllers/character.controller');
const { attachUserInfo } = require('../controllers/user.controller');

// Validates that a character follows the rules when being altered
const validateCharacter = (req, res, next) => {
    console.log("hello??");
    return next()
}

// Middleware that requires the user be the characters player in order to access
const requireOwnership = (req, res, next) => {
    // req.user.characters.forEach(char => {
    //     if(char.id !== id) return;
    //     Character.findById(id).then(character => {
    //         if(character.player.id !== req.user.id) return throwError(res, 403, "Action Forbidden.");
    //     });
    // });
    req.ownership = true;
    return next();
}

// Requires the user information
router.use(attachUserInfo);

//  @route GET /character/
//  @desc Return character list
//  @access Public
router.get('/', character_controller.character_list);

//  @route POST /characters/create
//  @desc Create character
//  @access Public
router.post("/create", validateCharacter, character_controller.create_character);

// Requires the character information for routes referencing a character
router.param('characterid', character_controller.attachCharacterInfo);

//  @route GET /characters/:characterid
//  @desc Return character
//  @access Public
router.get("/:characterid", character_controller.character_detail);

//  @route PUT /characters/:characterid
//  @desc Update character
//  @access Private
router.put("/:characterid", requireOwnership, validateCharacter, character_controller.update_character);

//  @route DELETE /characters/:characterid
//  @desc Delete character
//  @access Private
router.delete("/:characterid", requireOwnership, character_controller.delete_character);

module.exports = router;
