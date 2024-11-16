import React, { useState } from "react";
import { useAdminContext } from "../Panel/AdminContext";
import axios from "axios";
import AddremovePopup from "../Add/AddremovePopup";
import AdminDoctorNav from "../components/Header";

const AdminPanelDoctors = () => {
  const { doctors, loading, error, refetchData } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [doctorToDismiss, setDoctorToDismiss] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uniqueSpecializations = [...new Set(doctors.map(doctor => doctor.specification))];
  const uniqueGenders = [...new Set(doctors.map(doctor => doctor.gender))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearchTerm = doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specializationFilter ? doctor.specification === specializationFilter : true;
    const matchesGender = genderFilter ? doctor.gender === genderFilter : true;
    return matchesSearchTerm && matchesSpecialization && matchesGender;
  });

  const openDismissPopup = (doctor) => {
    setDoctorToDismiss(doctor);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setDoctorToDismiss(null);
  };

  const confirmDismissDoctor = async () => {
    if (!doctorToDismiss) return;
    setIsSubmitting(true);

    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };

    const reqOptions = {
      url: `${import.meta.env.VITE_BACKEND_API}/hospital/remove-doctor`,
      method: "DELETE",
      headers: headersList,
      data: JSON.stringify({ doctor_id: doctorToDismiss._id }),
    };

    try {
      await axios.request(reqOptions);
      refetchData(); 
      closePopup(); 
    } catch (err) {
      console.error("Error dismissing doctor:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <AdminDoctorNav/>
    
     <div className="p-6 font-poppins px-10 mx-8">
      <h1 className="text-4xl font-semibold mb-6 font-palanquin text-center ">Available Doctors</h1>

      <div className="">

      <div className="mb-4 p-3 flex justify-between items-center bg-blue-50 lg:flex-row flex-col ">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 lg:p-2 p-4 lg:mb-0 mb-4 mx-4 rounded-lg lg:w-[35vw] w-full"
        />

        <div className="pr-3">
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg mx-2"
          >
            <option value="">All Specializations</option>
            {uniqueSpecializations.map((spec, index) => (
              <option key={index} value={spec}>{spec}</option>
            ))}
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="">All Genders</option>
            {uniqueGenders.map((gender, index) => (
              <option key={index} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading doctors...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className= "max-h-[30rem] overflow-y-auto no-scrollbar scroll-smooth shadow rounded-lg">
          <table className="min-w-full border border-gray-300 text-center">
            <thead>
              <tr className="bg-blue-100 text-black text-2xl font-palanquin">
                <th className="px-4 py-3 ">Name</th>
                <th className="px-4 py-3 ">Gender</th>
                <th className="px-4 py-3 ">Specialization</th>
                <th className="px-4 py-3 ">Dismiss Doctor</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => (
                  <tr key={index} className="text-center font-palanquin text-xl bg-slate-50 hover:bg-blue-100 border-t">
                    <td className="px-4 py-3 ">{doctor.fullName}</td>
                    <td className="px-4 py-3 ">{doctor.gender}</td>
                    <td className="px-4 py-3 ">{doctor.specification}</td>
                    <td className="px-4 py-3 ">
                      <button
                        onClick={() => openDismissPopup(doctor)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Dismiss
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {isPopupOpen && (
        <AddremovePopup
          onClose={closePopup}
          onConfirm={confirmDismissDoctor}
          isSubmitting={isSubmitting}
          message={`Are you sure you want to dismiss Dr. ${doctorToDismiss.fullName}?`}
        />
      )}
    </div>
    </>
  );
};

export default AdminPanelDoctors;
