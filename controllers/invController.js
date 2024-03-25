const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav: nav,
      grid,
    });
  } catch (error) {
    console.error("Error building classification view:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Get details of a specific vehicle by inventory_id
invCont.getVehicleDetails = async function (req, res) {
  try {
    const inventory_id = req.params.inventory_id;
    const vehicleDetails = await invModel.getVehicleById(inventory_id);

    if (!vehicleDetails) {
      // Handle case where vehicle details are not found
      return res.status(404).send("Vehicle not found");
    }
    let nav = await utilities.getNav();

    const htmlContent = utilities.wrapVehicleDetailsInHTML(vehicleDetails);
    res.render("./inventory/vehicle", {
      title: vehicleDetails.inv_model,
      nav: nav,
      htmlContent,
    });
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    res.status(500).send("Internal Server Error");
  }
};

// create the page for the links

invCont.renderManagement = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/management", { title: "Vehicle Management", nav });
};

// Render view to add new classification
invCont.renderAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/addClassification", {
    title: "Add Classification",
    nav,
  });
};

// invCont.addNewClassification = async function (req, res) {
//   try {
//     const { classification_name } = req.body;

// Call the model function to insert data into the database
//     let completeClassification =
//       invModel.addClassification(classification_name);

//     // Redirect to appropriate page after adding
//     if (completeClassification) {
//       req.flash("notice", "Classification added successfully.");
//       res.redirect("./");
//     } else {
//       console.error("Error adding new classification:", error);
//       req.flash("notice", "Failed to add classification.");
//       res.redirect("./addClassification");
//     }
//   } catch (error) {
//     next(error);
//   }
// };

/* ***************************
 * Process Add Classification Page Form
 * ************************** */
invCont.addNewClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;

    const registerNewClassification = await invModel.addClassification(
      classification_name
    );

    if (registerNewClassification) {
      req.flash(
        "notice",
        `Congratulations, you just added ${classification_name} as a classification. `
      );
      res.status(201).redirect("./");
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).redir("/addClassification", {
        title: "Add Classification",
        nav: await utilities.getNav(),
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
