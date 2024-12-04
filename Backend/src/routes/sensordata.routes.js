import { Router } from "express";
import {
  addSensorData,
  getSensorData,
} from "../controllers/sensordata.controller.js";

const router = Router();

router.route("/add-sensor-data").post(addSensorData);
router.route("/get-sensor-data/:sensorID").get(getSensorData);

export default router;
