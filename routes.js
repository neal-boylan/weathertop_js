import express from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";

export const router = express.Router();

//Homepage

//About
router.get("/about", aboutController.index);

//Dashboard
router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);

//Station
router.get("/station/:id", stationController.index);
router.post("/station/:id/addreading", stationController.addReading);

//Accounts
router.get("/", accountsController.index);
router.get("/login", accountsController.login);
router.get("/signup", accountsController.signup);
router.get("/logout", accountsController.logout);
router.post("/register", accountsController.register);
router.post("/authenticate", accountsController.authenticate);

