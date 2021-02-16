const router = require("express").Router();
const { authenticateUser } = require("./middleware/userAuthMiddleware");
const character_controller = require('../controllers/character.controller')

// Validates that a character follows the rules when being altered
const validateCharacter = (req, res, next) => {
    return next()
}

//  @route GET /character/
//  @desc Return character list
//  @access Private
router.get('/', authenticateUser, character_controller.character_list);

//  @route POST /characters/create
//  @desc Create character
//  @access Private
router.post("/create", authenticateUser, validateCharacter, character_controller.create_character);

//  @route GET /characters/:characterid
//  @desc Return character
//  @access Private
router.get("/:characterid", authenticateUser, character_controller.character_detail);

//  @route PUT /characters/:characterid
//  @desc Update character
//  @access Private
router.put("/:characterid", authenticateUser, validateCharacter, character_controller.update_character);

//  @route DELETE /characters/:characterid
//  @desc Delete character
//  @access Private
router.delete("/:characterid", authenticateUser, character_controller.delete_character);

module.exports = router;
