import express from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { aboutController } from "./controllers/about-controller.js";

export const router = express.Router();

//Homepage
router.get("/", dashboardController.index);

//About
router.get("/about", aboutController.index);

//Dashboard
router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);

//Station
router.get("/station/:id", stationController.index);
router.post("/station/:id/addreading", stationController.addReading);



