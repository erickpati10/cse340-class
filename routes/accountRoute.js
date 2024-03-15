// account Routes
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Deliver Login view

router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Deliver Registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process registration

router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

// Export the router for use in server.js
module.exports = router;
