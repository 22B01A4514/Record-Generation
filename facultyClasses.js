import React, { useContext, useEffect, useState } from 'react';
import BranchesCart from "./branchescart";
import { GlobalContext } from './App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FacultyClasses({ selectedYear, selectedBranch }) {
    const navigate = useNavigate();
    const { globalUsername } = useContext(GlobalContext);

    const [assignedSections, setAssignedSections] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log("Global Username:", globalUsername);

    useEffect(() => {
        if (!globalUsername) return; // Ensure globalUsername is available before making request
        
        axios.get(`http://localhost:3001/api/faculty-assignments/${globalUsername}`)
            .then(response => {
                console.log("Fetched Assignments:", response.data);
                setAssignedSections(response.data);
            })
            .catch(error => {
                console.error("Error fetching faculty assignments:", error);
            })
            .finally(() => setLoading(false)); // Ensure loading state updates
    }, [globalUsername]); // Dependency array ensures the effect runs when globalUsername changes
    
    console.log(assignedSections);

    if (loading) {
        return <p>Loading Assignments...</p>;
    }

    if (!assignedSections.length) {
        return <p>No Assignments Found...</p>;
    }
    
    
    // Filtered cards based on assigned sections
    const filteredCards = assignedSections.filter(card => 
        (selectedYear === 'Year' || card.year.toString() === selectedYear) &&
        (selectedBranch === 'Branch' || card.branch === selectedBranch)
    );
    // console.log(filteredCards.section);
    return (
        <div style={{ display: 'flex', flexFlow: 'row wrap', padding: "5% 9% 5% 9%", marginTop: "-7%" }}>
            {filteredCards.map((card, index) => (
                <BranchesCart
                    key={index}
                    branchName={card.branch}
                    section={card.section}
                    year={card.year}
                    subject={card.lab_name}
                    subID = {card.lab_id}
                />
                
            ))}

        </div>
    );
    
    
}

export default FacultyClasses;
