const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    const appointmentsList = document.getElementById('appointmentsList');

    // Function to fetch and display pending appointments
    const fetchPendingAppointments = (user) => {
        const appointmentsRef = db.collection('appointments')
            .where('teacherID', '==', user.uid)
            .where('status', '==', 'pending');

        appointmentsRef.get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                appointmentsList.innerHTML = '<p>No pending appointments.</p>';
                return;
            }

            const appointmentList = document.createElement('ul');

            querySnapshot.forEach((doc) => {
                const appointmentData = doc.data();
                const studentID = appointmentData.studentID; // Assuming studentID is stored in the appointment

                // Fetch the student name using the student ID
                db.collection('students').doc(studentID).get().then((studentDoc) => {
                    if (studentDoc.exists) {
                        const studentData = studentDoc.data();
                        const studentName = studentData.fullName; // Adjust field name as per your database

                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <strong>Student Name:</strong> ${studentName}<br>
                            <span>Date: ${appointmentData.date}</span><br>
                            <span>Time: ${appointmentData.time}</span><br>
                            <span>Description : ${appointmentData.description}</span><br>
                            <button onclick="approveAppointment('${doc.id}')">Approve</button>
                            <button onclick="rejectAppointment('${doc.id}')">Reject</button>
                        `;

                        appointmentList.appendChild(listItem);
                    } else {
                        console.error('No such student found!');
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <strong>Student Name:</strong> Unknown Student<br>
                            <span>Date: ${appointmentData.date}</span><br>
                            <span>Time: ${appointmentData.time}</span><br>
                            <button onclick="approveAppointment('${doc.id}')">Approve</button>
                            <button onclick="rejectAppointment('${doc.id}')">Reject</button>
                        `;
                        appointmentList.appendChild(listItem);
                    }
                }).catch((error) => {
                    console.error('Error fetching student data: ', error);
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <strong>Student Name:</strong> Error fetching student<br>
                        <span>Date: ${appointmentData.date}</span><br>
                        <span>Time: ${appointmentData.time}</span><br>
                        <button class="approveBtn" data-id="${doc.id}">Approve</button>
                    <button class="rejectBtn" data-id="${doc.id}">Reject</button>
                   
                    `;
                    appointmentList.appendChild(listItem);
                });
            });

            appointmentsList.appendChild(appointmentList);
        }).catch((error) => {
            console.error('Error fetching pending appointments: ', error);
            appointmentsList.innerHTML = '<p>Error fetching pending appointments.</p>';
        });
    };

    // Approve an appointment
    window.approveAppointment = (appointmentId) => {
        db.collection('appointments').doc(appointmentId).update({
            status: 'approved'
        }).then(() => {
            alert('Appointment approved!');
            location.reload();
        }).catch((error) => {
            console.error('Error approving appointment: ', error);
            alert('Error approving appointment.');
        });
    };

    // Reject an appointment
    window.rejectAppointment = (appointmentId) => {
        db.collection('appointments').doc(appointmentId).update({
            status: 'rejected'
        }).then(() => {
            alert('Appointment rejected!');
            location.reload();
        }).catch((error) => {
            console.error('Error rejecting appointment: ', error);
            alert('Error rejecting appointment.');
        });
    };
    

    // Check if the teacher is logged in and fetch their pending appointments
    auth.onAuthStateChanged((user) => {
        if (user) {
            fetchPendingAppointments(user);
        } else {
            appointmentsList.innerHTML = '<p>Please log in to view pending appointments.</p>';
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

