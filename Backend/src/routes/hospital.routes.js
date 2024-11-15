import { Router } from "express";
import { verifyJWT } from "../middlewares/index.js";
import {
  addPatient,
  removePatient,
  addDoctor,
  removeDoctor,
  addSensor,
  assignDoctor,
  dismissDoctor,
  getRegDoctors,
  getAdmittedPatients,
  getAllDoctors,
  getallsensors,
} from "../controllers/hospital.controller.js";

const router = Router();

router.route("/add-patient").post(verifyJWT, addPatient); //tested
router.route("/remove-patient").patch(verifyJWT, removePatient); 
router.route("/add-doctor").post(verifyJWT, addDoctor); //tested
router.route("/remove-doctor").delete(verifyJWT, removeDoctor);
router.route("/add-sensor").post(verifyJWT, addSensor); //tested
router.route("/assign-doctor").post(verifyJWT, assignDoctor); //tested
router.route("/dismiss-doctor").delete(verifyJWT, dismissDoctor);
router.route("/get-reg-doctors").get(verifyJWT, getRegDoctors);
router.route("/get-admitted-patients").get(verifyJWT, getAdmittedPatients);
router.route("/get-doctors").get(verifyJWT,getAllDoctors);
router.route("/get-all-sensors").get(verifyJWT,getallsensors);


export default router;
