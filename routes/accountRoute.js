// account Routes
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Deliver Login view

router.get("/login", utilities.handleErrors(accountController.buildLogin));

// view Management account

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.showAccountManagement)
);

// Deliver Registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Login Process the registration data
// Unit 4 - stickiness activity
// Modified in Unit 5 - Login Process
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// **********************************************

//Deliver Account Management Page
router.get("/", utilities.handleErrors(accountController.accountLoginSuccess));


// Deliver the account update view
router.get("/updateAccount", utilities.handleErrors(accountController.updateAccountPage));

// Route to process the account update request
router.post("/updateAccount",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount));

// Route to process the password update request
router.post("/update_password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(
  accountController.updatePassword));


router.get("/logout", utilities.handleErrors( accountController.logout));

// Export the router for use in server.js
module.exports = router;
