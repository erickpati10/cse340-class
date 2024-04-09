// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const searchController = require("../controllers/searchController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventory_id", invController.getVehicleDetails);

// *******************************************

router.get("/", invController.renderManagement);

// Route to render the view for adding a new classification
router.get("/addClassification", invController.renderAddClassification);

// Route to handle adding a new classification
router.post("/addClassification", invController.addNewClassification);

/************************************
 * Get inventory for AJAX route
 * Unit 5 - Select inv item activity
 ************************************* */

// Add the search route here
router.get("/searchVehicles", searchController.showSearchForm);
router.get("/searchVehicles", searchController.search);



router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to render the view for adding a new inventory item
router.get("/addInventory", invController.renderAddInventory);

// Route to handle adding a new inventory item
router.post("/addInventory", invController.addNewInventory);



router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);

router.post("/update/", invController.updateInventory);

router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteConfirmation)
);

router.post("/delete/",   
utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;
