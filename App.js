import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentPage1 from './StudentPage1';
import StudentPage2 from './StudentPage2';
import ExperimentsUploading from './facultyExpPage.js';
import FacultyFirstPage from './facultyFirstPage.js';
import Home from './home.js';
import DeptAdmin from './deptAdmin.js';
import HODReportsPage from './hod.js';
import Login from './login.js';
import Header from "./header.js";
import { AuthProvider } from "./AuthContext.js";
import Profile from './profileStudent.js';
import ChangePassword from './changePassword.js';
import ProfileStudent from './profileStudent.js';
import ProfileFaculty from './profileFaculty.js';


export const GlobalContext = React.createContext();

function App() {
    const [globalUsername, setGlobalUsername] = useState("");
    console.log(globalUsername);

    return (
        <GlobalContext.Provider value={{ globalUsername, setGlobalUsername }}>
            <Router>
            <AuthProvider>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '50vh' }}>
                <Header globalUsername={globalUsername}/>  
                {/* console.log("App.js", {globalUsername}); */}
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/exp-page/:subID/:submitted/:pending" element={<StudentPage2 />} />
                        <Route path="/faculty-exp-page/:branch/:section/:year/:subID" element={<ExperimentsUploading />} />                
                        <Route path="/student-page-1" element={<StudentPage1 />} />
                        <Route path="/faculty-page-1" element={<FacultyFirstPage />} />
                        <Route path="/dept-admin" element={<DeptAdmin />} />
                        <Route path='/hod' element={<HODReportsPage />} />
                        <Route path='/profile-student/:username' element={<ProfileStudent />} />
                        <Route path='/profile-faculty/:username' element={<ProfileFaculty />} />
                        <Route path='/change-password/:username' element={<ChangePassword />} />
                    </Routes>
                </div>
                </AuthProvider>
            </Router>
        </GlobalContext.Provider>
    );
}

export default App;
