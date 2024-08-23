const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    const appointmentHistory = document.getElementById('appointmentHistory');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    // Function to fetch and display appointment history
    const fetchAppointmentHistory = (user) => {
        const appointmentsRef = db.collection('appointments').where('studentID', '==', user.uid);

        appointmentsRef.get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                appointmentHistory.innerHTML = '<p>No appointments found.</p>';
                return;
            }

            const appointmentList = document.createElement('ul');

            querySnapshot.forEach((doc) => {
                const appointmentData = doc.data();

                // Fetch the teacher's name based on the teacherID
                db.collection('teachers').doc(appointmentData.teacherID).get()
                    .then((teacherDoc) => {
                        if (teacherDoc.exists) {
                            const teacherName = teacherDoc.data().fullName;

                            const listItem = document.createElement('li');
                            listItem.innerHTML = `
                                <strong>Teacher:</strong> ${teacherName}<br>
                                <span>Date: ${appointmentData.date}</span><br>
                                <span>Time: ${appointmentData.time}</span><br>
                                <span>Status: ${appointmentData.status}</span><br>
                                <span>Description: ${appointmentData.description}</span>
                            `;

                            appointmentList.appendChild(listItem);
                        } else {
                            console.error('Teacher not found for ID: ', appointmentData.teacherID);
                        }
                    }).catch((error) => {
                        console.error('Error fetching teacher name: ', error);
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
        window.location.href = 'studentlogin.html'; // Redirect to login page after logout
    }).catch((error) => {
        console.error('Error during logout:', error);
    });
});
