import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalContext } from './App';

function ExperimentsCart({ subCode, expname, topic, descript }) {
    const [isPopupOpenBrowse, setPopupOpenBrowse] = useState(false);
    const [isPopupOpenResult, setPopupOpenResult] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [message, setMessage] = useState('');
    const { globalUsername } = useContext(GlobalContext);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState([]);
    const [available, setAvailable] = useState(false);
    // useEffect(() => {
    //     if (!subCode || !expname) {
    //         console.error("Missing subCode or expNo");
    //         return;
    //     }
    
    //     fetch(`/api/links/${subCode}/${expname}`)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             setLinks(data.links || []);
    //         })
    //         .catch(error => {
    //             console.error("Error fetching links:", error);
    //         });
    // }, [subCode, expname, globalUsername]);

    
    
    useEffect(() => {
        if (!globalUsername || !subCode || !expname) return;
    
        const fetchTotalpdfAvailability = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/pdf_available/${globalUsername}/${subCode}/${expname}`
                );
    
                if (response.status === 200) {
                    setAvailable(response.data.available);
                }
            } catch (error) {
                console.error("Error fetching PDF availability:", error);
                setAvailable(false);
            }
        };
    
        fetchTotalpdfAvailability();
    }, [globalUsername, subCode, expname]);
    



    useEffect(() => {
        const resultKey = `results_${globalUsername}_${subCode}_${expname}`;
        const storedResults = localStorage.getItem(resultKey);
        
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    
        const fetchResults = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3001/api/results/${globalUsername}/${subCode}/${expname}`);
    
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched results:", data);
    
                    if (data && data.length > 0) {
                        setResults(data);
                        localStorage.setItem(resultKey, JSON.stringify(data));  // Store per experiment
                    }
                } else {
                    console.error('Failed to fetch results');
                }
            } catch (error) {
                console.error('Error fetching results:', error);
            } finally {
                setLoading(false);
            }
        };
    
        if (globalUsername && subCode && expname) {
            fetchResults();
        }
    }, [globalUsername, subCode, expname]); 

    const closePopupBrowse = () => setPopupOpenBrowse(false);
    const closePopupResult = () => setPopupOpenResult(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault(); 
        if (!file) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('rno', globalUsername);
        formData.append('subCode', subCode);
        formData.append('expNo', expname);
        formData.append('pdf', file);

        try {
            await axios.post(`http://localhost:3001/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(`"${fileName}" uploaded successfully!`);
            
        } catch (error) {
            alert('Upload failed');
            console.error(error);
        }
    };
    
    const handleDelete = async (e) => {
        // e.preventDefault(); 
        // if (!fileName) {
        //     alert("No file selected for deletion.");
        //     return;
        // }

        if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
            try {
                const response = await fetch(`http://localhost:3001/api/delete`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        rno: globalUsername,
                        subCode: subCode,
                        expNo: expname,
                        pdf_id: globalUsername
                    }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(`"${fileName}" deleted successfully!`);
                    setFile(null);
                    setFileName('');
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Could not delete the file. Please try again.');
            }
        }
    };
    const fetchi = async (e) => {
        if (results && results.length > 0 && results[0].marks != null && results[0].feedback != null)
            setPopupOpenResult(true);
        else
            alert('Marks Not Assigned.');
    };
    

    return (
        <div>
            <div 
                style={{ marginLeft: "15%", marginRight: "15%", boxShadow: '6px 3px 8px rgba(0,0,8,0.4)', borderRadius: 10,backgroundColor: results && results.length > 0 && results[0].marks != null && results[0].feedback != null ? "#D3E2C7" : "white"  }}
            >
                <div style={{ display: 'flex', flexFlow: "row wrap", margin: 20, justifyContent: "space-between", flex: 1, fontFamily:'cursive' }}>
                    <h3>Experiment - {expname}</h3>
                    <h4>{topic}</h4>
                    <div>
                    <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                if (results && results.length > 0 && results[0].marks != null && results[0].feedback != null) {
                                    alert("Results have already been declared. You cannot upload or delete the file.");

                                } else {
                                    setPopupOpenBrowse(true);
                                }
                            }} 
                            style={{ width: 80, height: 30, marginTop: 20, borderRadius: 10, backgroundColor:"rgba(78, 101, 90, 0.88)", color:"white" }}
                        >
                            Submit
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); fetchi(); }} 
                            style={{ width: 80, height: 30, marginTop: 20, borderRadius: 10, backgroundColor:"rgba(78, 101, 90, 0.88)", marginLeft:"5px", color:"white" }}
                        >
                            Result
                        </button>
                    </div>
                </div>
            </div>

            {isPopupOpenBrowse && (
        <div style={styles.popupOverlay} onClick={closePopupBrowse}>
            <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <h2>Description</h2>
                <p>{descript}</p>
                {/* <div>
                            {links.length > 0 ? (
                                links.map((link, index) => (
                                    <p key={index}>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                                            {link.url}
                                        </a>
                                    </p>
                                ))
                            ) : (
                                <p>No additional resources available.</p>
                            )}
                        </div> */}
                <div>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    <button onClick={handleUpload} style={styles.uploadButton}>Upload</button>
                    <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
                </div>
                <div>
                    {available ? (
                        <a href={`http://localhost:3001/pdf/${globalUsername}/${subCode}/${expname}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {globalUsername}
                        </a>
                    ) : (
                        <p style={{ color: 'red', fontWeight: 'bold' }}>No file found</p>
                    )}
                </div>

            </div>
        </div>
    )   }         {/* Popup for Result */}
            {isPopupOpenResult && (
                <div style={styles.popupOverlay} onClick={closePopupResult}>
                    <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                        {results && results.length > 0 ? (
                            <>
                                <h3>Marks  <span>{results[0].marks}</span></h3>
                                <h3>Feedback: {results[0].feedback}</h3>
                            </>
                        ) : (
                            <h3>No results available</h3>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popupContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    uploadButton: {
        width: 80,
        height: 30,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: "#AABB9B",
        marginRight: 10,
    },
    deleteButton: {
        width: 80,
        height: 30,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: "#FFBF9B",
    },
};

export default ExperimentsCart;
