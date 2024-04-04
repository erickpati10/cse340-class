const utilities = require(".");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

// ####################################### Unit 5 ######################################################

// **********************************
// *  Login Rules

// **********************************

validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};
/* ******************************
 * Check data Login
 * ***************************** */

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};




/* ******************************
 * Validation rules for updating account information
 * ***************************** */
validate.updateAccountRules = () => {
  return [
    // Firstname is required and must be a string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name.")
      .isString()
      .withMessage("First name must be a string"),

    // Lastname is required and must be a string
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name.")
      .isString()
      .withMessage("Last name must be a string"),

    // Email is required and must be a valid email format
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (value, { req }) => {
        if (!req.user) {
          // If user information is not available, proceed without validation
          return;
        }
        const existingAccount = await accountModel.getAccountByEmail(value);
        if (existingAccount && existingAccount._id.toString() !== req.user._id.toString()) {
          throw new Error('Email is already registered. Please use a different email.');
        }
      })



  ];
};


// ****************************************** TASkS *****************************************

/* ******************************
 * Check data for account
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req);
  let nav = utilities.getNav()
  if (!errors.isEmpty()) {
    return res.render("account/updateAccount", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors,
    });
  }
  next();
};



/* ******************************
 * Validation rules 
 * ***************************** */
validate.updatePasswordRules = () => {
  return [
    // New password is required and must be a strong password
    body("new_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password pattern is incorrect!")
  ];
};


/* ******************************
 * Check data 
 * ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  let nav = utilities.getNav()
  if (!errors.isEmpty()) {
    return res.render("account/updateAccount", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors
    });
  }
  next();
};

module.exports = validate;
