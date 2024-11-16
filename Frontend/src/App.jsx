import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './AuthForms/Login';
import SignUp from './AuthForms/Signup';
import DoctorPanel from './Panel/DoctorPanel';
import AdminPanel from './Panel/AdminPanel';
import AdminPanelPatients from './Dataviewer/AdminPanelPatients';
import AdminPanelDoctors from './Dataviewer/AdminPanelDoctors';
import AdminPanelHospitalised from './Dataviewer/AdminPanelHospitalised';
import { AdminProvider } from './Panel/AdminContext';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Wrap admin routes with AdminProvider */}
          <Route 
            path="/adminpanel" 
            element={
              <AdminProvider>
                <AdminPanel />
              </AdminProvider>
            }
          />
          <Route 
            path="/admin-patients" 
            element={
              <AdminProvider>
                <AdminPanelPatients />
              </AdminProvider>
            }
          />
          <Route 
            path="/admin-doctors" 
            element={
              <AdminProvider>
                <AdminPanelDoctors />
              </AdminProvider>
            }
          />
          <Route 
            path="/admin-hospitalised" 
            element={
              <AdminProvider>
                <AdminPanelHospitalised />
              </AdminProvider>
            }
          />
          
          <Route path="/doctorpanel" element={<DoctorPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
