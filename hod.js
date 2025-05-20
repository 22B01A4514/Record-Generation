import React, { useState, useEffect } from 'react';

function HODReportsPage() {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [reports, setReports] = useState([]);
    const [isRefreshed, setIsRefreshed] = useState(false);

    // Mock Data (Replace with API call)
    const mockData = [
        { id: 1, RegisterNumber: '22B01A4514', name: 'AAAAAAA', labs: { MachineLearning: 8, BigDataAnalytics: 9, SoftwareEngineering: 8 }, department: 'AI&DS', section: 'A' },
        { id: 1, RegisterNumber: '22B01A4518', name: 'BBBBBBB', labs: { MachineLearning: 10, BigDataAnalytics: 9, SoftwareEngineering: 8 }, department: 'AI&DS', section: 'A' },
        { id: 1, RegisterNumber: '22B01A4541', name: 'AAAAAAA', labs: { MachineLearning: 9, BigDataAnalytics: 9, SoftwareEngineering: 8 }, department: 'AI&DS', section: 'A' },
        { id: 1, RegisterNumber: '22B01A4514', name: 'AAAAAAA', labs: { MachineLearning: 85, BigDataAnalytics: 90, SoftwareEngineering: 80 }, department: 'AI&DS', section: 'B' },
        { id: 1, RegisterNumber: '22B01A4514', name: 'AAAAAAA', labs: { MachineLearning: 85, BigDataAnalytics: 90, SoftwareEngineering: 80 }, department: 'AI&DS', section: 'B' },
        { id: 1, RegisterNumber: '22B01A4514', name: 'AAAAAAA', labs: { MachineLearning: 85, BigDataAnalytics: 90, SoftwareEngineering: 80 }, department: 'AI&ML', section: 'A' },
        { id: 1, RegisterNumber: '22B01A4514', name: 'AAAAAAA', labs: { MachineLearning: 85, BigDataAnalytics: 90, SoftwareEngineering: 80 }, department: 'AI&ML', section: 'A' },
        { id: 1, RegisterNumber: '22B01A4514', name: 'AAAAAAA', labs: { MachineLearning: 85, BigDataAnalytics: 90, SoftwareEngineering: 80 }, department: 'AI&ML', section: 'A' },
        { id: 1, RegisterNumber: '22B01A4514', name: 'AAAAAAA', labs: { MachineLearning: 85, BigDataAnalytics: 90, SoftwareEngineering: 80 }, department: 'AI&ML', section: 'B' },
        { id: 1, RegisterNumber: '22B01A4514', name: 'AAAAAAA', labs: { MachineLearning: 85, BigDataAnalytics: 90, SoftwareEngineering: 80 }, department: 'AI&ML', section: 'B' },

    ];

    useEffect(() => {
        if (isRefreshed) {
            // Filter data based on selected department and section
            const filteredData = mockData.filter(
                (report) =>
                    report.department === selectedDepartment && report.section === selectedSection
            );
            setReports(filteredData);
            setIsRefreshed(false); // Reset the refresh state
        }
    }, [isRefreshed, selectedDepartment, selectedSection]);

    const handleRefresh = () => {
        if (selectedDepartment && selectedSection) {
            setIsRefreshed(true);
        } else {
            alert('Please select both Department and Section before refreshing.');
        }
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Class Wise Reports</h1>

            {/* Filters */}
            <div style={styles.filters}>
                <div>
                    <label htmlFor="department">Department: </label>
                    <select
                        id="department"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="">Select Department</option>
                        <option value="AI&DS">AI&DS</option>
                        <option value="AI&ML">AI&ML</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="section">Section: </label>
                    <select
                        id="section"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                    >
                        <option value="">Select Section</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="section">Year: </label>
                    <select
                        id="section"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                    >
                        <option value="">Select Section</option>
                        <option value="A">I</option>
                        <option value="B">II</option>
                        <option value="B">III</option>
                        <option value="B">IV</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="section">Semester: </label>
                    <select
                        id="section"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                    >
                        <option value="">Select Section</option>
                        <option value="A">I</option>
                        <option value="B">II</option>
                    </select>
                </div>
                <button onClick={handleRefresh} style={styles.refreshButton}>
                    Submit
                </button>
            </div>

            {/* Reports Table */}
            <div style={styles.tableContainer}>
    {reports.length > 0 ? (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>RegisterNumber</th>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Machine Learning</th>
                    <th style={styles.th}>Big Data Analytics</th>
                    <th style={styles.th}>Software Engineering</th>
                </tr>
            </thead>
            <tbody>
                {reports.map((report) => (
                    <tr key={report.id}>
                        <td style={styles.td}>{report.RegisterNumber}</td>
                        <td style={styles.td}>{report.name}</td>
                        <td style={styles.td}>{report.labs.MachineLearning}</td>
                        <td style={styles.td}>{report.labs.BigDataAnalytics}</td>
                        <td style={styles.td}>{report.labs.SoftwareEngineering}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <p>No reports available for the selected department and section.</p>
    )}
</div>

        </div>
    );
}

const styles = {
    page: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
    },
    title: {
        color: '#134B70',
        fontSize: '24px',
        marginBottom: '20px',
    },
    filters: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        alignItems: 'center',
    },
    refreshButton: {
        padding: '10px 20px',
        backgroundColor: '#134B70',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
    },
    tableContainer: {
        marginTop: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        border: '1px solid #ddd',
        padding: '8px',
        backgroundColor: '#f4f4f4',
    },
    td: {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'center',
    },
};

export default HODReportsPage;
