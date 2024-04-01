const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

validate.classificationRule = () => {
  return [
    // name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Provide a correct classification name."),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addClassification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
  const { inv_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/edit", {
      errors,
      title: "Edit " + itemName,
      nav,
      inv_id,
    });
    return;
  }
  next();
};

module.exports = validate;
