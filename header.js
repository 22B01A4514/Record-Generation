import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function Header({ globalUsername }) {
    const username = globalUsername;
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    
    console.log("User in Header:", username);  // Debug user state
    const handleLinkClickStudent = () => {
        navigate(`/profile-student/${username}`);
    };
    const handleLinkClickFaculty = () => {
      navigate(`/profile-faculty/${username}`);
  };
    const handleBack = () => {
        if (location.pathname !== "/") {
            navigate(-1);
        }
    };

    const handleLogout = () => {
        logout();
    };
    const disabledPaths = ["/", "/student-page-1", "/faculty-page-1", "/dept-admin"];

    const handlePassword = () => {
      navigate(`/change-password/${username}`);
    }
    return (
        <header style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor:"white",boxShadow: "0px 10px 10px -5px rgba(0, 0, 0, 0.3)"       }}>
            {user ? (
                <button
                    onClick={handleBack}
                    disabled={disabledPaths.includes(location.pathname)}
                    style={{
                        padding: "1.1%",
                        cursor: disabledPaths.includes(location.pathname) ? "not-allowed" : "pointer",
                        height: "10%",
                        marginTop: "15px",
                        borderRadius: "10px",
                        border: "1px solid white",
                        backgroundColor: disabledPaths.includes(location.pathname) ? "gray" : "rgba(243, 35, 35, 0.58)",
                        color: "white",
                        opacity: disabledPaths.includes(location.pathname) ? 0 : 1,
                    }}
                >
                    <i className="fa-solid fa-arrow-left"></i> Back
                </button>
            ) : (
                <p></p>
            )}
            
            <div style={{display:"flex", flexFlow:"row-wrap", gap:"15px"}}><img src="vishnu.png" width = "50px" height="50px" style={{marginTop:"10px"}} ></img>
            <h1>Lab Record Management System</h1></div>
            
            {user ? (  // Only show if user is NOT null
                   <div
                   className="dropdown"
                   style={styles.dropdown}
                   onMouseEnter={(e) =>
                     e.currentTarget.querySelector(".dropdown-content").style.display = "block"
                   }
                   onMouseLeave={(e) =>
                     e.currentTarget.querySelector(".dropdown-content").style.display = "none"
                   }
                 >
                   <button className="dropbtn" style={styles.dropbtn}>
                     <p style={{ color: "black", margin: 0 }}>
                       <img src="user.jpeg" alt="User" style={styles.userImage} />
                     </p>
                   </button>
                   <div className="dropdown-content" style={styles.dropdownContent}>
  {username.length === 10 ? (
    <button onClick={handleLinkClickStudent} className="dropdown-link" style={styles.dropdownLink}>
     <i class="fa-regular fa-user"></i> Profile
    </button>
  ) : username.length === 3 ? (
    <button onClick={handleLinkClickFaculty} className="dropdown-link" style={styles.dropdownLink}>
      <i className="fa-regular fa-user"></i> Profile
    </button>
  ) : null}

  <button onClick={handlePassword} className="dropdown-link" style={styles.dropdownLink}>
  <i className="fa-solid fa-lock"></i>  Change Password
  </button>
  <button onClick={handleLogout} className="dropdown-link" style={styles.dropdownLink1}>
  <i className="fa-solid fa-right-from-bracket"></i> Logout
  </button>
</div>

                 </div>
            ) : (
                <p style={{opacity:0}}> No profile</p>            )}
        </header>
    );
};

const styles = {
    dropbtn: {
      backgroundColor: "white",
      color: "white",
      padding: "16px",
      fontSize: "16px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      
    },
    dropdown: {
      position: "relative",
      display: "inline-block",
      
    },
    dropdownContent: {
        display: "none",
        position: "absolute",
        backgroundColor: "white",
        minWidth: "160px",
        boxShadow: "0px 8px 16px 0px rgba(159, 156, 201, 0.2)",
        zIndex: 1,
        left: "-100px", // Adjusted position slightly to the left
        marginTop: "5px",
        // border: "2px solid black",
      // borderRadius:"25px",
    },
    dropdownContentShow: {
      display: "block",
    },
    dropdownLink: {
      color: "black",
      padding: "12px 16px",
      textDecoration: "none",
      display: "block",
      fontWeight : "bold",
      backgroundColor : "white",
      border : "None",
    },
    dropdownLink1: {
      color: "red",
      padding: "12px 16px",
      textDecoration: "none",
      display: "block",
      fontWeight : "bold",
      backgroundColor : "white",
      border : "None",
    },
    dropdownLinkHover: {
      backgroundColor: "white",
    },
    dropbtnHover: {
      backgroundColor: "white",
    },
    userImage: {
      width: "40px",
      borderRadius: "50%",
    },
  };

export default Header;
