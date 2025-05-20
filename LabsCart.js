import React from 'react';
import { useNavigate } from 'react-router-dom';
import Performance from './performance';

function LabsCart({ labName, noOfExp, noOfExpSubmit, noOfExpPending, percent,  subID}) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/exp-page/${subID}/${noOfExpSubmit}/${noOfExpPending}`); 
    };

    return (
        <div
            onClick={handleCardClick}
            style={{
                backgroundColor: 'white',
                boxShadow: '6px 3px 9px rgba(0,0,10,0.9)',
                margin: 20,
                borderRadius: 10,
                padding: 70,
                paddingTop: 40,
                paddingBottom: 40,
                width: 160,
                height: 260,
                cursor: 'pointer', 
            }}
        >
            <center>
                <h2 style={{color:"#134B70"}}>{labName}</h2>
            </center>
            <p>Total Experiments: <strong>{noOfExp}</strong></p>
            <p>Submitted: <strong>{noOfExpSubmit}</strong></p>
            <p>Pending: <strong>{noOfExpPending}</strong></p>
            <Performance completePercentage={percent}/>
        </div>
    );
}

export default LabsCart;
