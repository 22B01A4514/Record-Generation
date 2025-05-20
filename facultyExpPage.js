import React, { useState , useEffect} from 'react';
import StudentProgress from './studentProgress';
import { useParams } from 'react-router-dom';
import FacultySubmissionChart from './pieChartForEachExp';

function ExperimentsUploading() {
    const { branch, section, year, subID } = useParams();
    console.log(branch, section, year, subID);
    const [experiments, setExperiments] = useState([]);
    const [selectedExperiment, setSelectedExperiment] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showStudentProgress, setShowStudentProgress] = useState(false);
    const [expNo, setExpNo] = useState();
    const [query, setQuery] = useState(""); // User input
  const [results, setResults] = useState([]); // Store search results
  const [selectedLinks, setSelectedLinks] = useState(new Set()); // Selected links

  const fetchResults = async () => {
    if (!query) return;

    const apiKey = "AIzaSyB3Kdw7wb9yGyLuPayQj4WeEfhCIceDf7Y"; // Replace with your Google API Key
    const cx = "a1b37a9ce30e542f4"; // Replace with your CSE ID
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.items) {
        // Extract top 5 URLs with titles
        const urlList = data.items.slice(0, 5).map((item) => ({
          title: item.title,
          link: item.link,
        }));
        setResults(urlList);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };
  const handleCheckboxChange = (link, isChecked) => {
    setSelectedLinks((prevLinks) => {
        const updatedLinks = new Set(prevLinks);

        if (isChecked) {
            updatedLinks.add(link);
        } else {
            updatedLinks.delete(link);
        }

        return new Set(updatedLinks); // Ensuring state updates correctly
    });
};


    const [newExperiment, setNewExperiment] = useState({
        number: '',
        topic: '',
        description: ''
    });
    // const [students, setStudents] = useState([
    //     // { regdNo: '22B01A4514', experiments: { exp1: { submitted: true, marks: 85 }, exp2: { submitted: false } } },
    //     // { regdNo: '22B01A4518', experiments: { exp1: { submitted: true, marks: 90 }, exp2: { submitted: true, marks: 80 } } },
    //     // { regdNo: '22B01A4541', experiments: { exp1: { submitted: false }, exp2: { submitted: true, marks: 75 } } },
    // ]);
    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/Experiments/${subID}`);
                if (response.ok) {
                    const data = await response.json();
                    setExperiments(data);
                } else {
                    console.error('Failed to fetch experiments');
                }
            } catch (error) {
                console.error('Error fetching experiments:', error);
            }
        };
    
        if (subID) fetchExperiments(); // Ensure subID is valid before fetching
    }, [subID]); // Add subID as a dependency
    

    
    const handleAddExperiment = async () => {
        if (!newExperiment.number || !newExperiment.topic || !newExperiment.description) {
            alert("All fields are required.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3001/api/Exp/${subID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newExperiment,
                    selectedLinks: Array.from(selectedLinks), // Convert Set to Array
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setExperiments([...experiments, { ...newExperiment, id: result.experimentId }]);
                setShowPopup(false);
                setNewExperiment({ number: '', topic: '', description: '' });
                setSelectedLinks(new Set()); // Reset selected links
                alert('Experiment added successfully!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not add the experiment. Please try again.');
        }
    };
    useEffect(() => {
        if (experiments.length > 0) {
            setSelectedExperiment(experiments[0]);  // Select the first experiment
        }
    }, [experiments]);

    const handleExperimentClick = (experiment, exp) => {
        setSelectedExperiment(experiment);
        setNewExperiment(experiment);
        setExpNo(exp);
        setIsEditing(false);
    };

    const [showProgress, setShowProgress] = useState(false);
    const toggleProgress = () => {
        setShowProgress(!showProgress);
    };

    const handleMarksEvaluationClick = () => {
        setShowStudentProgress(!showStudentProgress); // Toggle student progress section
    };

    const handleEditExperiment = () => {
        setIsEditing(true);
    };
    const handleDeleteExperiment = async () => {
        if (!selectedExperiment) return;

        if (window.confirm("Are you sure you want to delete this experiment?")) {
            try {
                const response = await fetch(`http://localhost:3001/api/Exp/${selectedExperiment.number}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setExperiments(experiments.filter(exp => exp.number !== selectedExperiment.number));
                    setSelectedExperiment(null);
                    alert('Experiment deleted successfully!');
                } else {
                    const result = await response.json();
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Could not delete the experiment. Please try again.');
            }
        }
    };


    const handleSaveExperiment = async () => {
        if (!newExperiment.number || !newExperiment.topic || !newExperiment.description) {
            alert("All fields are required.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/Exp/${selectedExperiment.number}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newExperiment),
            });

            const result = await response.json();

            if (response.ok) {
                const updatedExperiments = experiments.map(exp =>
                    exp.number === selectedExperiment.number ? newExperiment : exp
                );
                setExperiments(updatedExperiments);
                setSelectedExperiment(newExperiment);
                setIsEditing(false);
                alert('Experiment updated successfully!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not update the experiment. Please try again.');
        }
    };

    return (
        <div className="experiments-uploading-container">
            <style>{`
                .experiments-uploading-container {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                }

                .split-left {
                    flex: 1;
                    max-width: 300px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 10px;
                    // box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    height: 100vh;
                }

                .experiment-list {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 10px;
                }

                .experiment-item {
                    margin: 10px 0;
                    padding: 10px;
                    background-color:rgb(185, 202, 225);
                    cursor: pointer;
                    border-radius: 5px;
                    // color : white;
                    text-align : center;
                    font-weight: bold;
                    font-size:18px;
                }

                .add-experiment-button {
                    margin-top: 80%; /* Push the button to the bottom */
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    text-align: center;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                    margin: 10px 0;
                }

                .split-right {
                    flex: 3;
                    padding: 20px;
                    overflow-y: auto;
                    box-sizing: border-box;
                    height: 100vh;
                }

                .popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: white;
                    padding: 40px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                    z-index: 50;
                    width: 800px;
                    max-width: 90%;
                }

                .popup input {
                    display: block;
                    margin: 10px 0;
                    width: calc(100% - 20px);
                    padding: 10px;
                    font-size: 16px;
                }

                .popup label {
                    display: block;
                    margin: 10px 0 5px 0;
                    font-size: 18px;
                    font-weight: bold;
                }

                .popup button {
                    margin-top: 10px;
                    padding: 7px 20px;
                    margin-left: 10px;
                    border-radius: 5px;
                }


                .edit-section {
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                    margin-top: 20px;
                }

                .edit-section h2 {
                    font-size: 24px;
                    margin-bottom: 15px;
                }

                .edit-section label {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                }

                .edit-section input {
                    width: calc(100% - 20px);
                    padding: 10px;
                    margin-bottom: 10px;
                    font-size: 16px;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                }

                .edit-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }

                .edit-buttons button {
                    padding: 7px 20px;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                }

                .edit-buttons .save-button {
                    background-color: #9CDBA6;
                    color: black;
                }
                .edit-button {
                    background-color: white;
                    color: black;
                    float: right;
                    padding: 6px 20px;
                    border-radius: 5px;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    margin-top: 10px;
                }

                .edit-buttons .cancel-button {
                    background-color: #FFBF9B;
                    color: black;
                }
                .delete-button {
                    background-color: white;
                    float: right;
                    padding: 6px 20px;
                    border-radius: 5px;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    margin-top: 10px;
                    margin-left: 10px;
                }

                .marks-evaluation-button {
                    padding: 10px;
                    background-color: #28a745;
                    color: white;
                    text-align: center;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    align-self: flex-end;
                    width: 200px;
                }

                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 49;
                }
            `}</style>

            <div style = {{backgroundColor : 'rgba(255, 255, 255, 0.16)'}}className="split-left">
            <button className="add-experiment-button" onClick={() => setShowPopup(true)}>Add Experiment</button>
            <button 
                onClick={toggleProgress} 
                style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 5 }}
            >
                Students Complete Progress
            </button>
                <div className="experiment-list">
                    {experiments.map((exp, index) => (
                        <div key={index} className="experiment-item" onClick={() => handleExperimentClick(exp, exp.number)}>
                            {`Experiment ${exp.number}`}
                        </div>
                    ))}
                </div>
                 {/* <button className="add-experiment-button" onClick={handleMarksEvaluationClick}>
                    {showStudentProgress ? 'Hide Student Analysis' : 'Student Wise Analysis'}
                </button> */}
            </div>


            <div className="split-right">
                {selectedExperiment ? (
                    <>
                        {isEditing ? (
                            <div className="edit-section">
                                <h2>Edit Experiment</h2>
                                <label>Topic Name</label>
                                <input
                                    type="text"
                                    value={newExperiment.topic}
                                    onChange={(e) => setNewExperiment({ ...newExperiment, topic: e.target.value })}
                                />
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={newExperiment.description}
                                    onChange={(e) => setNewExperiment({ ...newExperiment, description: e.target.value })}
                                />
                                <div className="edit-buttons">
                                    <button className="save-button" onClick={handleSaveExperiment}>Save</button>
                                    <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button className="edit-button" onClick={handleEditExperiment}><i className="fas fa-edit" /></button>
                                {/* <button className="delete-button" onClick={handleDeleteExperiment} style={{opacity:0}}><i className="fas fa-trash"></i></button> */}
                                <div>
                                    <center><h2>{selectedExperiment.topic}</h2></center>
                                </div>
                                <p style={{ fontSize: 17 }}>{selectedExperiment.description}</p>
                            </>
                        )}
                        <br />
                        <div><center>
                            <button className="marks-evaluation-button" onClick={handleMarksEvaluationClick}>Student Progress</button>
                        </center>
                        
                            {showStudentProgress && <StudentProgress branch = {branch} section = {section} year = {year} subID = {subID} expNo = {expNo} />}
                        </div>
                    </>
                ) : (
                    <p>Select an experiment to view details.</p>
                )}
            </div>

            {showPopup && (
                <>
                   
                    <div className="overlay" onClick={() => setShowPopup(false)}></div>
                    <div className="popup" style={{ overflowY: "auto", overflowX: "hidden", maxHeight: "80vh" }}>
                        <center><h3>Add New Experiment</h3></center>
                        <label>Experiment Number</label>
                        <input
                            type="number"
                            placeholder="Experiment Number"
                            value={newExperiment.number}
                            onChange={(e) => setNewExperiment({ ...newExperiment, number: e.target.value })}
                        />
                       <label>Topic Name</label>
          <input
            type="text"
            placeholder="Topic Name"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setNewExperiment({ ...newExperiment, topic: e.target.value });
            }}
          />

          <button onClick={fetchResults} style={{ backgroundColor: "#4CAF50", color: "white" }}>
            Search Relevant Websites
          </button>

          <div style={styles.container}>
  {results.length > 0 ? (
    results.map((result, index) => (
      <div key={index} >
        <input
          type="checkbox"
          checked={selectedLinks.has(result.link)}
          onChange={(e) => handleCheckboxChange(result.link, e.target.checked)}
        />
        <a
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "10px", ...styles.link }}
          onMouseOver={(e) => (e.target.style.background = styles.linkHover.background)}
          onMouseOut={(e) => (e.target.style.background = "transparent")}
        >
          <i className="fas fa-edit"></i> {result.title}
        </a>
      </div>
    ))
  ) : (
    <p>No results found.</p>
  )}
</div>

          
                        <label>Description</label>
                        <input
                            type="text"
                            placeholder="Description"
                            value={newExperiment.description}
                            onChange={(e) => setNewExperiment({ ...newExperiment, description: e.target.value })}
                        />

                        <div>
                            <button onClick={handleAddExperiment} style={{ backgroundColor: "#9CDBA6" }}>Add</button>
                            <button onClick={() => setShowPopup(false)} style={{ backgroundColor: "#FFBF9B" }}>Cancel</button>
                        </div>
                    </div>
                </>
            )}
{/* {showProgress && (
    <div>
        <h4>Students Complete Progress</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Registration Number</th>
                    {Object.keys(students[0]?.experiments || {}).map(expName => (
                        <th key={expName} style={{ border: '1px solid black', padding: '8px' }}>{expName.toUpperCase()}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {students.map(student => (
                    <tr key={student.regdNo}>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{student.regdNo}</td>
                        {Object.entries(student.experiments).map(([expName, details]) => (
                            <td key={expName} style={{ border: '1px solid black', padding: '8px' }}>
                                {details.submitted
                                    ? `Marks: ${details.marks || 'N/A'}`
                                    : 'Not Submitted'}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)} */}

        </div>
    );
}

const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
    //   alignItems: "center",
      gap: "10px",
      marginTop: "20px",
    },
    input: {
      width: "300px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#4285f4",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#357ae8",
    },
    resultsContainer: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "80%",
      maxWidth: "500px",
    },
    link: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
      color: "#333",
      fontWeight: "bold",
      border: "1px solid #ddd",
      padding: "10px",
      borderRadius: "5px",
      transition: "background 0.3s",
    },
    linkHover: {
      background: "#f1f1f1",
    },
    icon: {
      width: "20px",
      height: "20px",
    },
  };

export default ExperimentsUploading;
