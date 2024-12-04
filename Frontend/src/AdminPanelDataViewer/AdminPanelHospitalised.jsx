import { useState } from "react";
import { useAdminContext } from "../Panel/AdminContext";
import axios from "axios";
import AddremovePopup from "../Add/AddremovePopup";
import AdminDoctorNav from "../components/Header";

const AdminPanelHospitalised = () => {
  const { patients, loading, error, refetchData } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removalError, setRemovalError] = useState("");

  // Get unique genders for filtering
  const uniqueGenders = [...new Set(patients.map((patient) => patient.gender))];

  const handleRemovePatient = async () => {
    if (!selectedPatientId) return;

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_API}/hospital/remove-patient`,
        { patient_id: selectedPatientId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      refetchData();
      setShowPopup(false); // Close the popup after removal
    } catch (err) {
      console.error("Error removing patient:", err);
      setRemovalError("Failed to remove the patient. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPopup = (patientId) => {
    setSelectedPatientId(patientId);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPatientId(null);
  };

  const filteredPatients = patients
    .filter((patient) => patient.admitted === true)
    .filter((patient) => patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((patient) => (genderFilter ? patient.gender === genderFilter : true));

  return (
    <>
      <AdminDoctorNav />
      <div className="p-6  font-poppins mx-10">
        <h1 className="text-4xl font-bold mb-6 font-palanquin text-center">Hospitalised Patients List</h1>

        <div className="mb-4 p-3 flex justify-between items-center bg-blue-50 lg:flex-row flex-col">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 lg:p-2 p-4 lg:mb-0 mb-4 mx-4 rounded-lg lg:w-[35vw] w-full"
          />

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg mx-4"
          >
            <option value="">All Genders</option>
            {uniqueGenders.map((gender, index) => (
              <option key={index} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading patients...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-auto shadow rounded-lg max-h-[31rem] no-scrollbar scroll-smooth">
            {removalError && <p className="text-red-500 mb-2">{removalError}</p>}
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-blue-100 text-black text-xl font-palanquin text-center border-b">
                  <th className="px-4 py-3 ">S. No</th>
                  <th className="px-4 py-3 ">Name</th>
                  <th className="px-4 py-3 ">Age</th>
                  <th className="px-4 py-3 ">Aadhar</th>
                  <th className="px-4 py-3 ">Gender</th>
                  <th className="px-4 py-3 ">Sensor ID</th>
                  <th className="px-4 py-3 ">Remove Patient</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <tr key={index} className="text-center font-palanquin text-xl bg-slate-50 hover:bg-blue-100  border-b">
                      <td className="px-4 py-3 ">{index + 1}</td>
                      <td className="px-4 py-3 ">{patient.fullName}</td>
                      <td className="px-4 py-3 ">{patient.age}</td>
                      <td className="px-4 py-3 ">{patient.aadhaar || "N/A"}</td>
                      <td className="px-4 py-3 ">{patient.gender}</td>
                      <td className="px-4 py-3 ">{patient.sensor_id?.sensorID || "N/A"}</td>
                      <td className="px-4 py-3 ">
                        <button
                          onClick={() => openPopup(patient._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-center">
                      No hospitalised patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Confirmation Popup */}
        {showPopup && (
          <AddremovePopup
            onClose={closePopup}
            onConfirm={handleRemovePatient}
            isSubmitting={isSubmitting}
            message="Are you sure you want to remove this patient?"
          />
        )}
      </div>
    </>
  );
};

export default AdminPanelHospitalised;
