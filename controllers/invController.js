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

// Render view to add new classification
invCont.renderAddClassification = function (req, res) {
  // Render the view to add new classification
  res.render("./inventory/addClassification", {
    title: "Add New Classification",
  });
};

// Handle adding new classification
invCont.addNewClassification = async function (req, res) {
  try {
    // Logic to add new classification
    // Example: const newClassification = await invModel.createClassification(req.body);
    // Redirect to appropriate page after adding
    res.redirect("/inventory");
  } catch (error) {
    console.error("Error adding new classification:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Render view to add new inventory
invCont.renderAddInventory = function (req, res) {
  // Render the view to add new inventory
  res.render("./inventory/addInventory", { title: "Add New Inventory" });
};

// Handle adding new inventory
invCont.addNewInventory = async function (req, res) {
  try {
    // Logic to add new inventory
    // Example: const newInventoryItem = await invModel.createInventoryItem(req.body);
    // Redirect to appropriate page after adding
    res.redirect("/inventory");
  } catch (error) {
    console.error("Error adding new inventory:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = invCont;
