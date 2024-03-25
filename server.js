/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const session = require("express-session");
const pool = require("./database/");

const baseController = require("./controllers/baseController");
const accountRouter = require("./routes/accountRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const invController = require("./controllers/invController");

const express = require("express");
const bodyParser = require("body-parser");

const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const utilities = require("./utilities/");

// Serve static files from the 'public' directory
app.use(express.static("public"));

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Serve favicon
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "images", "favicon.ico"));
});

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* ***********************
 * Routes
 *************************/
app.use(static);
app.use("/account", accountRouter);
app.use("/inv", inventoryRoute);
app.get("/inv/detail/:inventory_id", invController.getVehicleDetails);

// app.use(require("./routes/static"));

//index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// app.use("/inv", reqquire("./routes/inventoryRoute"));

// Account Routes
app.use("/account", require("./routes/accountRoute"));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});
