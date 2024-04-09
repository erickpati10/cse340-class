const pool = require("../database");

async function searchVehicles(inv_make, inv_model, inv_year, inv_miles, inv_color) {
    try {
        const sql = `
            SELECT * FROM public.inventory 
            WHERE inv_make = $1 AND inv_model = $2 
            AND inv_year = $3 AND inv_miles = $4 AND inv_color = $5`;
        const { rows } = await pool.query(sql, [inv_make, inv_model, inv_year, inv_miles, inv_color]);
        return rows;
    } catch (error) {
        console.error("searchVehicles error " + error);
        throw error; // Re-throwing the error to be handled by the caller
    }
}

module.exports = searchVehicles;
