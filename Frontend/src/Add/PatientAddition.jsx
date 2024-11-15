import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientAddition = ({ handleClose }) => {
  const [patientName, setPatientName] = useState("");
  const [birthDate, setBirthDate] = useState(""); // For age calculation
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [selectedSensorId, setSelectedSensorId] = useState("");
  const [assignDoctor, setAssignDoctor] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [sensorIds, setSensorIds] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const getAllSensorsAndRegDoctors = async () => {
      const headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };

      try {
        const sensorsResponse = await axios.get(
          `${process.env.BACKEND_API}/hospital/get-all-sensors`,
          { headers: headersList }
        );
        setSensorIds(sensorsResponse.data.data);

        const doctorsResponse = await axios.get(
          `${process.env.BACKEND_API}/hospital/get-reg-doctors`,
          { headers: headersList }
        );
        setDoctors(doctorsResponse.data.data);
      } catch (error) {
        console.error("Error fetching sensors or doctors:", error);
      }
    };
    getAllSensorsAndRegDoctors();
  }, []);



  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let calculatedAge = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge.toString());
  };

  const handleBirthDateChange = (e) => {
    const selectedDate = e.target.value;
    setBirthDate(selectedDate);
    calculateAge(selectedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{12}$/.test(aadharNumber)) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }

    const payloadforAddPatient = {
      fullName:patientName,
      gender:gender.toLowerCase(),
      age:age,
      sensor_id:selectedSensorId,
      aadhaar:aadharNumber,
    };
   

    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };

    try {
      //send to addpatient route
      let reqOptions1={
        url: `${process.env.BACKEND_API}/hospital/add-patient`,
        method: "POST",
        headers: headersList,
        data: payloadforAddPatient,
      }
      let response=await axios.request(reqOptions1);
      

      
      if (assignDoctor) {
        //send to assignDoctor
        let reqOptions={
          url: `${process.env.BACKEND_API}/hospital/assign-doctor`,
          method: "POST",
          headers: headersList,
          data: {
            patient_id: response.data.data._id,
            doctor_id: selectedDoctor,
          },
        }
        await axios.request(reqOptions);
      }
      
      handleClose();
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="overflow-y-auto no-scrollbar scroll-smooth max-h-[33rem]">
        <div className="mb-4">
          <label className="block mb-2 text-black" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="birthDate">
            Date of Birth
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={birthDate}
            onChange={handleBirthDateChange}
            className="w-full px-3 py-2 text-black border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="gender">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 text-black border rounded"
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="aadhar">
            Aadhar Number
          </label>
          <input
            id="aadhar"
            name="aadhar"
            type="text"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            maxLength={12}
            className="w-full px-3 py-2 text-black border rounded"
            placeholder="Enter 12-digit Aadhar number"
            title="Aadhar number must be exactly 12 digits"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="sensorId">
            Sensor ID
          </label>
          <select
            id="sensorId"
            name="sensorId"
            value={selectedSensorId}
            onChange={(e) => setSelectedSensorId(e.target.value)}
            className="w-full px-3 py-2 border text-black rounded"
            required
          >
            <option value="" disabled>
              Select Sensor ID
            </option>
            {sensorIds.map((sensor, index) => (
              <option key={index} value={sensor._id}>
                {sensor.sensorID}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={assignDoctor}
              onChange={(e) => setAssignDoctor(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Assign a Doctor</span>
          </label>
        </div>

        {assignDoctor && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="doctor">
              Doctor
            </label>
            <select
              id="doctor"
              name="doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-3 py-2 border text-black rounded"
              required={assignDoctor}
            >
              <option value="" disabled>
                Select a Doctor
              </option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor._id}>
                  {doctor.user.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end ">
          <button
            type="button"
            onClick={handleClose}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientAddition;
