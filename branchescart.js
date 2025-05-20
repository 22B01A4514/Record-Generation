import { useNavigate } from 'react-router-dom';
import React from 'react';

function BranchesCart({ branchName, section, year, subject, subID }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/faculty-exp-page/${branchName}/${section}/${year}/${subID}`);
    };

    return (
        <div
            onClick={handleCardClick}
            style={styles.card}
        >
            <h2 style={styles.branch}>{branchName}</h2>
            <h3 style={styles.section}>Section : {section}</h3>
            <h3 style={styles.year}>Year : {year}</h3>
            <h3 style={styles.year}>Subject : <span style={styles.lab_name}>{subject}</span></h3>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: 'white',
        boxShadow: '6px 3px 9px rgba(59, 59, 67, 0.88)',
        margin: '15px',
        borderRadius: '10px',
        padding: '26px',
        width: '90%',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        maxWidth: '250px', // Limits the max width for each card
        height: '150px', // Adjust as needed
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    cardHover: {
        transform: 'scale(1.05)',
        boxShadow: '6px 3px 12px rgba(0, 0, 10, 0.2)',
    },
    branch: {
        fontSize: '1.6rem',
        color: 'rgba(182, 6, 6, 0.81)',
        margin: '10px 0',
    },
    section: {
        fontSize: '1.2rem',
        color: '#333',
        margin: '5px 0',
    },
    year: {
        fontSize: '1.3rem',
        color: '#555',
        margin: '5px 0',
    },
    lab_name: {
        fontSize: '1.3rem',
        color: 'rgba(18, 3, 112, 0.95)',
        margin: '5px 0',
    },
};

export default BranchesCart;
