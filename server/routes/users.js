const router = require("express").Router();
const { authenticateUser, validateLoginForm, validateRegistrationForm } = require("./middleware/userAuthMiddleware");
const user_controller = require('../controllers/user.controller')

//  @route POST /users/register
//  @desc Register user
//  @access Public
router.post("/register", validateRegistrationForm, user_controller.register_user);

// @route POST /users/login
// @desc Login user 
// @access Public
router.post("/login", validateLoginForm, user_controller.login_user);

// @route POST /users/logout
// @desc Login user 
// @access Public
router.post("/logout", authenticateUser, user_controller.logout_user)

//  @route GET /users/
//  @desc Return user list, may pass url query
//  @access Private
// TODO: Restrict to admin
router.get('/', authenticateUser, user_controller.user_list);

//  @route GET /users/:username
//  @desc Return user
//  @access Public
router.get("/:username", authenticateUser, user_controller.user_detail);

//  @route PUT /users/:username
//  @desc Update user
//  @access Public
router.put("/:username", authenticateUser, user_controller.update_user);

//  @route DELETE /users/:username
//  @desc Delete user
//  @access Public
router.delete("/:username", authenticateUser, user_controller.delete_user);

module.exports = router;
