import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './App';

function Home() {
    const navigate = useNavigate();
    const { globalUsername } = useContext(GlobalContext);

    React.useEffect(() => {
        if (globalUsername.length === 3) {
            navigate('/faculty-page-1');
        } else if (globalUsername.length === 10) {
            navigate('/student-page-1');
        } else if (globalUsername.length === 5) {
            navigate('/hod');
        } else {
            navigate('/dept-admin');
        }
    }, [globalUsername, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '7vh', fontFamily: 'Arial, sans-serif' }}>
            <h1>Welcome, {globalUsername}</h1>
            <p>Redirecting based on role...</p>
        </div>
    );
}

export default Home;
