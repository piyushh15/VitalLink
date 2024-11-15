import React, { useEffect, useState } from "react";
import PatientAddition from "../../Add/PatientAddition";
import DoctorAddition from "../../Add/DoctorAddition";
import NodeAddition from "../../Add/NodeAddition";
import axios from "axios";

const AdminDropDown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [sensorIds, setSensorIds] = useState([]); 
  const [openModal, setOpenModal] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setSelectedChoice(option);
    setIsDropdownOpen(false);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedChoice(null);
  };

  useEffect(() => {
    if (openModal && selectedChoice === "Add Patient") {
      axios
        .get('/api/sensors')
        .then((response) => {
          setSensorIds(response.data);
        })
        .catch((error) => {
          console.error("Error fetching sensor IDs:", error);
        });
    } else if (openModal && selectedChoice === "Add Doctors") {
      axios
        .get('/api/doctors')
        .then((response) => {
          setDoctors(response.data);
        })
        .catch((error) => {
          console.error("Error fetching doctors:", error);
        });
    }
  }, [openModal, selectedChoice]);

  const optionsArray = ["Add Node", "Add Patient", "Add Doctors"];

  const renderChoice = () => {
    switch (selectedChoice) {
      case "Add Node":
        return <NodeAddition handleClose={handleClose} />;
      case "Add Patient":
        return <PatientAddition sensorIds={sensorIds} handleClose={handleClose} />;
      case "Add Doctors":
        return <DoctorAddition doctors={doctors} handleClose={handleClose} />;
      default:
        return <div>Please select a valid option.</div>;
    }
  };

  return (
    <>
      <button
        onClick={toggleDropdown}
        className="bg-iot-blue hover:bg-blue-600 text-white px-5 mx-2 py-2 rounded-lg"
      >
        ADD +
      </button>

      {isDropdownOpen && (
        <ListOfOptions
          optionsArray={optionsArray}
          handleOptionClick={handleOptionClick}
        />
      )}

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg w-[38rem] h-[39.5rem] max-h-90vh overflow-y-auto relative no-scrollbar" onClick={(e) => e.stopPropagation()}>
          <button className=" absolute top-5 right-4 text-gray-500 hover:text-gray-800"
              onClick={handleClose}
            >
             &#x2715;
            </button>
            <h2 className="text-2xl font-poppins text-center text-black font-semibold mb-6">
              {selectedChoice}
            </h2>
            <div >
              {renderChoice()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ListOfOptions = ({ optionsArray, handleOptionClick }) => {
  return (
    <div className="absolute right-0 bg-white text-black rounded-lg shadow-lg mt-2 w-48 z-10">
      <ul className="py-2">
        {optionsArray.map((choice, index) => (
          <Option
            key={index}
            handleOptionClick={handleOptionClick}
            choice={choice}
          />
        ))}
      </ul>
    </div>
  );
};

const Option = ({ handleOptionClick, choice }) => {
  return (
    <li
      onClick={() => handleOptionClick(choice)}
      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
    >
      {choice}
    </li>
  );
};

export default AdminDropDown;
