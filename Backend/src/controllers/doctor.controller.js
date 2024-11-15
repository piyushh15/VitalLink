import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";


const addPatient = asyncHandler(async (req, res) => {
  const { patient_id } = req.body;

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor)throw new ApiError(404, "Doctor not found");
  if (doctor.patients.includes(patient_id))throw new ApiError(409, "Patient already exists");
  doctor.patients.push(patient_id);
  await doctor.save({ validateBeforeSave: false });

  //added by piyush
  const patient = await Patient.findById(patient_id);
  if(!patient)throw new ApiError(404, "Patient not found");
  if(patient.doctors.includes(req.user_id))throw new ApiError(404,"Doctor already included");
  patient.doctors.push(req.user_id);
  await patient.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, doctor, "Patient added successfully"));
});

const removePatient = asyncHandler(async (req, res) => {
  const { patient_id } = req.body;

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  if(doctor.patients.includes(patient_id)){
    doctor.patients.pull(patient_id);
    await doctor.save({ validateBeforeSave: false });
  }

  //added by piyush
  const patient=await Patient.findById(patient_id);
  if(!patient)throw new ApiError(404,"Patient not found");
  if(patient.doctors.includes(req.user_id)){
    patient.doctors.pull(req.user_id);
    await patient.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, patient, "Doctor and Patient removed from each other's list"));
  }

  else throw new ApiError(409,"Patient not found");
});


const getPatientsList = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id }).populate(
    "patients",
  );
  const filteredPatients = doctor.patients.filter((patient) =>
    patient.doctors.includes(doctor._id),
  );

  doctor.patients = filteredPatients.map((patient) => patient._id);
  await doctor.save();

  if (!filteredPatients) {
    throw new ApiError(404, "No Patients not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, filteredPatients, "Patients list"));
});


const getPatientInfo = asyncHandler(async (req, res) => {
  const { patient_id } = req.query;
  const patient = await Patient.findOne({ _id: patient_id }).populate("sensor_id");
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  return res.status(200).json(new ApiResponse(200, patient, "Patient info"));
});


export { addPatient, removePatient, getPatientsList, getPatientInfo };
