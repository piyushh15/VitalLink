import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";

const PatientDataPanel = () => {
  const location = useLocation();
  const {
    sensorID,
    patientName,
    patientAge,
    patientGender,
    hospitalName,
  } = location.state || {};
  const [sensorReadings, setSensorReadings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const handleFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  const filterDataByTime = (data, timeFilter) => {
    const currentTime = new Date();

    if (timeFilter === "all") return data;

    let filterTime;
    switch (timeFilter) {
      case "lastHour":
        filterTime = currentTime - 1 * 60 * 60 * 1000; // 1 hour ago
        break;
      case "last3Hours":
        filterTime = currentTime - 3 * 60 * 60 * 1000; // 3 hours ago
        break;
      case "last6Hours":
        filterTime = currentTime - 6 * 60 * 60 * 1000; // 6 hours ago
        break;
      case "last12Hours":
        filterTime = currentTime - 12 * 60 * 60 * 1000; // 12 hours ago
        break;
      case "last24Hours":
        filterTime = currentTime - 24 * 60 * 60 * 1000; // 24 hours ago
        break;
      default:
        filterTime = currentTime - 1 * 60 * 60 * 1000; // Default to last 1 hour
    }

    return data.filter((item) => {
      const timestamp = new Date(item.timestamp).getTime();
      return timestamp >= filterTime;
    });
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!sensorID) {
        setError("Sensor ID is missing");
        setLoading(false);
        return;
      }
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
        const fetchedData = response.data.data;
        const filteredData = filterDataByTime(fetchedData, timeFilter);
       
        setSensorReadings(filteredData);
      } catch (err) {
        setError("No data found ....");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [sensorID, timeFilter]);

  if (loading) return <div>Loading...</div>;


  return (
    <div className="flex flex-col min-h-screen">
     
      <Header isDoctor={true} isHomePage={false} />
  
     
      <div className="flex-grow">
        <div className="px-12 py-8">
          <h1 className="text-[2.5rem] font-semibold mb-4 text-center font-poppins">
            Patient Data
          </h1>
  
          
          <div className="my-6 p-4 rounded shadow-md flex justify-around font-poppins text-xl">
            <p>
              <span className="font-semibold">Patient Name: </span>
              {patientName}
            </p>
            <p>
              <span className="font-semibold">Age: </span> {patientAge} years
            </p>
            <p>
              <span className="font-semibold">Gender: </span> {patientGender}
            </p>
            <p>
              <span className="font-semibold">Hospital: </span> {hospitalName}
            </p>
          </div>
  
        
          <div className="my-6">
            <label
              htmlFor="timeFilter"
              className="pr-8 font-semibold font-palanquin text-xl"
            >
              Filter by Time:
            </label>
            <select
              id="timeFilter"
              value={timeFilter}
              onChange={handleFilterChange}
              className="border p-2 rounded font-palanquin"
            >
              <option value="all">All Data</option>
              <option value="lastHour">Last 1 Hour</option>
              <option value="last3Hours">Last 3 Hours</option>
              <option value="last6Hours">Last 6 Hours</option>
              <option value="last12Hours">Last 12 Hours</option>
              <option value="last24Hours">Last 24 Hours</option>
            </select>
          </div>
  
         
          {error ? (
            <div className="text-black  py-3 text-center mt-8 font-semibold text-2xl">
              {error}
            </div>
          ) : (
            <div className="overflow-auto max-h-96">
              <table className="w-full table-auto border-collapse font-poppins">
               
                <thead className="sticky top-0 bg-blue-100">
                  <tr className="text-center">
                    <th className="border-b px-4 py-3">Date</th>
                    <th className="border-b px-4 py-3">Time</th>
                    <th className="border-b px-4 py-3">SPO2</th>
                    <th className="border-b px-4 py-3">Temperature</th>
                    <th className="border-b px-4 py-3">Heart Rate</th>
                  </tr>
                </thead>
              
                <tbody>
                  {sensorReadings.map((value, index) => {
                    const timestamp = new Date(value.timestamp);
                    const date = timestamp.toLocaleDateString();
                    const time = timestamp.toLocaleTimeString();
  
                    const roundedSpo2 = value.sensorData.spo2.toFixed(2);
                    const roundedTemperature = value.sensorData.temperature.toFixed(2);
                    const roundedHeartrate = value.sensorData.heartrate.toFixed(2);
  
                    return (
                      <tr key={index} className="text-center border-b">
                        <td className="px-4 py-3">{date}</td>
                        <td className="px-4 py-3">{time}</td>
                        <td className="px-4 py-3">{roundedSpo2}</td>
                        <td className="px-4 py-3">{roundedTemperature}</td>
                        <td className="px-4 py-3">{roundedHeartrate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
  
};

export default PatientDataPanel;
