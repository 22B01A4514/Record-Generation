import React, { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './App';  // Import GlobalContext
import { AuthContext } from './AuthContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Login() {
    const { setGlobalUsername } = useContext(GlobalContext);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [loginMessage, setLoginMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        const username = usernameRef.current.value.trim();
        const password = passwordRef.current.value.trim();

        if (!username || !password) {
            toast.error('Username and password are required.');
            return;
        }

        setLoading(true);
        setLoginMessage('');
        
        try {
            const response = await fetch('http://localhost:3001/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.message === 'Login successful') {

                login({ username });
                toast.success('Login successful! Redirecting...');
                setGlobalUsername(username);
                setTimeout(() => navigate('/home'), 1000);
            } else {
                toast.error(data.message || 'Invalid credentials. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "10px", width: "99%", height: "580px", backgroundColor:"rgba(236, 236, 236, 0)" }}>
    {/* Left Section (Image) - 30% */}
    <div style={{ flex: "3", display: "flex", justifyContent: "center", padding:"5%", marginLeft:"8%"}}>
        {/* <img 
            width="550" 
            height="550" 
            src="modified.jpg"            
            alt="Student studying"
        /> */}
        <img height = "400" width = "400" style={{borderRadius : "20px", marginLeft:'20%'}}src="gif.gif" alt="Animated GIF"></img>

    </div>

    {/* Right Section (Login Form) - 70% */}
    <div style={{ flex: "7" }}>
        <div style={styles.container}>
            <h1 style={styles.title}>Login</h1>
            <div style={styles.inputContainer}>
                <label style={styles.label}>Username</label>
                <input style={styles.input} type="text" placeholder="Enter Username" ref={usernameRef} />
            </div>
            <div style={styles.inputContainer}>
                <br></br>
                <label style={styles.label}>Password</label>
                <input style={styles.input} type="password" placeholder="Enter Password" ref={passwordRef} />
            </div>
            <br></br>
            <button style={styles.button} onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    </div>
</div>

    );
}

const styles = {
    container: {
        margin: 'auto',
        marginTop: '-5%',
        marginLeft:'8%',
        borderRadius: 10,
        backgroundColor: 'rgba(226, 176, 89, 0)',
        border: '0.2px solid white',//#ccc',
        width: 400,
        padding: 30,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 2px 10px rgba(255, 253, 253, 0.1)'
    },
    title: {
        color: '#2E236C',
        textAlign: 'center',
        marginBottom: 10
    },
    subtitle: {
        textAlign: 'center',
        color: '#555',
        marginBottom: 20
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 15
    },
    label: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    input: {
        fontSize: 17,
        padding: 10,
        border: '1px solid #aaa',
        borderRadius: 5,
        outline: 'none'
    },
    button: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(21, 75, 251, 0.95)',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        cursor: 'pointer',
        border: 'none',
        marginTop: 10,
        transition: 'background 0.3s',
    },
    message: {
        textAlign: 'center',
        marginTop: 10,
        color: 'red'
    }
};

export default Login;
