import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminContext = createContext();

// Create a custom hook to use the context
export const useAdminContext = () => useContext(AdminContext);

// Create a Provider Component
export const AdminProvider = ({ children }) => {
  const [hospitals, setHospitals] = useState([]);
  const [patientCount, setPatientcount] = useState(0); 
  const [doctorCount, setDoctorcount] = useState(0); 
  const [hospitalisedCount, setHospitalisedCount] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };

      const reqOptions = {
        url: "http://localhost:8000/api/v1/users/current-user",
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      const user = response.data.data;
      setHospitals(user.hospitals || []);
      setDoctors(user.doctors || []);
      setPatients(user.patients || []);
   


      // Set patient and doctor counts
      const totalPatients = user.patients ? user.patients.length : 0;
      const totalDoctors = user.doctors ? user.doctors.length : 0;
      setPatientcount(totalPatients);
      setDoctorcount(totalDoctors);

      // Calculate hospitalised count (admitted = true)
      const admittedPatients = user.patients ? user.patients.filter(patient => patient.admitted === true).length : 0;
      setHospitalisedCount(admittedPatients);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removePatient = async (patientId) => {
    try {
      const headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };

      const bodyContent = JSON.stringify({ "patient-id": patientId });

      const reqOptions = {
        url: "http://localhost:8000/api/v1/hospital/remove-patient",
        method: "DELETE",
        headers: headersList,
        data: bodyContent,
      };

      await axios.request(reqOptions);
      refetchData();
    } catch (err) {
      console.error("Error removing patient:", err);
      setError("Failed to remove patient. Please try again.");
    }
  };

  const refetchData = () => {
    fetchAdminData();
  };

 
  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        hospitals,
        doctors,
        patientCount, 
        doctorCount,
        hospitalisedCount,
        patients,
        loading,
        error,
        refetchData,
        removePatient, 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
