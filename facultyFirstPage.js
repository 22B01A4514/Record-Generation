import React, { useState } from 'react';
import FacultyClasses from './facultyClasses.js';

function FacultyFirstPage() {
    const [selectedYear, setSelectedYear] = useState('Year');
    const [selectedBranch, setSelectedBranch] = useState('Branch');

    return (
        // <div style ={{backgroundImage: 'url("R.jpeg")',backgroundSize: 'cover', 
        //     backgroundPosition: 'center',
        //     backgroundRepeat: 'no-repeat'}}>
        <div style = {{backgroundImage: 'linear-gradient(to right,rgb(246, 236, 240),rgb(169, 175, 189))'}}>
            <div style={styles.page} >
                <div style={styles.navbar}>
                    <div style={styles.dropdownContainer}>          
                        <div style={styles.navItem}>
                            <label>Year: </label>
                            <select style= {{fontSize : '15px'}} value={selectedYear} 
onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="">Year</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                            </select>
                        </div>
                        <div style={styles.navItem}>
                            <label>Branch: </label>
                            <select style= {{fontSize : '15px'}} value={selectedBranch} 
onChange={(e) => setSelectedBranch(e.target.value)}>
                                <option value="">Branch</option>
                                <option value="AI&DS">AI&DS</option>
                                <option value="AI&ML">AI&ML</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div style={styles.content}>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: "5.2%", justifyContent: 'center' }}>
                    <FacultyClasses selectedYear={selectedYear} selectedBranch={selectedBranch} />
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        fontFamily: 'Arial, sans-serif',
        height: '10vh', // Adjusted height for navbar area
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        color: 'white',
        // overflowX: 'hidden', // Prevent horizontal scroll
    },
    content: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px', // Space between cards
        padding: '20px',
        width: '100%',
    },

    title: {
        color: "#134B70",
        fontFamily: "Verdana, sans-serif",
        textShadow: "1px 1px 2px gray",
        marginBottom: '10px',
        textAlign: "center",
        fontSize: '2.0rem',
    },
    navbar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    dropdownContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '10px',
        
    },
    navItem: {
        color: 'black',
        fontSize : '20px',
    },
};

export default FacultyFirstPage;
