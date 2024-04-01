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
//  Biuld vehivle management view

invCont.renderManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  });
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
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
  const updateResult = await invModel.updateInventory(
    inv_id,
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

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

module.exports = invCont;
