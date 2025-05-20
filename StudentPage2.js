import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ExperimentsCart from './ExperimentsCart';
import { GlobalContext } from './App';
// const { PDFDocument } = require('pdf-lib');

function StudentPage2() {
    const { subID, submitted, pending } = useParams();
    const [experiments, setExperiments] = useState([]);
    const [pdfs, setpdfs] = useState([]);
    const { globalUsername } = useContext(GlobalContext);
    
        const [loading, setLoading] = useState(true);
const resultKey = `results_${globalUsername}_${subID}_`;
    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/Experiments/${subID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch experiments');
                }
                const data = await response.json();
                setExperiments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching experiments:', error);
            }
        };

        if (subID) fetchExperiments();
    }, [subID]);

    
    const fetchResults = async () => {
        // try {
        //     const response = await fetch(`http://localhost:3001/api/pdfdata/${globalUsername}/${subID}`);
        //     if (!response.ok) {
        //         throw new Error('Failed to fetch experiments');
        //     }
        //     const data = await response.json();
        //     setpdfs(Array.isArray(data) ? data : []);
        // } catch (error) {
        //     console.error('Error fetching experiments:', error);
        // }
        try {
            setLoading(true);
            // console.log(globalUsername, subID);
    
            const response = await fetch(`http://localhost:3001/api/mergepdfs/${globalUsername}/${subID}`);
            console.log(globalUsername, subID);
            if (!response.ok) {
                throw new Error('Failed to merge PDFs');
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${globalUsername}_${subID}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error merging PDFs:', error);
        } finally {
            setLoading(false);
        }
    };
    // console.log(pdfs);
    
    // // Count submitted and pending experiments dynamically
    // const submittedCount = experiments.filter(exp => exp.status === 'submitted').length;
    // const pendingCount = experiments.length - submittedCount;

    return (
        <div>
            <div style={{
                margin: 15,
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'space-around',
                fontFamily: 'cursive'
            }}>
                <h2>Experiments Submitted: {submitted}</h2>
                <h2>Experiments Pending: {pending}</h2>
            </div>

            {/* Rendering Experiments */}
            {experiments.length > 0 ? (
                experiments.map((exp, index) => (
                    <ExperimentsCart
                        key={exp.id || index} // Use unique key
                        subCode={subID}
                        expname={exp.number}
                        topic={exp.topic}
                        descript={exp.description}
                    />
                ))
            ) : (
                <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '20px' }}>No experiments found.</p>
            )}

<center>
    <button 
        onClick={fetchResults} 
        style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
    >
        Generate Record
    </button>
</center>

        </div>
    );
}

export default StudentPage2;
