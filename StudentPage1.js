import LabsListPage from './LabsListPage.js';
import React from 'react';

function StudentPage1() {
    return (
        <div style={styles.page}>
            {/* <nav style={styles.navbar}>
                <img src={"vishnuLogo2.png"} style={styles.logo} alt="Logo" />
                <div style={styles.navItem}>
                    <h3 style={styles.heading}>Course: <span style={styles.normalText}>B.Tech</span></h3>
                </div>
                <div style={styles.navItem}>
                    <h3 style={styles.heading}>Department: <span style={styles.normalText}>Artificial Intelligence</span></h3>
                </div>
            </nav> */}
            <div style={styles.content}>
                <h1 style={styles.title}>Labs Current Progress</h1>
                <div style={styles.scrollableContainer}>
                    <LabsListPage />
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        // height: '100vh',
        backgroundImage: 'linear-gradient(to right,rgb(246, 236, 240),rgb(169, 175, 189))',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#f8f8f8',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    logo: {
        height: '60px',
    },
    navItem: {
        color: 'black',
        flex: 1,
        textAlign: 'center',
    },
    heading: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    normalText: {
        fontWeight: 'normal',
    },
    content: {
        flex: 1,
        padding: '30px',
        textAlign: 'center',
        overflow: 'hidden',
    },
    title: {
        color: "rgb(38, 28, 95)",
        fontFamily: "verdana",
        textShadow: "1px 1px 2px gray",
        marginBottom: '20px',
    },
    // scrollableContainer: {
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     justifyContent: 'center',
    //     // overflow: 'auto',
    //     // height: 'calc(100vh - 150px)', // Adjust height based on header size
    //     marginLeft: "5%",
    // },
};

export default StudentPage1;








