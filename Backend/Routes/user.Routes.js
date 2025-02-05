const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user.Controller');
const upload = require('../Middleware/upload');  

// Register Route
router.post('/register', userController.register);

// Login Route
router.post('/login', userController.login);

// Profile Route
router.post('/profile', userController.profile);

// Update User Route
router.put("/update", upload.single("avatar"), userController.updateUser);

// Update Password Route
router.put("/update-password", userController.updatePassword);

// Update Email Route
router.put("/update-email", userController.updateEmail);

// Search Email Route
router.get("/search-email", userController.searchEmail);

// Get User by ID Route
router.get("/:userId", userController.getUserById);

// Get All Users Route
router.get("/", userController.getAllUsers);

// Update User Role Route
router.put("/:userId/update-role", userController.updateUserRole); 

// Delete User Route
router.delete("/:userId", userController.deleteUser); 

module.exports = router;