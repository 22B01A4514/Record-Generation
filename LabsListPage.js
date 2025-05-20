import LabsCart from "./LabsCart";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LabsListPage() {
    const navigate = useNavigate();
    const { globalUsername } = useContext(GlobalContext);

    const [assignedSections, setAssignedSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalExperiments, setTotalExperiments] = useState({});
    const [totalExperimentsSubmitted, setTotalExperimentsSubmitted] = useState({});

    console.log("Global Username:", globalUsername);

    useEffect(() => {
        if (!globalUsername) return;

        axios
            .get(`http://localhost:3001/api/student-subjects/${globalUsername}`)
            .then((response) => {
                console.log("Fetched Assignments:", response.data);
                setAssignedSections(response.data);
            })
            .catch((error) => {
                console.error("Error fetching faculty assignments:", error);
            })
            .finally(() => setLoading(false));
    }, [globalUsername]);

    useEffect(() => {
        if (!assignedSections.length) return;

        const fetchTotalExperiments = async () => {
            let totalExps = {};
            try {
                console.log("Assigned Sections:", assignedSections);

                for (const section of assignedSections) {
                    const response = await axios.get(
                        `http://localhost:3001/api/total-experiments/${section.lab_id}`
                    );
                    totalExps[section.lab_id] = response.data.total_experiments;
                }
                setTotalExperiments(totalExps);
            } catch (error) {
                console.error("Error fetching total experiments:", error);
            }
        };

        fetchTotalExperiments();
    }, [assignedSections]);

    useEffect(() => {
        if (!assignedSections.length) return;
    
        const fetchSubmittedExperiments = async () => {
            let submittedExps = {};
            try {
                console.log("Fetching total experiments submitted for:", globalUsername);
    
                for (const section of assignedSections) {
                    const response = await axios.get(
                        `http://localhost:3001/api/total-experiments-submitted/${globalUsername}/${section.lab_id}`
                    );
                    submittedExps[section.lab_id] = response.data.total_submitted_experiments;
                }
                setTotalExperimentsSubmitted(submittedExps);
            } catch (error) {
                console.error("Error fetching total experiments submitted:", error);
            }
        };
    
        fetchSubmittedExperiments();
    }, [assignedSections]);
        
    console.log("Total Experiments:", totalExperiments);
    console.log("Total Experiments Submitted:", totalExperimentsSubmitted);

    if (loading) {
        return <p>Loading Assignments...</p>;
    }

    if (!assignedSections.length) {
        return <p>No Assignments Found...</p>;
    }

    return (
        <div style={{ display: "flex", flexFlow: "row wrap", padding: "1%", marginLeft: 100 }}>
            {assignedSections.map((card, index) => (
                <LabsCart
                    key={card.lab_id || index}
                    labName={card.lab_name}
                    noOfExp={totalExperiments[card.lab_id]}
                    noOfExpSubmit={totalExperimentsSubmitted[card.lab_id] || 0}
                    noOfExpPending={(totalExperiments[card.lab_id] || 0) - (totalExperimentsSubmitted[card.lab_id] || 0)}
                    percent={((totalExperimentsSubmitted[card.lab_id] || 0) / (totalExperiments[card.lab_id] || 1)) * 100}
                    subID={card.lab_id}
                />
            ))}
        </div>
    );
}

export default LabsListPage;
