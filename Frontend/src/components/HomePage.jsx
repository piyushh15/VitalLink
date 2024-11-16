import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen font-poppins justify-between">
        <Header isDoctor={false} isHomePage={true} />
        <Hero
          mainHeading={["Welcome to", "VitalLink"]}
          subHeading={"One Stop Solution for Health Tech"}
          paragraph={
            "At VitalLink, we provide innovative solutions to enhance healthcare delivery, streamline communication between healthcare providers and patients, and ensure effective management of health data for better outcomes. Join us on a journey towards a healthier future!"
          }
        />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
