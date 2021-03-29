const router = require("express").Router();
const character_controller = require('../controllers/character.controller');
const { attachUserInfo } = require('../controllers/user.controller');
const {parseEquipment, fillModel} = require('./middleware/characterMiddleware');
const { useDispatch } = require('react-redux');

// Validates that a character follows the rules when being altered
const validateCharacter = (req, res, next) => {
    console.log(req.body);
    let equipment = parseEquipment(req.body.equipment);
    req.body = fillModel(equipment, req);
    const dispatch = useDispatch();
    dispatch(submitCharacter(req.body));
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

// Requires the user information - TO REEVALUATE
//router.use(attachUserInfo);

//  @route POST /characters/create
//  @desc Create character
//  @access Public
router.post("/create", validateCharacter, character_controller.create_character);

//  @route GET /character/
//  @desc Return character list
//  @access Public
router.get('/', attachUserInfo, character_controller.character_list);

// Requires the character information for routes referencing a character
router.param('characterid', attachUserInfo, character_controller.attachCharacterInfo);

//  @route GET /characters/:characterid
//  @desc Return character
//  @access Public
router.get("/:characterid", attachUserInfo, character_controller.character_detail);

//  @route PUT /characters/:characterid
//  @desc Update character
//  @access Private
router.put("/:characterid", attachUserInfo, requireOwnership, validateCharacter, character_controller.update_character);

//  @route DELETE /characters/:characterid
//  @desc Delete character
//  @access Private
router.delete("/:characterid", attachUserInfo, requireOwnership, character_controller.delete_character);

module.exports = router;
