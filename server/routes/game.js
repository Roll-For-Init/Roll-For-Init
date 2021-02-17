const router = require("express").Router();
const { attachUserInfo } = require('../controllers/user.controller');
const game_controller = require('../controllers/game.controller');

// Validates that a character follows the rules when being altered
const validateGame = (req, res, next) => {
    return next()
}

// Middleware that requires the user be the games owner in order to access
const requireOwnership = (req, res, next) => {
    req.ownership = true;
    return next();
}

// Requires the user information
router.use(attachUserInfo);

//  @route GET /games/
//  @desc Return game list
//  @access Public
router.get('/', game_controller.game_list);

//  @route POST /games/create
//  @desc Create game
//  @access Public
router.post("/create", validateGame, game_controller.create_game);

// Requires the character information for routes referencing a character
router.param('gameid', game_controller.attachGameInfo);

//  @route GET /games/:gameid
//  @desc Return game
//  @access Public
router.get("/:gameid", game_controller.game_detail);

//  @route PUT /games/:gameid
//  @desc Update game
//  @access Private
router.put("/:gameid", requireOwnership, validateGame, game_controller.update_game);

//  @route DELETE /games/:gameid
//  @desc Delete game
//  @access Private
router.delete("/:gameid", requireOwnership, game_controller.delete_game);

module.exports = router;
