import { useEffect, useState, memo } from "react";
import NavTitle from "../assets/VitalLinkLogo.jpeg.jpg";
import AdminDropDown from "./Button/AdminDropDown";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddremovePopup from "../Add/AddremovePopup";


const Header = ({ isDoctor, isHomePage }) => {
  return (
    <header className=" text-white flex justify-between items-center p-[0.7rem] px-8 border shadow-lg">
      <MemoizedLogo NavTitle={NavTitle} />
      {isHomePage ? <HomePageNav /> : <AdminDoctorNav isDoctor={isDoctor} />}
    </header>
  );
};
const HomePageNav = () => {
  return (
    <div className="relative">
      <Link to="/signup">
        <SignUp />
      </Link>
      <Link to="/login">
        <Login />
      </Link>
    </div>
  );
};

const AdminDoctorNav = ({ isDoctor }) => {
  return (
    <div className="relative">
      {isDoctor ? <AddPatients /> : <AdminDropDown />}
      <Logout />
    </div>
  );
};

const Logo = () => {
  return (
    <div className="rounded-xl h-auto w-[6rem]">
      <img
        className="rounded-xl h-[2rem] w-[8rem] object-cover"
        src={NavTitle}
        alt="Nav Title"
      />
    </div>
  );
};
const MemoizedLogo = memo(Logo);

const Logout = () => {
  const navigate = useNavigate();
  const handleclick = async() => {
    const accessToken = localStorage.getItem("accessToken");

    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Authorization":`Bearer ${accessToken}`,
    }
    let reqOptions = {
      url: `${import.meta.env.VITE_BACKEND_API}/users/logout`,
      method: "POST",
      headers: headersList,
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
   
    let response = await axios.request(reqOptions);
    
    if(response.status==200){
      navigate('/');
    }
  }
 
  return (
    <button onClick={handleclick} className="bg-iot-blue hover:bg-blue-600 text-white mx-2 px-4 py-2 rounded-lg">
      Log Out
    </button>
  );
};

const Login = () => {
  return (
    <button className="bg-iot-blue hover:bg-blue-600 text-white mx-2 px-4 py-2 rounded-lg">
      Log In
    </button>
  );
};

const SignUp = () => {
  return (
    <button className="bg-iot-blue hover:bg-blue-600 text-white mx-2 px-4 py-2 rounded-lg">
      Sign Up
    </button>
  );
};
 

const AddPatients = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [hospital, setHospital] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPatientsList, setShowPatientsList] = useState(false);
  const [currentPatient, setCurrentPatient] = useState("");
  const [processing, setProcessing] = useState(false);
  const [actionType, setActionType] = useState("");

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
      setHospitals(response.data.data.hospital || []);
      setDoctorPatients(response.data.data.patients || []); 
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  
  const handleConfirm = async () => {
    setProcessing(true);
    try {
      const headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const patientData = {
        patient_id: currentPatient._id,
      };
  
      const reqOptions = {
        url: `${import.meta.env.VITE_BACKEND_API}/doctor/${actionType === 'add' ? 'add-patient' : 'remove-patient'}`,
        method: actionType === 'add' ? "POST" : "DELETE",
        headers: headersList,
        data: patientData,
      };
  
      const response = await axios.request(reqOptions);
      if (response.status === 200) {
        setShowConfirmationPopup(false);
        setProcessing(false);
        await fetchUserDetails();
        await handleHospitalChange({ target: { value: hospital } });
      } else {
        console.error(`Failed to ${actionType} patient:`, response);
      }
    } catch (err) {
      console.error(`Error ${actionType}ing patient:`, err);
    } finally {
      setProcessing(false);
    }
  };
  
  
  const handleClick = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setShowPatientsList(false);
  };

  const handleToggle = (index, type) => {
    setCurrentPatient(patients[index]);
    setActionType(type);
    setShowConfirmationPopup(true);
  };

  const handleCancel = () => {
    setShowConfirmationPopup(false);
    setCurrentPatient("");
    setActionType("");
  };
  const handleHospitalChange = async (e) => {
    setHospital(e.target.value);
    setLoading(true);

    try {
      const headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };

      const reqOptions = {
        url: `${import.meta.env.VITE_BACKEND_API}/hospital/get-admitted-patients?user_id=${e.target.value}`,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setPatients(response.data.data || []);
      setShowPatientsList(true);
    } catch (err) {
      console.error("Can't fetch patient information", err);
    } finally {
      setLoading(false);
    }
  };

  const isPatientAssigned = (patientId) => {
    return doctorPatients.some((docPatient) => docPatient._id === patientId);
  };

  return (
    <>
      <button onClick={handleClick} className="bg-iot-blue hover:bg-blue-600 text-white px-5 mx-2 py-2 rounded-lg">
        Add Patient
      </button>
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg w-[38rem] h-[39.5rem] max-h-90vh overflow-y-auto relative no-scrollbar" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-4 text-gray-500 hover:text-gray-800" onClick={handleClose}>
              &#x2715;
            </button>
            <h2 className="text-2xl font-poppins text-center text-black font-semibold mb-6">Add Patients</h2>
            <div>
              <div className="mb-4">
                <label className="block text-gray-900 mb-2">Select a Hospital</label>
                <select id="hospital" value={hospital} onChange={handleHospitalChange} className="w-full px-3 py-2 border text-black rounded">
                  <option value="" disabled>Select Hospital</option>
                  {hospitals.map((hospital, index) => (
                    <option key={index} value={hospital._id}>
                      {hospital.fullName.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="overflow-y-auto no-scrollbar scroll-smooth max-h-[29rem] shadow-lg border rounded-lg">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Fetching...</div>
                ) : showPatientsList ? (
                  patients.map((patient, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 border-b transition ${isPatientAssigned(patient._id) ? 'bg-green-100' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600">{patient.fullName.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-black">{patient.fullName.toUpperCase()}</p>
                          <p className="text-gray-500">{patient.age} years - {patient.gender.toUpperCase()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(index, isPatientAssigned(patient._id) ? 'remove' : 'add')}
                        className={`px-3 py-1 rounded ${isPatientAssigned(patient._id) ? 'bg-red-500' : 'bg-blue-500'} text-white`}
                      >
                        {isPatientAssigned(patient._id) ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No patients found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {openConfirmationPopup && (
        <AddremovePopup onClose={handleCancel} isSubmitting={processing} onConfirm={handleConfirm} message={`Are you sure you want to ${actionType} ${currentPatient.fullName}?`} />
      )}
    </>
  );
};



export default memo(Header);
