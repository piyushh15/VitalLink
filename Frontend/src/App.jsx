import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';

import Login from './AuthForms/Login';
import SignUp from './AuthForms/Signup';

import DoctorPanel from './Panel/DoctorPanel';
import AdminPanel from './Panel/AdminPanel';
import AdminPanelPatients from './Dataviewer/AdminPanelPatients';
import AdminPanelDoctors from './Dataviewer/AdminPanelDoctors';
import AdminPanelHospitalised from './Dataviewer/AdminPanelHospitalised';

import { AdminProvider } from './Panel/AdminContext'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />

          {/* Wrap admin routes with AdminProvider */}
          <Route 
            exact 
            path="/adminpanel" 
            element={
              <AdminProvider>
                <AdminPanel />
              </AdminProvider>
            }
          />
          <Route 
            exact 
            path="/admin-patients" 
            element={
              <AdminProvider>
                <AdminPanelPatients />
              </AdminProvider>
            }
          />
          <Route 
            exact 
            path="/admin-doctors" 
            element={
              <AdminProvider>
                <AdminPanelDoctors />
              </AdminProvider>
            }
          />
          <Route 
            exact 
            path="/admin-hospitalised" 
            element={
              <AdminProvider>
                <AdminPanelHospitalised />
              </AdminProvider>
            }
          />

          <Route exact path="/doctorpanel" element={<DoctorPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
