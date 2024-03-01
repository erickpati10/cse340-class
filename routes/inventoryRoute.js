// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventory_id", invController.getVehicleDetails);

// / Route to display details of a specific vehicle

// router.get("/detail/:inventory_id", async (req, res) => {
//   const nav = await utilities.getNav();
//   res.render("./inventory/detail", {
//     title: "Your Title",
//     nav,
//   });
// });

module.exports = router;
