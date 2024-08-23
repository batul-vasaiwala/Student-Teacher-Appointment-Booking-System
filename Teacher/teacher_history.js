const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    const appointmentHistory = document.getElementById('appointmentHistory');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Function to fetch and display appointment history
    const fetchAppointmentHistory = (user) => {
        const appointmentsRef = db.collection('appointments').where('teacherID', '==', user.uid);

        appointmentsRef.get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                appointmentHistory.innerHTML = '<p>No appointments found.</p>';
                return;
            }

            const appointmentList = document.createElement('ul');

            querySnapshot.forEach((doc) => {
                const appointmentData = doc.data();
                const studentID = appointmentData.studentID;

                // Fetch the student name using the student ID
                db.collection('students').doc(studentID).get().then((studentDoc) => {
                    if (studentDoc.exists) {
                        const studentData = studentDoc.data();
                        const studentName = studentData.fullName;

                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <strong>Student:</strong> ${studentName}<br>
                            <span>Date: ${appointmentData.date}</span><br>
                            <span>Time: ${appointmentData.time}</span><br>
                            <span>Status: ${appointmentData.status}</span>
                            <span>Description: ${appointmentData.description}</span>
                        `;

                        appointmentList.appendChild(listItem);
                    } else {
                        console.error('No such student found!');
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <strong>Student:</strong> Unknown Student<br>
                            <span>Date: ${appointmentData.date}</span><br>
                            <span>Time: ${appointmentData.time}</span><br>
                            <span>Status: ${appointmentData.status}</span>
                            <span>Description: ${appointmentData.description}</span>
                        `;
                        appointmentList.appendChild(listItem);
                    }
                }).catch((error) => {
                    console.error('Error fetching student data: ', error);
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <strong>Student:</strong> Error fetching student<br>
                        <span>Date: ${appointmentData.date}</span><br>
                        <span>Time: ${appointmentData.time}</span><br>
                        <span>Status: ${appointmentData.status}</span>
                        <span>Description: ${appointmentData.description}</span>
                    `;
                    appointmentList.appendChild(listItem);
                });
            });

            appointmentHistory.appendChild(appointmentList);
        }).catch((error) => {
            console.error('Error fetching appointment history: ', error);
            appointmentHistory.innerHTML = '<p>Error fetching appointment history.</p>';
        });
    };

    // Function to clear the displayed appointment history (UI only)
    const clearDisplayedHistory = () => {
        appointmentHistory.innerHTML = '<p>Appointment history cleared.</p>';
    };

    // Check if the user is logged in and fetch their appointment history
    auth.onAuthStateChanged((user) => {
        if (user) {
            fetchAppointmentHistory(user);

            // Attach event listener to the clear history button
            clearHistoryBtn.addEventListener('click', clearDisplayedHistory);
        } else {
            appointmentHistory.innerHTML = '<p>Please log in to view your appointment history.</p>';
        }
    });
});
// Logout
document.getElementById('logout').addEventListener('click', function () {
    firebase.auth().signOut().then(() => {
        window.location.href = 'teacherlogin.html'; // Redirect to login page after logout
    }).catch((error) => {
        console.error('Error during logout:', error);
    });
});
