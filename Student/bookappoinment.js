// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function () {
    const appointmentForm = document.getElementById('appointmentForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const teacherSelect = document.getElementById('teacher');

    // Populate teachers dropdown from Firestore
    db.collection('teachers').get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.log('No teachers found.');
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const teacherData = doc.data();
            const option = document.createElement('option');

            option.value = doc.id;
            option.textContent = `${teacherData.fullName} - ${teacherData.department} (${teacherData.email})`;

            teacherSelect.appendChild(option);
        });
    }).catch((error) => {
        console.error('Error fetching teachers: ', error);
    });

    // Handle appointment form submission
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const teacher = appointmentForm.teacher.value;
        const date = appointmentForm.date.value;
        const time = appointmentForm.time.value;
        const description = appointmentForm.description.value; // New description field
        const user = auth.currentUser;

        if (user) {
            // Check if the appointment slot is already booked
            db.collection('appointments')
                .where('teacherID', '==', teacher)
                .where('date', '==', date)
                .where('time', '==', time)
                .get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        // Slot already booked
                        confirmationMessage.textContent = 'The selected time slot is already booked. Please choose a different time.';
                    } else {
                        // Proceed with booking
                        db.collection('appointments').add({
                            studentID: user.uid,
                            teacherID: teacher,
                            date: date,
                            time: time,
                            description: description, // Store description in Firestore
                            status: 'pending',
                        }).then(() => {
                            console.log('Appointment data:', {
                                studentID: user.uid,
                                teacherID: teacher,
                                date: date,
                                time: time,
                                description: description, // Log the description
                                status: 'pending',
                            });
                            confirmationMessage.textContent = 'Appointment request sent successfully!';
                            appointmentForm.reset();
                        }).catch((error) => {
                            console.error('Error booking appointment: ', error);
                            confirmationMessage.textContent = 'Error sending appointment request.';
                        });
                    }
                }).catch((error) => {
                    console.error('Error checking appointment availability: ', error);
                    confirmationMessage.textContent = 'Error checking appointment availability.';
                });
        } else {
            alert('User not authenticated. Please log in.');
        }
    });

    // Handle logout
    document.getElementById('logout').addEventListener('click', function () {
        firebase.auth().signOut().then(() => {
            window.location.href = 'studentlogin.html'; // Redirect to login page after logout
        }).catch((error) => {
            console.error('Error during logout:', error);
        });
    });

    // Handle hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    hamburger.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
});
