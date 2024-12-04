import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './AuthForms/Login';
import UserSignUp from './AuthForms/UserSignUp';
import DoctorPanel from './Panel/DoctorPanel';
import AdminPanel from './Panel/AdminPanel';
import AdminPanelPatients from './AdminPanelDataViewer/AdminPanelPatients';
import AdminPanelDoctors from './AdminPanelDataViewer/AdminPanelDoctors';
import AdminPanelHospitalised from './AdminPanelDataViewer/AdminPanelHospitalised';
import { AdminProvider } from './Panel/AdminContext';
import PatientDataPanel from './Panel/PatientDataPanel'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<UserSignUp />} />
          
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
          <Route path="/PatientDataPanel" element={<PatientDataPanel/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
