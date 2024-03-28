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
      return res.status(501).render("inventory/addInventory", {
        title: "Add Inventory",
        nav: await utilities.getNav(),
        classificationSelect: await utilities.buildClassificationList(),
      });
    }
  } catch (error) {
    next(error);
  }
};
// **************************************
// Render view to add new Inventory
// **************************************

invCont.renderAddInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("inventory/addInventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect,
  });
};

invCont.addNewInventory = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
    const addVehicle = await invModel.addNewInventory(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );
    if (addVehicle) {
      req.flash(
        "notice",
        `Congratulations, you just added ${inv_make} ${inv_model} as a new Car.`
      );

      res.status(201).redirect("/inv");
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("inventory/addInventory", {
        title: "Add Inventory",
        nav: await utilities.getNav(),
        classificationSelect: await utilities.buildClassificationList(),
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
