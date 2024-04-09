const Vehicle = require('../models/searchVehicle-model');
const utilities = require('../utilities');

const searchController = {};

searchController.showSearchForm = async (req, res) => {
    try {
        let nav = await utilities.getNav();
        res.render('inventory/searchVehicles', { title: 'Search Vehicles', nav: nav }); 
    } catch (error) {
        console.error("Error getting navigation data: ", error);
        res.status(500).send('Internal Server Error');
    }
};

searchController.search = async (req, res) => {
    const { inv_make, inv_model, inv_year } = req.query;

    try {
        const searchResults = await Vehicle.searchVehicles(inv_make, inv_model, inv_year);
        res.render('inventory/searchVehicles', { searchResults: searchResults }); // Pass searchResults to the view
    } catch (error) {
        console.error("Error searching vehicles: ", error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = searchController;

