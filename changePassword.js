import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
    const { username } = useParams();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    console.log("User name in password:", username);
    
    // const togglePasswordVisibility = () => {
    //     setShowPassword(!showPassword);
    // };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword === currentPassword) {
            toast.error("New password is the same as the current password. Please enter a different password.");
            return;
        }

        if (!newPassword.trim() || !confirmPassword.trim()) {
            toast.error("Password fields cannot be empty.");
            return;
        }
        
        
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }
        
        // Ensure password strength
        // if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        //     toast.error("Password must be at least 8 characters long, include an uppercase letter and a number.");
        //     return;
        // }
        

        try {
            const response = await fetch("http://localhost:3001/api/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Password changed successfully!");
            } else {
                toast.error(data.error || "Failed to change password.");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("An error occurred. Please try again.");
        }
    };
    const styles = {
        container: {
            margin: "auto",
            width: "400px",
            padding: "25px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            marginTop: "100px",
            background: "#fff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
        input: {
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px",
        },
        button: {
            backgroundColor: "#3498db",
            color: "white",
            display: "block",
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
        },
        passwordBox: {
            position: "relative",
            display: "flex",
            alignItems: "center",
        },
        eyeButton: {
            position: "absolute",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: "#666",
        },
    };

    return (
        <div style={styles.container}>
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
                <label>Current Password:</label>
                <div style={styles.passwordBox}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="button" style={styles.eyeButton} onClick={togglePasswordVisibility}>
                        <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                    </button>
                </div>

                <label>New Password:</label>
                <div style={styles.passwordBox}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="button" style={styles.eyeButton} onClick={togglePasswordVisibility}>
                        <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                    </button>
                </div>

                <label>Confirm New Password:</label>
                <div style={styles.passwordBox}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="button" style={styles.eyeButton} onClick={togglePasswordVisibility}>
                        <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                    </button>
                </div>

                <button type="submit" style={styles.button}>Change Password</button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ChangePassword;