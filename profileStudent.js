import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import axios from 'axios';

function ProfileStudent() {
    const { username } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [eyeIcon, setEyeIcon] = useState(true);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
// console.log(username);
useEffect(() => {
    const fetchStudentProgress = async () => {
        try {
            console.log("Fetching data for:", username);
            const response = await fetch(`http://localhost:3001/api/fetch-student-data/${username}`);
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch student data");
            }
    
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error("Error fetching student progress:", error.message);
        }
    };
    

        fetchStudentProgress();
    }, [username]);
console.log(data);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setEyeIcon(!eyeIcon);
    };
    const styles = {
        profileContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'rgba(151, 143, 143, 0.2)',
        },
        profileCard: {
            width: '400px',
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'all 0.3s ease-in-out',
            margin: "10px",
        },
        profileCardHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
        },
        profileTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333',
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#666',
            marginBottom: '15px',
        },
        infoSection: {
            textAlign: 'left',
            marginBottom: '12px',
        },
        infoLabel: {
            display: 'block',
            fontSize: '14px',
            color: '#444',
            marginBottom: '5px',
        },
        infoBox: {
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            background: '#fafafa',
            fontSize: '14px',
            color: '#222',
        },
        passwordBox: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
        },
        eyeButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
        },
        eyeIcon: {
            width: '18px',
            height: 'auto',
        },
    };

    return (
        <div style={styles.profileContainer}>
            <div
                style={{ ...styles.profileCard, ':hover': styles.profileCardHover }}
            >
                <h1 style={styles.profileTitle}>Profile</h1>
                {/* <p style={styles.sectionTitle}>Your Details</p> */}

                <div style={styles.infoSection}>
                    <strong style={styles.infoLabel}>College ID</strong>
                    <p style={styles.infoBox}>{username}</p>
                </div>

                <div style={styles.infoSection}>
                    <strong style={styles.infoLabel}>Password</strong>
                    <p style={{ ...styles.infoBox, ...styles.passwordBox }}>
                        {showPassword ? data?.pword : '••••••••'}
                        <button style={styles.eyeButton} onClick={togglePasswordVisibility}>
    <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} style={styles.eyeIcon}></i>
</button>

                    </p>
                </div>

                <div style={styles.infoSection}>
                    <strong style={styles.infoLabel}>Name</strong>
                    <p style={styles.infoBox}>{data?.name}</p>
                </div>

                <div style={styles.infoSection}>
                    <strong style={styles.infoLabel}>Email Address</strong>
                    <p style={styles.infoBox}>{`${username}@svecw.edu.in`}</p>
                </div>

                <div style={styles.infoSection}>
                    <strong style={styles.infoLabel}>Branch</strong>
                    <p style={styles.infoBox}>{data?.branch}</p>
                </div>

                <div style={styles.infoSection}>
                    <strong style={styles.infoLabel}>Section</strong>
                    <p style={styles.infoBox}>{data?.section}</p>
                </div>

                <div style={styles.infoSection}>
                    <strong style={styles.infoLabel}>Year</strong>
                    <p style={styles.infoBox}>{data?.year}</p>
                </div>

                <div style={styles.infoSection}>
                    <strong style={styles.infoLabel}>Phone Number</strong>
                    <p style={styles.infoBox}>{data?.phno}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileStudent;