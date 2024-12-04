import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorPanel = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const navigate = useNavigate(); // Use navigate hook

  const fetchUserDetails = async () => {
    try {
      const headerList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const reqOptions = {
        url: `${import.meta.env.VITE_BACKEND_API}/users/current-user`,
        method: "GET",
        headers: headerList,
      };
      const response = await axios.request(reqOptions);
      const hospitalData = response.data.data.hospital || [];
      const patientData = response.data.data.patients || [];
      setHospitals(hospitalData);
      setDoctorPatients(patientData);
      setFilteredPatients(patientData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterPatients(query, selectedHospital);
  };

  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedHospital(selectedValue);
    filterPatients(searchQuery, selectedValue);
  };

  const filterPatients = (query, hospital) => {
    let filtered = doctorPatients;

    if (query) {
      filtered = filtered.filter((patient) =>
        patient.fullName.toLowerCase().includes(query)
      );
    }

    if (hospital) {
      filtered = filtered.filter(
        (patient) => patient.hospital_id === hospital
      );
    }

    setFilteredPatients(filtered);
  };

  const showReport = async (sensorID) => {
    try {
      const headerList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const reqOptions = {
        url: `${import.meta.env.VITE_BACKEND_API}/sensor/get-sensor-data/${sensorID}`,
        method: "GET",
        headers: headerList,
      };
  
      const response = await axios.request(reqOptions);
      console.log(response.data);
  
      if (response.status === 200) {
        navigate("/PatientDataPanel", { state: { sensorData: response.data.data } });
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-blue-white text-gray-800 font-poppins">
      <Header isHomePage={false} isDoctor={true} />
      <main className="flex-grow text-center">
        <div className="mx-20 mt-8 bg-blue-50">
          <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg shadow">
            <input
              type="text"
              placeholder="Search by name"
              className="border border-gray-300 p-2 rounded-lg w-1/2"
              value={searchQuery}
              onChange={handleSearch}
            />
            <select
              className="border border-gray-300 p-2 rounded-lg w-1/3"
              value={selectedHospital}
              onChange={handleFilterChange}
            >
              <option value="">All Hospitals</option>
              {hospitals.map((hospital) => (
                <option key={hospital._id} value={hospital._id}>
                  {hospital.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto shadow rounded-lg max-h-[500px] overflow-y-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-blue-200 text-black text-xl font-palanquin text-center">
                  <th className="p-4">S.No</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Age</th>
                  <th className="p-4">Sensor Id</th>
                  <th className="p-4">Hospital</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-blue-100 border-b font-palanquin text-center text-xl"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{patient.fullName}</td>
                    <td className="p-4">{patient.age}</td>
                    <td className="p-4">{patient.sensor_id.sensorID}</td>
                    <td className="p-4">
                      {hospitals.find(
                        (hospital) => hospital._id === patient.hospital_id
                      )?.fullName || "Unknown"}
                    </td>
                    <td className="p-4 flex items-center justify-center">
                      <button
                        className="bg-blue-500 text-white p-2 rounded-lg"
                        onClick={() => showReport(patient.sensor_id.sensorID)}
                      >
                        Show Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorPanel;
