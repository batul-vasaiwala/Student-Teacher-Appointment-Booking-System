const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const teacherProfile = document.getElementById('teacherProfile');
    const profileForm = document.getElementById('profileForm');
    const profileInfoDiv = document.getElementById('profileInfo');
    const editProfileButton = document.getElementById('editProfile');
    const cancelEditButton = document.getElementById('cancelEdit');

    // Function to fetch and display teacher profile
    const fetchTeacherProfile = (user) => {
        const teacherRef = db.collection('teachers').doc(user.uid);

        teacherRef.get().then((doc) => {
            if (!doc.exists) {
                teacherProfile.innerHTML = '<p>No profile information found.</p>';
                return;
            }

            const teacherData = doc.data();
            profileInfoDiv.innerHTML = `
                <p><strong>Name:</strong> ${teacherData.fullName}</p>
                <p><strong>Email:</strong> ${teacherData.email}</p>
                <p><strong>Department:</strong> ${teacherData.department}</p>
            `;
        }).catch((error) => {
            console.error('Error fetching teacher profile:', error);
            teacherProfile.innerHTML = '<p>Error fetching profile information.</p>';
        });
    };

    // Check if the user is logged in and fetch their profile
    auth.onAuthStateChanged((user) => {
        if (user) {
            fetchTeacherProfile(user);
        } else {
            teacherProfile.innerHTML = '<p>Please log in to view your profile.</p>';
        }
    });

    // Show the profile form when "Edit Profile" button is clicked
    if (editProfileButton) {
        editProfileButton.addEventListener('click', () => {
            profileForm.style.display = 'block';
            profileInfoDiv.style.display = 'none'; // Hide profile info
            editProfileButton.style.display = 'none'; // Hide edit button while editing
        });
    }

    // Hide the profile form and show profile info when "Cancel" button is clicked
    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', () => {
            profileForm.style.display = 'none';
            profileInfoDiv.style.display = 'block'; // Show profile info
            editProfileButton.style.display = 'block'; // Show edit button
        });
    }

    // Handle form submission for editing profile
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const department = document.getElementById('department').value;

        const userId = auth.currentUser.uid;

        try {
            await db.collection('teachers').doc(userId).update({
                fullName: fullName,
                email: email,
                department: department,
            });

            // Update profile info section
            profileInfoDiv.innerHTML = `
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Department:</strong> ${department}</p>
            `;

            // Hide form and show 'Edit Profile' button
            profileForm.style.display = 'none';
            profileInfoDiv.style.display = 'block';
            editProfileButton.style.display = 'block';
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    });

    // Logout functionality
    document.getElementById('logout').addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = 'teacherlogin.html'; // Redirect to login page after logout
        }).catch((error) => {
            console.error('Error during logout:', error);
        });
    });

    // Load profile info on page load
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const doc = await db.collection('teachers').doc(user.uid).get();
                if (doc.exists) {
                    const data = doc.data();
                    profileInfoDiv.innerHTML = `
                        <p><strong>Name:</strong> ${data.fullName}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Department:</strong> ${data.department}</p>
                    `;
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            }
        }
    });
});
