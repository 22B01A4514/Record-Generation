const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app = express();
const fs = require('fs');
const exp = require('constants');
const { Console } = require('console');
const { PDFDocument } = require('pdf-lib');
const axios = require('axios');

app.use(bodyParser.json());
app.use(cors());
// app.use(express.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Root@123',
    database: 'RecordManagement',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
});
const storage = multer.memoryStorage();  // Stores files in memory as buffers
const upload = multer({ storage: storage });  // 

app.post("/api", (req, res) => { 
    const { username, password } = req.body;

    // SQL Query to check login
    const query = "SELECT * FROM Login WHERE username = ?";
    
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        //  If password is stored as **plain text**:
        if (results[0].pword === password) {
            return res.json({ message: "Login successful" });
        }

        //  If passwords are **hashed**, use bcrypt:
        const match = await bcrypt.compare(password, results[0].pword);
        if (match) {
            return res.json({ message: "Login successful" });
        } else {
            return res.status(401).json({ message: "Invalid username or password" });
        }
    });
});

// -----------------------------------------------------------------------------------------------------------------------------------------

app.post('/upload', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        console.error('No file received');
        return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Received file:', req.file); // Debugging
    const { rno, subCode, expNo } = req.body; 
    const pdf_id = rno;  // Use actual filename
    const pdfData = req.file.buffer;  // Get file buffer

    const query = 'INSERT INTO pdf_files (rno, subCode, expNo, pdf_id, pdf_data) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [rno, subCode, expNo, pdf_id, pdfData], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'PDF uploaded successfully'});
    });
});
app.get('/pdf/:rno/:subID/:expNo', (req, res) => {
    const { rno, subID, expNo } = req.params;  

    console.log("Fetching PDF for:", { rno, subID, expNo });

    const query = 'SELECT pdf_data FROM pdf_files WHERE rno = ? AND subCode = ? AND expNo = ?';
    
    db.query(query, [rno, subID, expNo], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error retrieving PDF');
        }

        console.log("Database results:", results);

        if (results.length === 0) {
            console.log("PDF not found for:", { rno, subID, expNo });
            return res.status(404).send('PDF not found');
        }

        const pdfBuffer = results[0].pdf_data;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${expNo}_${rno}_${subID}.pdf"`);
        res.send(pdfBuffer);
    });
});


app.delete('/api/delete', (req, res) => {
    const { rno, subCode, expNo, pdf_id } = req.body; // Receive all necessary parameters in the request body

    const sql = 'DELETE FROM pdf_files WHERE rno = ? AND subCode = ? AND expNo = ? AND pdf_id = ?';
    db.query(sql, [rno, subCode, expNo, pdf_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error deleting data from the database.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'File not found.' });
        }
        res.status(200).json({ message: 'File deleted successfully.' });
    });
});

app.get("/api/StudentsProgress/:subCode/:expNo/:emp_id/:branch/:section/:year", (req, res) => {
    const { subCode, expNo, emp_id, branch, section, year } = req.params;

    const sql = `
        SELECT s.rno, s.name, p.subCode, p.expNo, p.marks, p.feedback
        FROM Student AS s
        JOIN Assign AS a ON a.branch = s.branch AND a.section = s.section AND a.year = s.year
        JOIN pdf_files AS p ON s.rno = p.rno AND a.lab_id = p.subCode
        WHERE p.subCode = ? AND p.expNo = ? AND a.emp_id = ? AND a.branch = ? 
        AND a.section = ? AND a.year = ?;
    `;

    db.query(sql, [subCode, expNo, emp_id, branch, section, year], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error fetching data from the database." });
        }
        res.status(200).json(results);
    });
});

// Save marks and feedback
app.post('/api/savemarks/:rno/:subCode/:expNo/:marks/:feedback', (req, res) => {
    const { rno, subCode, expNo, marks, feedback } = req.params;

    const sql = `
    UPDATE pdf_files 
    SET marks = ?, feedback = ?
    WHERE rno = ? AND subCode = ? AND expNo = ?;
    `;

    db.query(sql, [marks, feedback, rno, subCode, expNo], (err, results) => {
        if (err) {
            console.error('Error updating marks:', err);
            return res.status(500).json({ message: 'Error updating marks.' });
        }
        res.status(200).json({ message: 'Marks updated successfully.' });
    });
});






// app.post('/api/Exp/:subID', (req, res) => {
//     const { number, topic, description } = req.body;
//     const { subID } = req.params;  // Extract subID correctly

//     if (!subID || !number || !topic || !description) {
//         return res.status(400).json({ message: 'All fields are required.' });
//     }

//     const sql = 'INSERT INTO Experiment (subCode, number, topic, description) VALUES (?, ?, ?, ?)';
//     db.query(sql, [subID, number, topic, description], (err, result) => { // Include subID in query
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ message: 'Error inserting data into the database.' });
//         }
//         res.status(201).json({
//             experimentId: result.insertId,
//             message: 'Experiment added successfully.',
//         });
//     });
// });


app.put('/api/Exp/:number', (req, res) => {
    const { number } = req.params;
    const { topic, description } = req.body;

    const sql = 'UPDATE Experiment SET topic = ?, description = ? WHERE number = ?';
    db.query(sql, [topic, description, number], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error updating data in the database.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Experiment not found.' });
        }
        res.status(200).json({ message: 'Experiment updated successfully.' });
    });
});

app.delete('/api/Exp/:number', (req, res) => {
    const { number } = req.params;

    const sql = 'DELETE FROM Experiment WHERE number = ?';
    db.query(sql, [number], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error deleting data from the database.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Experiment not found.' });
        }
        res.status(200).json({ message: 'Experiment deleted successfully.' });
    });
});

app.get('/api/Experiments/:subID', (req, res) => {
    const { subID } = req.params;  
    
    const sql = 'SELECT * FROM Experiment WHERE subCode = ? ORDER BY number ASC';

    db.query(sql, [subID], (err, results) => { 
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error fetching data from the database.' });
        }
        res.status(200).json(results);
    });

    console.log(res);
});

app.get('/api/mergepdfs/:username/:subID', async (req, res) => {
    const { username, subID } = req.params;
    try {
        // Fetch PDF binary data from the database
        const response = await axios.get(`http://localhost:3001/api/pdfdata/${username}/${subID}`);
        const pdfRecords = response.data;
        console.log(pdfRecords.length)
        if (!pdfRecords || pdfRecords.length === 0) {
            return res.status(404).json({ error: "No PDFs found" });
        }

        // Create a new merged PDF
        const mergedPdf = await PDFDocument.create();

        for (const record of pdfRecords) {
            const pdfBytes = Buffer.from(record.pdf_data, 'binary'); // Convert to binary
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="merged_record.pdf"');
        res.send(Buffer.from(mergedPdfBytes)); // Send merged PDF as a download
    } catch (error) {
        console.error("Error merging PDFs:", error);
        res.status(500).json({ error: "Failed to merge PDFs" });
    }
});

app.get('/api/pdfdata/:rno/:subCode', (req, res) => {
    const {rno, subCode} = req.params;
    const sql = 'SELECT pdf_data FROM pdf_files WHERE rno = ? AND  subCode = ? ORDER BY expNo';
    db.query(sql, [rno, subCode], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error fetching data from the database.' });
        }
        res.status(200).json(results);
    });
    console.log(res);
});

app.get('/api/results/:rno/:subCode/:expNo', (req, res) => {
    const { rno, subCode, expNo } = req.params;  
    
    const sql = 'SELECT marks, feedback FROM pdf_files WHERE rno = ? and subCode = ? and expNo = ?';

    db.query(sql, [rno, subCode, expNo], (err, results) => { 
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error fetching data from the database.' });
        }
        res.status(200).json(results);
    });
    
    console.log(res);
});



app.post('/api/Faculty', (req, res) => {
    const { faculty, facultyID, desg, dept } = req.body;

    // Validate request body
    if (!faculty || !facultyID || !desg || !dept) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // SQL query to insert the data
    const sql = 'INSERT INTO Faculty (emp_id, name, desg, dept) VALUES (?, ?, ?, ?)';
    db.query(sql, [facultyID, faculty, desg, dept], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error inserting faculty data into the database.' });
        }

        // Return success response
        res.status(201).json({
            facultyId: result.insertId,
            message: 'Faculty added successfully.',
        });
    });
});

// ----- Lab Insertion -----
app.post('/api/Lab', (req, res) => {
    const { labId, labName } = req.body;

    // Validate request body
    if (!labId || !labName) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // SQL query to insert the data
    const sql = 'INSERT INTO Lab (lab_id, lab_name) VALUES (?, ?)';
    db.query(sql, [labId, labName], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error inserting lab data into the database.' });
        }

        // Return success response
        res.status(201).json({
            labId: result.insertId,
            message: 'Lab added successfully.',
        });
    });
});


app.post('/api/Assign', (req, res) => {
    const { emp_id, lab_id, branch, section, year } = req.body;

    // Validate request body
    if (!emp_id || !lab_id || !branch || !section || !year) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // SQL query to insert the data
    const sql = 'INSERT INTO Assign (emp_id, lab_id, branch, section, year) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [emp_id, lab_id, branch, section, year], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error inserting lab data into the database.' });
        }

        // Return success response
        res.status(201).json({
            emp_id: result.insertId,
            message: 'Assigned successfully.',
        });
    });
});

app.get('/api/Faculty', (req, res) => {
    const sql = 'SELECT * FROM Faculty'; 
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error fetching data from the database.' });
        }
        res.status(200).json(results);
    });
});

app.get('/api/Lab', (req, res) => {
    const sql = 'SELECT * FROM Lab'; 
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error fetching data from the database.' });
        }
        res.status(200).json(results);
    });
});


app.get("/api/faculty-assignments/:emp_id", (req, res) => {
    const emp_id = req.params.emp_id;
    const query = 'SELECT Assign.branch, Assign.section, Assign.year, Lab.lab_name, Assign.lab_id FROM Assign JOIN Lab ON Assign.lab_id = Lab.lab_id WHERE emp_id = ?';
    
    db.query(query, [emp_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query error" });
        }
        res.status(200).json(results);
        console.log(results);
    });
});


app.post("/api/change-password", (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    const checkQuery = `SELECT pword FROM Login WHERE username = ?`;
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        console.log(results);
        if (results.length === 0 || results[0].pword !== currentPassword) {
            return res.status(400).json({ error: `Incorrect current password ${results[0].pword}`  });
        }

        const updateQuery = `UPDATE Login SET pword = ? WHERE username = ?`;
        db.query(updateQuery, [newPassword, username], (updateErr) => {
            if (updateErr) {
                console.error("Password update error:", updateErr);
                return res.status(500).json({ error: "Failed to update password" });
            }
            return res.status(200).json({ message: "Password changed successfully" });
        });
    });
});
app.get("/api/fetch-student-data/:rno", (req, res) => {
    const username = req.params.rno;
    console.log("Received request for student:", username);

    const query = `
        SELECT pword, name, branch, section, year, phno 
        FROM Student 
        JOIN Login ON Student.rno = Login.username 
        WHERE Student.rno = ?`;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            console.log("No student found for:", username);
            return res.status(404).json({ error: "Student not found" });
        }

        console.log("Student data found:", results[0]);
        return res.status(200).json(results[0]);  // Send first record only
    });
});

app.get("/api/fetch-faculty-data/:rno", (req, res) => {
    const username = req.params.rno;
    console.log("Received request for faculty:", username);

    const query = `
        SELECT pword, name, desg, dept 
        FROM Faculty 
        JOIN Login ON Faculty.emp_id = Login.username 
        WHERE Faculty.emp_id = ?`;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            console.log("No faculty found for:", username);
            return res.status(404).json({ error: "Faculty not found" });
        }

        console.log("Faculty data found:", results[0]);
        return res.status(200).json(results[0]);  // Send first record only
    });
});
app.get('/api/total-experiments/:lab_id', (req, res) => {
    const { lab_id } = req.params;
    console.log(lab_id);

    const query = `SELECT COUNT(*) AS total_experiments FROM Experiment WHERE subCode = ?`;
    db.query(query, [lab_id], (err, results) => {
        if (err) {
            console.error("Error fetching experiment count:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ total_experiments: results[0].total_experiments });
    });
});
app.get('/api/total-students/:branch/:section/:year', (req, res) => {
    const { branch, section, year } = req.params;
    const query = `SELECT COUNT(*) AS totalStudents FROM Student WHERE branch = ? and section = ? and year = ?`;
    
    db.query(query, [branch, section, year], (err, results) => {
        if (err) {
            console.error("Error fetching total students:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ totalStudents: results[0].totalStudents });
    });
});




app.get("/api/getNotSubmittedStudents/:branch/:section/:year/:subCode/:expNo", (req, res) => {
    const { branch, section, year, subCode, expNo } = req.params;

    const query = `
        SELECT rno FROM Student 
        WHERE branch = ? AND section = ? AND year = ? 
        AND NOT EXISTS (
            SELECT rno FROM pdf_files 
            WHERE pdf_files.rno = Student.rno 
            AND pdf_files.subCode = ? 
            AND pdf_files.expNo = ?
        )
    `;

    db.query(query, [branch, section, year, subCode, expNo], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Database query error" });
        }

        res.status(200).json(results.map(row => row.rno)); // Return roll numbers as an array
    });
});




app.get("/api/student-subjects/:rno", (req, res) => {
    const rno = req.params.rno;
    const query = `SELECT Assign.branch, Assign.section, Assign.year, Lab.lab_name, Assign.lab_id, Student.rno
FROM Assign
JOIN Lab ON Lab.lab_id = Assign.lab_id
JOIN Student ON Student.branch = Assign.branch 
            AND Student.section = Assign.section 
            AND Student.year = Assign.year
WHERE Student.rno = ?;
`
    db.query(query, [rno], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query error" });
        }
        res.status(200).json(results);
        console.log(results);
    });
});



app.get('/api/total-experiments-submitted/:username/:lab_id', (req, res) => {
    const { username, lab_id } = req.params;
    console.log("Fetching submitted experiments for:", username, lab_id);

    const query = `SELECT COUNT(*) AS total_submitted_experiments FROM pdf_files WHERE rno = ? AND subCode = ?`;
    db.query(query, [username, lab_id], (err, results) => {
        if (err) {
            console.error("Error fetching submitted experiment count:", err);
            return res.status(500).json({ error: "Database error" });
        }
        console.log("Query Results:", results);
        res.json({ total_submitted_experiments: results[0]?.total_submitted_experiments || 0 });
    });
});


app.get('/api/pdf_available/:username/:subCode/:expname', (req, res) => {
    const { username, subCode, expname } = req.params;

    const pdfRecord = 'SELECT COUNT(*) AS count FROM pdf_files WHERE rno = ? AND subCode = ? AND expNo = ?';

    db.query(pdfRecord, [username, subCode, expname], (err, results) => {
        if (err) {
            console.error('Error checking PDF availability:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log("Query Results:", results); // Debugging log

        res.json({ available: results[0].count > 0 });
    });
});

// app.get('/api/no-of-experiments/:subCode', async (req, res) => {
//     const subCode = req.params.subCode;
//     console.log("Received request for lab_id:", subCode); // Debugging log

//     try {
//         const [result] = await db.query(`SELECT COUNT(*) as count FROM experiments WHERE lab_id = ?`, [subCode]);

//         if (result.length === 0) {
//             return res.status(404).json({ error: "No data found for this lab_id" });
//         }

//         res.json(result);
//     } catch (error) {
//         console.error("Database query failed:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

app.post('/api/Exp/:subID', (req, res) => {
    const { number, topic, description, selectedLinks } = req.body;
    const { subID } = req.params;

    if (!subID || !number || !topic || !description) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const sqlExp = 'INSERT INTO Experiment (subCode, number, topic, description) VALUES (?, ?, ?, ?)';
    db.query(sqlExp, [subID, number, topic, description], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error inserting experiment.' });
        }

        const experimentId = result.insertId;

        // Insert selected links into Websites table
        if (selectedLinks && selectedLinks.length > 0) {
            const sqlWebsites = 'INSERT INTO Websites (subCode, expNo, url) VALUES ?';
            const values = selectedLinks.map(link => [subID, number, link]);

            db.query(sqlWebsites, [values], (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Error inserting websites.' });
                }
                res.status(201).json({ experimentId, message: 'Experiment and websites added successfully.' });
            });
        } else {
            res.status(201).json({ experimentId, message: 'Experiment added successfully (No websites selected).' });
        }
    });
});



app.get('/api/links/:subCode/:expNo', (req, res) => {
    const { subCode, expNo } = req.params;
    const sql = 'SELECT url FROM Websites WHERE subCode = ? AND expNo = ?';

    db.query(sql, [subCode, expNo], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error fetching links' });
        }

        if (results.length === 0) {
            console.log(`No links found for subCode: ${subCode}, expNo: ${expNo}`);
            return res.status(404).json({ message: 'No links found' });
        }

        res.json({ links: results.map(row => row.url) });
    });
});


// Start the server
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});