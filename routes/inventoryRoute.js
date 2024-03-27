// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventory_id", invController.getVehicleDetails);

// *******************************************

router.get("/", invController.renderManagement);

// Route to render the view for adding a new classification
router.get("/addClassification", invController.renderAddClassification);

// Route to handle adding a new classification
router.post("/addClassification", invController.addNewClassification);

// Route to render the view for adding a new inventory item
router.get("/addInventory", invController.renderAddInventory);

// Route to handle adding a new inventory item
router.post("/addInventory", invController.addNewInventory);

// / Route to display details of a specific vehicle

// router.get("/detail/:inventory_id", async (req, res) => {
//   const nav = await utilities.getNav();
//   res.render("./inventory/detail", {
//     title: "Your Title",
//     nav,
//   });
// });

module.exports = router;
