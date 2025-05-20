import ReactDOM from "react-dom/client";
import Login from "./login.js";
import ConnectionPage from "./LabsListPage.js";
import DeptAdmin from "./deptAdmin.js";
import StudentPage1 from "./StudentPage1.js";
import App from "./App.js";
import ExperimentsUploading from "./facultyExpPage.js";
import FacultyFirstPage from "./facultyFirstPage.js";
import AssignmentsTable from "./hod.js";
import Home from "./home.js";
import Header from "./header.js";
import { AuthProvider } from "./AuthContext.js";
import React from "react";
const obj = document.getElementById("root");
const ref = ReactDOM.createRoot(obj);
// ref.render(<StudentPage1/>)
// ref.render(<DeptAdmin/>);
// ref.render(<Login/>);
// ref.render(<ExperimentsUploading/>);
ref.render( <React.StrictMode><AuthProvider>
    <App /></AuthProvider></React.StrictMode> )
// ref.render(<FacultyFirstPage/>);
// ref.render(<AssignmentsTable/>);
// ref.render(<Home/>)
// ref.render(<Header/>)