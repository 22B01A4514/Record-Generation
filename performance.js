import React from 'react';

function Performance({ completePercentage }) {
    let remainingColor = '#DD5746';
    
    // if (completePercentage <= 25)
    //     remainingColor = '#DD5746';
    // else if (completePercentage > 25 && completePercentage < 50) 
    //     remainingColor = '#FFAD60';
    // else if (completePercentage >= 50 && completePercentage <= 75) 
    //     remainingColor = '#FFDE4D';
    // else if (completePercentage > 75 && completePercentage < 100) 
    //     remainingColor = '#7FA1C3';

    return (
        <div style={{ width: '100%', backgroundColor: remainingColor, borderRadius: '5px', overflow: 'hidden', maxWidth: '100%' }}>
            <div
                style={{
                    width: `${completePercentage}%`,
                    backgroundColor: '#88D66C',
                    height: '10px',  // Reduced height for a thinner bar
                    transition: 'width 0.3s ease-in-out'
                }}
            />
        </div>
    );
}

export default Performance;
