import React, { useState, useEffect } from 'react';

// Faculty Modal Component
const FacultyModal = ({ show, handleClose, handleSave }) => {
    const [inputData, setInputData] = useState({ faculty: '', facultyID: '', desg: '', dept: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData((prevState) => ({ ...prevState, [name]: value }));
    };

    if (!show) return null;

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h2>Enter Faculty Details</h2>
                <label>
                    Faculty Name: &nbsp;&nbsp;
                    <input name="faculty" value={inputData.faculty} onChange={handleChange} />
                </label>
                <br />
                <br />
                <label>
                    Faculty ID: &nbsp;&nbsp;
                    <input name="facultyID" value={inputData.facultyID} onChange={handleChange} />
                </label>
                <br />
                <br />
                <label>
                    Designation: &nbsp;&nbsp;
                    <input name="desg" value={inputData.desg} onChange={handleChange} />
                </label>
                <br />
                <br />
                <label>
                    Department: &nbsp;&nbsp;
                    <input name="dept" value={inputData.dept} onChange={handleChange} />
                </label>
                <br />
                <br />
                <label>
                    Mobile Number: &nbsp;&nbsp;
                    <input name="phno" value={inputData.phno} onChange={handleChange} />
                </label>
                <br />
                <br />
                <label>
                    Email: &nbsp;&nbsp;
                    <input name="email" value={inputData.email} onChange={handleChange} />
                </label>
                <br />
                <br />
                <div>
                    <button
                        style={{
                            backgroundColor: "#C5FF95",
                            padding: 8,
                            fontFamily: "cursive",
                            border: "2px solid gray",
                        }}
                        onClick={() => handleSave(inputData)}
                    >
                        Save
                    </button>
                    <button
                        style={{
                            backgroundColor: "#FFBF9B",
                            margin: 20,
                            padding: 8,
                            fontFamily: "cursive",
                            border: "2px solid gray",
                        }}
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
const LabModal = ({ show, handleClose, handleSave }) => {
    const [labData, setLabData] = useState({ labID: '', labName: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLabData((prevState) => ({ ...prevState, [name]: value }));
    };

    if (!show) return null;

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h2>Enter Lab Details</h2>
                <label>
                    Lab ID: &nbsp;&nbsp;
                    <input name="labId" value={labData.labId} onChange={handleChange} />
                </label>
                <br />
                <br />
                <label>
                    Lab Name: &nbsp;&nbsp;
                    <input name="labName" value={labData.labName} onChange={handleChange} />
                </label>
                <br />
                <br />
                <button
                    style={{
                        backgroundColor: "#C5FF95",
                        padding: 8,
                        fontFamily: "cursive",
                        border: "2px solid gray",
                    }}
                    onClick={() => {
                        console.log('Lab Data on Save:', labData); // Log data before save
                        handleSave(labData);
                    }}
                >
                    Save
                </button>
                <button
                    style={{
                        backgroundColor: "#FFBF9B",
                        margin: 20,
                        padding: 8,
                        fontFamily: "cursive",
                        border: "2px solid gray",
                    }}
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// Main Component
function DeptAdmin() {
    const [showFacultyModal, setShowFacultyModal] = useState(false);
    const [showLabModal, setShowLabModal] = useState(false);
    const [facultyList, setFacultyList] = useState([]);
    const [labList, setLabList] = useState([]);
    const [yearList, setYearList] = useState(['I', 'II', 'III', 'IV']);
    const [branchList] = useState(["AI&DS", "AI&ML"]);
    const [sectionList] = useState(["A", "B"]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedLab, setSelectedLab] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selections, setSelections] = useState([]);


    useEffect(() => {
        const fetchFacultyList = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/Faculty');
                const data = await response.json();
                if (response.ok) {
                    setFacultyList(data); 
                } else {
                    console.error('Error fetching faculty list:', data.message);
                }
            } catch (error) {
                console.error('Error fetching faculty list:', error);
            }
        };

        const fetchLabList = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/Lab');
                const data = await response.json();
                if (response.ok) {
                    setLabList(data); // Assuming data is an array of labs
                } else {
                    console.error('Error fetching lab list:', data.message);
                }
            } catch (error) {
                console.error('Error fetching lab list:', error);
            }
        };

        fetchFacultyList();
        fetchLabList();
    }, []);

    const handleFacultyModalSave = async (data) => {
        if (!data.faculty || !data.facultyID || !data.desg || !data.dept) {
            alert("All fields are required.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/api/Faculty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Send the new faculty data to the server
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setFacultyList((prevList) => [...prevList, data]); // Add the new faculty to the local list
                setShowFacultyModal(false);
                alert('Faculty added successfully!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not add the faculty. Please try again.');
        }
    };
    
    const handleLabModalSave = async (data) => {
        if (!data.labId || !data.labName) {
            alert("All fields are required.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/api/Lab', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setLabList((prevList) => [...prevList, data]); // Add the new faculty to the local list
                setShowLabModal(false);
                alert('Lab added successfully!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not add the Lab. Please try again.');
        }
    };
    

    const handleSelectChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const submitData = async () => {
        if (!selectedFaculty || !selectedLab || !selectedBranch || !selectedSection || !selectedYear) {
            alert("All fields must be selected before submitting.");
            return;
        }
        const data = {
            emp_id: selectedFaculty, 
            lab_id: selectedLab,
            branch: selectedBranch,
            section: selectedSection,
            year: selectedYear,
        };
        try {
            const response = await fetch('http://localhost:3001/api/Assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',   
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
    
            if (response.ok) {
                setLabList((prevList) => [...prevList, data]); // Add the new faculty to the local list
                setShowLabModal(false);
                alert('Lab added successfully!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not add the Lab. Please try again.');
        }

        setSelections((prev) => [
            ...prev,
            {
                faculty: selectedFaculty,
                lab: selectedLab,
                branch: selectedBranch,
                section: selectedSection,
                year: selectedYear,
            },
        ]);

        setSelectedFaculty('');
        setSelectedLab('');
        setSelectedBranch('');
        setSelectedSection('');
        setSelectedYear('');
    };

    return (
        <div style={{ padding:9 }}>
            <div style={{ display: 'flex', flexDirection: 'row',flexWrap : 'wrap',padding: 40, justifyContent: 'space-around' }}>
                <div
                    style={{
                        background: "linear-gradient(rgba(192, 185, 192, 0.41),rgb(173, 180, 179))",
                        width: 300,
                        border: '1px solid gray',
                        borderRadius: 6,
                        padding: 30,
                        fontFamily: 'cursive',
                        marginRight: -150,
                        border : "None",
                    }}
                >
                    <h4>Assign Faculty and Labs</h4>
                    <div style={{ marginBottom: 20 }}>
                        <label>
                            Faculty: &nbsp;&nbsp;
                            <select
                                style={{ fontSize: 17, marginBottom: 10 }}
                                value={selectedFaculty}
                                onChange={handleSelectChange(setSelectedFaculty)}
                            >
                                <option value="">Select Faculty</option>
                                {facultyList.map((faculty, index) => (
                                    <option key={index} value={faculty.facultyID}>
                                        {faculty.emp_id} 
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label>
                            Lab: &nbsp;&nbsp;
                            <select
                                style={{ fontSize: 17, marginBottom: 10 }}
                                value={selectedLab}
                                onChange={handleSelectChange(setSelectedLab)}
                            >
                                <option value="">Select Lab</option>
                                {labList.map((lab, index) => (
                                    <option key={index} value={lab.labId}>
                                        {lab.lab_id} 
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label>
                            Branch: &nbsp;&nbsp;
                            <select
                                style={{ fontSize: 17, marginBottom: 10 }}
                                value={selectedBranch}
                                onChange={handleSelectChange(setSelectedBranch)}
                            >
                                <option value="">Select Branch</option>
                                {branchList.map((branch, index) => (
                                    <option key={index} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label>
                            Section: &nbsp;&nbsp;
                            <select
                                style={{ fontSize: 17, marginBottom: 10 }}
                                value={selectedSection}
                                onChange={handleSelectChange(setSelectedSection)}
                            >
                                <option value="">Select Section</option>
                                {sectionList.map((section, index) => (
                                    <option key={index} value={section}>
                                        {section}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label>
                            Year: &nbsp;&nbsp;
                            <select
                                style={{ fontSize: 17, marginBottom: 10 }}
                                value={selectedYear}
                                onChange={handleSelectChange(setSelectedYear)}
                            >
                                <option value="">Select Year</option>
                                {yearList.map((year, index) => (
                                    <option key={index} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button
                        onClick={submitData}
                        style={{
                            fontSize: 17,
                            padding: '10px 20px',
                            cursor: 'pointer',
                            backgroundColor: "#F8EDED",
                            border: "0.3px solid white",
                            borderRadius: 8,
                        }}
                    >
                        Assign
                    </button>
                </div>
                <div
                    style={{
                        overflow: "auto",
                        maxHeight: 300,
                        width: 600,
                        border: '1px solid gray',
                        borderRadius: 15,
                        padding: 30,
                        margin: 2,
                        fontFamily: 'cursive',
                        background: "linear-gradient(rgba(154, 158, 160, 0.11),rgb(195, 200, 202))",
                        marginTop : '1%',
                        boxShadow: "5px 5px 15px rgba(127, 140, 179, 0.6)", 
                        border : "None",
                    }}
                >
                    <h4>Selected Values:</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: 8 }}>Faculty</th>
                                <th style={{ border: '1px solid black', padding: 8 }}>Lab</th>
                                <th style={{ border: '1px solid black', padding: 8 }}>Branch</th>
                                <th style={{ border: '1px solid black', padding: 8 }}>Section</th>
                                <th style={{ border: '1px solid black', padding: 8 }}>Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selections.map((selection, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid black', padding: 8 }}>{selection.faculty}</td>
                                    <td style={{ border: '1px solid black', padding: 8 }}>{selection.lab}</td>
                                    <td style={{ border: '1px solid black', padding: 8 }}>{selection.branch}</td>
                                    <td style={{ border: '1px solid black', padding: 8 }}>{selection.section}</td>
                                    <td style={{ border: '1px solid black', padding: 8 }}>{selection.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <center>
                <div style={{ padding: '0.000001%' }}>
                    <button
                        onClick={() => setShowFacultyModal(true)}
                        style={{
                            padding: 20,
                            fontFamily: "cursive",
                            fontSize: 18,
                            borderRadius: 6,
                            marginRight: 10,
                            backgroundColor: "rgb(164, 224, 197)",
                            border: "2px solid white",
                        }}
                    >
                        <strong>+ Add New Faculty</strong>
                    </button>
                    <button
                        onClick={() => setShowLabModal(true)}
                        style={{
                            padding: 20,
                            fontFamily: "cursive",
                            fontSize: 18,
                            borderRadius: 6,
                            backgroundColor: "rgb(164, 224, 197)",
                            border: "2px solid white",
                        }}
                    >
                        <strong>+ Add New Lab</strong>
                    </button>
                </div>
            </center>
            <FacultyModal
                show={showFacultyModal}
                handleClose={() => setShowFacultyModal(false)}
                handleSave={handleFacultyModalSave}
            />
            <LabModal
                show={showLabModal}
                handleClose={() => setShowLabModal(false)}
                handleSave={handleLabModalSave}
            />
        </div>
    );
}

// Styles
const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalContentStyle = {
    backgroundColor: "white",
    borderRadius: 20,
    width: '80%',
    maxWidth: 500,
    padding: 40,
    color: "#17153B",
    fontFamily: "cursive",
};

export default DeptAdmin;
