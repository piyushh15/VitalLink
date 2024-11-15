import React, { useEffect, useState } from "react";
import AddremovePopup from "./AddremovePopup";
import axios from "axios";

const DoctorAddition = ({ handleclose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]); // Ensure this is initialized as an array
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        };
        let reqOptions1 = {
          url: "http://localhost:8000/api/v1/hospital/get-doctors",
          method: "GET",
          headers: headersList,
        };
        let reqOptions2 = {
          url: "http://localhost:8000/api/v1/hospital/get-reg-doctors",
          method: "GET",
          headers: headersList,
        };
  
        let response1 = await axios.request(reqOptions1);
        let response2 = await axios.request(reqOptions2);
  
        const allDoctors = response1.data.data; // All available doctors
        const registeredDoctors = response2.data.data; // Doctors already registered
  
        // Map through all doctors and check if they are present in the registeredDoctors list by comparing their IDs
        const updatedDoctors = allDoctors.map((doctor) => {
          const isAdded = registeredDoctors.some(
            (regDoctor) => regDoctor._id === doctor._id
          );
          return { ...doctor, added: isAdded };
        });
  
        setDoctors(updatedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctors();
  }, []);
  

  const handleToggle = (index) => {
    setCurrentDoctor(doctors[index]);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const updatedDoctors = doctors.map((doctor) =>
        doctor._id === currentDoctor._id
          ? { ...doctor, added: !doctor.added }
          : doctor
      );
   
  
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      };

      const url = currentDoctor.added
        ? "http://localhost:8000/api/v1/hospital/remove-doctor"
        : "http://localhost:8000/api/v1/hospital/add-doctor";
      

        let bodyContent = currentDoctor.added
        ? JSON.stringify({ doctor_id: currentDoctor._id })
        : JSON.stringify({ username: currentDoctor.user.username });
      
  
      let reqOptions = {
        url: url,
        method: currentDoctor.added ? "DELETE" : "POST",
        headers: headersList,
        data: bodyContent,
      };
  
      let response = await axios.request(reqOptions);
   
      if (response.status === 200) {
        setDoctors(updatedDoctors);
      } else {
        console.error("Failed to update doctor status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating doctor status:", error);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setCurrentDoctor(null);
    }
  };
  
  const handleCancel = () => {
    setShowModal(false);
    setCurrentDoctor(null);
  };

  const filteredDoctors = Array.isArray(doctors)
    ? doctors.filter(
        (doctor) =>
          doctor.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="mt-10">
      <input
        type="text"
        placeholder="Search for Doctors ..."
        className="w-full p-3 mb-4 border rounded-lg shadow-md text-black"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-y-auto no-scrollbar scroll-smooth max-h-[25rem] shadow-lg border rounded-lg">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Fetching...</div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor._id} 
              className={`flex items-center justify-between p-3 border-b transition ${
                doctor.added ? "bg-green-100" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <img
                  src={doctor.user?.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-black">{doctor.user.fullName}</p>
                  <p className="text-gray-500">{doctor.user.email}</p>
                </div>
              </div>
              <button
                  onClick={() => handleToggle(doctors.indexOf(doctor))}
                  className={`px-3 py-1 rounded ${doctor.added ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
                  disabled={isSubmitting}
                >
                  {doctor.added ? "Remove" : "Add"}
                </button>

            </div>
          ))
        )}
        {filteredDoctors.length === 0 && !loading && (
          <div className="p-4 text-center text-gray-500">No doctors found.</div>
        )}
      </div>
      {showModal && (
        <AddremovePopup onClose={handleCancel} isSubmitting={isSubmitting} onConfirm={handleConfirm} message={`Are you sure you want to ${currentDoctor?.added ? "remove" : "add"} ${currentDoctor?.user.fullName}?`} />
      )}
    </div>
  );
};

export default DoctorAddition;
