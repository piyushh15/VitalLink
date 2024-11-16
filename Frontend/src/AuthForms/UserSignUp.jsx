import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";


const InputField = ({ label, id, name, type = "text", value, onChange, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium leading-6 text-black">
      {label}
    </label>
    <input
      id={id} name={name} type={type} value={value} onChange={onChange} required={required}
      className="mt-2 block w-full px-4 py-2 rounded-md bg-slate-300 text-black shadow-sm focus:ring-2 focus:ring-blue-600"
    />
  </div>
);

const SelectField = ({ label, id, name, options, value, onChange, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium leading-6 text-black ">
      {label}
    </label>
    <select id={id}name={name}value={value}onChange={onChange}required={required}
      className="mt-2 block w-full px-4 py-2 rounded-md bg-slate-300 text-black shadow-sm focus:ring-2 focus:ring-blue-600"
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const specializations = [
  "Cardiologist", "Dermatologist", "Pediatrician", "Neurologist",
  "Psychiatrist", "Orthopedist", "Radiologist", "Surgeon",
  "Oncologist", "Gynaecologist", "General Practitioner", "Other"
];

const SpecializationSelect = ({ value, onChange }) => (
  <SelectField
    label="Specs"id="specification"name="specification"
    options={specializations} value={value} onChange={onChange}
    required
  />
);
const SignUp = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    gender: "",
    specification: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(false); 
 
  const handleSubmit = async (e) => {
     e.preventDefault();
    setLoading(true); 

    try {
      const payload=isDoctor?{
        fullName:credentials.name,
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
        specification: credentials.specification,
        gender: credentials.gender.toLowerCase(),
        isAdmin:false,
      }
      :{fullName: credentials.name,
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
        isAdmin: true,
      };
      
      let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json" 
       }

       let reqOptions = {
        url: `${import.meta.env.VITE_BACKEND_API}/users/register`,
        method: "POST",
        headers: headersList,
        data:payload,
      }
      
      let response = await axios.request(reqOptions);
    
      if(response.data.statusCode=== 200){
          navigate("/login");
      }
    } catch (error) {
      
      throw new Error (error.message);

    }finally{
      setLoading(false);
    }    
  };
  
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleDoctorFields = () => {
    setIsDoctor(!isDoctor);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0575E6] to-[#021B79] flex items-center justify-center font-poppins">
      <div className="relative p-6 sm:max-w-xl w-full">
        <div className="relative w-full bg-slate-200 text-black backdrop-filter border border-slate-300 backdrop-blur-lg rounded-3xl pb-4 px-8">
          <h1 className="text-3xl pt-8 text-center font-semibold font-poppins">Create a new account</h1>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ease-in-out opacity-95">
              <InputField label="Name" id="name" name="name" value={credentials.name} onChange={handleChange} required />
              <InputField label="Email address" id="email" name="email" type="email" value={credentials.email} onChange={handleChange} required />
              <InputField label="Username" id="username" name="username" value={credentials.username} onChange={handleChange} required />
              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-black">Password</label>
                <div className="relative mt-2">
                  <input
                    id="password" name="password" type={showPassword ? "text" : "password"}
                    value={credentials.password} onChange={handleChange} required
                    className="block w-full px-4 py-2 rounded-md bg-slate-300 text-black shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                  <button type="button" onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-black">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="doctorCheckbox" className="block text-sm font-medium leading-6 text-black">
                  <input id="doctorCheckbox" name="doctorCheckbox" type="checkbox" className="mr-2" onChange={toggleDoctorFields} />
                  Signup as a Doctor
                </label>
              </div>
              {isDoctor && (
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField label="Gender" id="gender" name="gender" options={["Male", "Female", "Other"]} value={credentials.gender} onChange={handleChange} required />
                  <SpecializationSelect value={credentials.specification} onChange={handleChange} />
                </div>
              )}

              <div className="col-span-2">
                <button type="submit"
                  className="w-full rounded-md bg-[#0575e6] px-4 py-2 text-white shadow-md hover:bg-[#059ae6] transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </div>
          </form>
          <p className="mt-4 text-center text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
