import { useContext } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { useAdminContext } from "./AdminContext";

const AdminPanel = () => {
  //  context se get data and state
  const {
    patientCount,
    doctorCount,
    hospitalisedCount,
    loading,
    error,
  } = useAdminContext();

  const myCard = [
    { title: "Patients", route: "/admin-patients", value: patientCount, data: patientCount },
    { title: "Doctors", route: "/admin-doctors", value: doctorCount, data: doctorCount },
    { title: "Hospitalised", route: "/admin-hospitalised", value: hospitalisedCount }, // Placeholder for hospitalised count
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-poppins justify-between ">
      <Header isHomePage={false} isDoctor={false} />
      <main className="flex-grow text-center">
        <Hero
          mainHeading={["Admin", "Dashboard"]}
          paragraph={
            "Our platform provides real-time patient monitoring and seamlessly assigns specialized doctors based on health data, ensuring timely and personalized medical care."
          }
        />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex justify-around items-center mb-2 mx-14 py-20 gap-8 ">
            {myCard.map((card) => (
              <Card
                key={card.title}
                route={card.route}
                title={card.title}
                value={card.value}
                data={card.data}
                loading={loading} 
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const Card = ({ title, value, route, data, loading }) => {
  return (
    <Link
      to={{
        pathname: route,
        state: {
          data, 
        },
      }}
      className={`flex flex-col justify-center items-center h-[180px] w-[301px] bg-iot-blue shadow-md rounded-lg p-6 cursor-pointer transform hover:scale-105 transition-transform duration-300 ${loading ? 'pointer-events-none opacity-50' : ''}`} // Disable pointer events if loading
    >
      <h2 className="text-7xl text-white font-bold font-jetbrains">{value}</h2>
      <p className="text-white text-xl mt-2 font-poppins">{title}</p>
    </Link>
  );
};

export default AdminPanel;
