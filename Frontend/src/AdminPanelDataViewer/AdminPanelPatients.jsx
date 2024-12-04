import {useState } from "react";
import { useAdminContext } from "../Panel/AdminContext";
import AdminDoctorNav from "../components/Header"

const AdminPanelPatients = () => {
  const { patients, loading, error } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState("");


  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <AdminDoctorNav/>
    <div className="p-6 font-poppins px-20">
     
      <h1 className="text-4xl font-semibold mb-6 text-center font-palanquin">Patients List</h1>
      <div >
         {/* Search Input */}
      <div className="mb-6 flex justify-between items-center bg-blue-50 p-3 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full"
        />
      </div>

      {/* Display Loading, Error, or Table */}
      {loading ? (
        <p>Loading patients...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-y-auto no-scrollbar scroll-smooth max-h-[30rem] shadow rounded-lg">
          <table className=" min-w-full  bg-slate-50 border  text-center">
            <thead>
              <tr className="bg-blue-100 text-black font-palanquin text-[1.3rem]">
                <th className="px-4 py-3 border">S. No</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Age</th>
                <th className="px-4 py-3 border">Aadhar</th>
                <th className="px-4 py-3 border">Gender</th>
                <th className="px-4 py-3 border">Sensor ID</th>
                <th className="px-4 py-3 border">Admitted</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <tr key={index} className="text-center text-xl font-palanquin hover:bg-blue-100">
                    <td className="px-4 py-3 border">{index + 1}</td>
                    <td className="px-4 py-3 border">{patient.fullName}</td>
                    <td className="px-4 py-3 border">{patient.age}</td>
                    <td className="px-4 py-3 border">{patient.aadhaar || "N/A"}</td>
                    <td className="px-4 py-3 border">{patient.gender}</td>
                    <td className="px-4 py-3 border">{patient.sensor_id?.sensorID || "N/A"}</td>
                    <td className="px-4 py-3 border">
                      {patient.admitted ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-4 text-center">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
    </>
  );
};

export default AdminPanelPatients;
