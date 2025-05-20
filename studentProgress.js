import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "./App";
// import FacultySubmissionChart from "./pieChartForEachExp";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

function StudentProgress({ branch, section, year, subID, expNo }) {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [submittedStudents, setSubmittedStudents] = useState("");
    const [totalStudents, setTotalStudents] = useState("");
    const { globalUsername } = useContext(GlobalContext);
    const [showNotSubmittedOnly, setShowNotSubmittedOnly] = useState(false);
    useEffect(() => {
        const fetchStudentProgress = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/StudentsProgress/${subID}/${expNo}/${globalUsername}/${branch}/${section}/${year}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                    setSubmittedStudents(data.length);
                } else {
                    console.error("Failed to fetch student progress");
                }
            } catch (error) {
                console.error("Error fetching student progress:", error);
            }
        };

        fetchStudentProgress();
    }, [subID, expNo, globalUsername, branch, section, year]);
    useEffect(() => {
        const fetchTotalStudents = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/total-students/${branch}/${section}/${year}`
                );
    
                if (response.ok) {
                    const data = await response.json();
                    setTotalStudents(data.totalStudents);  // Store the total number of students
                } else {
                    console.error("Failed to fetch total students");
                }
            } catch (error) {
                console.error("Error fetching total students:", error);
            }
        };
    
        fetchTotalStudents();
    }, [branch, section, year]);
    console.log(totalStudents);    
    

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleMarksChange = (rno, newMarks) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.rno === rno ? { ...student, marks: parseInt(newMarks) || 0 } : student
            )
        );
    };

    const handleFeedbackChange = (rno, newFeedback) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.rno === rno ? { ...student, feedback: newFeedback } : student
            )
        );
    };


    const [notSubmittedRollNumbers, setNotSubmittedRollNumbers] = useState([]);

    // Function to handle Pie Click Event (Only for "Not Submitted")
    const handlePieClick = async (entry) => {
        if (entry.name === "Not Submitted") {
            try {
                const response = await fetch(`http://localhost:3001/api/getNotSubmittedStudents/${branch}/${section}/${year}/${subID}/${expNo}`);
    
                // Validate JSON response
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid JSON response from server");
                }
    
                const result = await response.json();
                setNotSubmittedRollNumbers(result); // Expecting an array of roll numbers
                setShowNotSubmittedOnly(true);
            } catch (error) {
                console.error("Error fetching student roll numbers:", error);
            }
        }else if (entry.name === "Submitted") {
            setShowNotSubmittedOnly(false); // Keep the table unchanged
        }
    };
    
    const handleSaveMarks = async (rno, subCode, expNo, marks, feedback) => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/savemarks/${rno}/${subCode}/${expNo}/${marks}/${feedback}`,
                { method: "POST" }
            );

            if (response.ok) {
                alert(`Marks saved successfully for ${rno}`);
            } else {
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Error connecting to server");
        }
    };

    const filteredStudents = students.filter((student) =>
        student.rno && student.rno.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const notSubmittedStudents = totalStudents - submittedStudents;

    // Pie Chart Data
    const data = [
        { name: "Submitted", value: submittedStudents, color: "#4CAF50" },
        { name: "Not Submitted", value: notSubmittedStudents, color: "#F44336" }
    ];
    return (
        <div style={{ marginTop: "20px", border: "1px solid gray", backgroundColor:"rgba(255, 255, 255, 0)", padding: "20px", borderRadius: "8px" }}>
            <div style={{display:"flex", height:"30vh"}}>
            <div style={{ width: "70%",  justifyContent: "flex-end", alignItems: "center" }}>
    <div style={{marginLeft:"60%"}}><h2 >Marks Evaluation</h2></div> {/* Added margin-right for spacing */}
    {/* <br></br> */}
    <div style={{ position: "relative", marginBottom: "20px", padding: "10px", width: "32%", borderRadius: "13px", border: "2px solid black", height: "35px" }}>
        <input
            type="text"
            placeholder="Search by Registration Number"
            value={searchTerm}
            onChange={handleSearch}
            style={{
                backgroundColor: "rgba(229, 204, 229, 0)",
                width: "90%",
                padding: "10px 40px 10px 15px", // Space for icon on the right side
                borderRadius: "13px",
                border: "2px solid rgba(229, 204, 229, 0)",
                outline: "none",
                transition: "border 0.3s ease-in-out",
            }}
            onFocus={(e) => e.target.style.border = "2px solid transparent"} // Remove border on focus
            onBlur={(e) => e.target.style.border = "2px solid white"}
        />
        <i className="fa-solid fa-magnifying-glass" style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "18px",
            color: "#888"
        }}></i>
    </div>
</div>

                <div style={{width:"30%"}}>
                    <div style={styles.container}>
                                <div style={styles.chartBox}>
                                    {/* <h2>Submission Analysis</h2> */}
                                    <PieChart width={300} height={200}>
                                        <Pie
                                            data={data}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={40}
                                            fill="#8884d8"
                                            label
                                            onClick={handlePieClick}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                        {/* <Tooltip /> */}
                                    </PieChart>
                                </div>
                            </div>
                    
                    

                </div>
                
            </div>
            {showNotSubmittedOnly ? (<div>
                {notSubmittedRollNumbers.length > 0 && (
    <div style={styles.rollNumberContainer}>
        <i 
            className="fa-solid fa-copy"
            onClick={() => {
                const rollNumbersText = notSubmittedRollNumbers.join("\n"); // Copies with new lines
                navigator.clipboard.writeText(rollNumbersText);
                alert("Copied to clipboard!");
            }}
            style={styles.copyIcon}
            title="Copy Roll Numbers"
        ></i>
        <p>
            <div style={styles.rollNumberList}>
            {notSubmittedRollNumbers.map((rno, index) => (
                <span key={index} style={styles.rollNumberBox}>{rno} <br /></span>
            ))}
            </div>
        </p>
    </div>
)}
</div> )
            : (<div> 
             <table style={{ width: "100%", borderCollapse: "collapse" , height:"80px", fontSize:"18px"}}>
             {filteredStudents.length === 0 ? (
                <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                    No data available
                </td>
            </tr>
        ) : (
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Registration Number</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Uploaded PDF</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Marks</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Feedback</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
                    </tr>
                </thead>)}
                <tbody>
                    {filteredStudents.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                            </td>
                        </tr>
                    ) : (
                        filteredStudents.map((student, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{student.rno}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>
                                    <a
                                        href={`http://localhost:3001/pdf/${student.rno}/${student.subCode}/${student.expNo}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open PDF
                                    </a>
                                </td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>
                                    <input
                                        type="number"
                                        value={student.marks ?? 0}
                                        onChange={(e) => handleMarksChange(student.rno, e.target.value)}
                                        style={{ width: "60px" }}
                                    />
                                </td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>
                                    <input
                                        type="text"
                                        value={student.feedback || ""}
                                        onChange={(e) => handleFeedbackChange(student.rno, e.target.value)}
                                        style={{ width: "100%" }}
                                    />
                                </td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>
                                    <button style={{backgroundColor:"#28a745", color:"white",border:"None", borderRadius:"5px", padding:"5px", paddingRight:"10%", paddingLeft:"10%"}}
                                        onClick={() =>
                                            handleSaveMarks(student.rno, student.subCode, student.expNo, student.marks, student.feedback)
                                        }
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table> </div> )}
        </div>
    );
}

const styles = {
    container: {
        // marginTop: "-40px",
        display: "flex",
        justifyContent: "flex-end",  // Aligns content to the right
        alignItems: "center",
        height: "25vh",
        // backgroundColor: "#f5f5f5",
        // paddingRight: "20px", // Adds a bit of spacing from the right edge
    },
    chartBox: {
        background: "#fff",
        // padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center"
    },
    rollNumberContainer: {
        position: "relative",
        // background: "#f9f9f9",
        // border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "8px",
        fontSize: "16px",
        maxWidth: "15%",
        wordWrap: "break-word",
        marginTop: "10px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    },
    rollNumberList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px", // Space between boxes
        justifyContent: "flex-start",
    },

    rollNumberBox: {
        // border: "1px solid black",
        padding: "8px 12px",
        borderRadius: "5px",
        background: "#f8f9fa",
        fontSize: "16px",
        textAlign: "center",
        minWidth: "60px",
    },
    copyIcon: {
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "18px",
        cursor: "pointer",
        color: "#555",
    }
};



export default StudentProgress;
