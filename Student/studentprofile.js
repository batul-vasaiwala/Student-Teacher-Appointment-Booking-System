// profile.js

// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    const profileInfo = document.getElementById('profileInfo');

    // Function to fetch and display student info
    const fetchStudentInfo = (user) => {
        const studentRef = db.collection('students').doc(user.uid);
        function getYearOfStudyLabel(value) {
            const labels = {
              "1": "First Year",
              "2": "Second Year",
              "3": "Third Year",
              "4": "Fourth Year",
              "5": "High School",
              "6": "Secondary School"
            };
            return labels[value] || "Unknown";
          }
        
        studentRef.get().then((doc) => {
            if (doc.exists) {
                const studentData = doc.data();

                // Populate the profile section with student data
                profileInfo.innerHTML = `
                    <p><strong>Name:</strong> ${studentData.fullName}</p>
                    <p><strong>Email:</strong> ${studentData.email}</p>
                    <p><strong>Department:</strong> ${studentData.department}</p>
                    <p><strong>Student ID:</strong> ${studentData.studentID}</p>
                    <p><strong>Year of Study:</strong> ${getYearOfStudyLabel(studentData.yearOfStudy)}</p>
                `;
            } else {
                profileInfo.innerHTML = '<p>No profile information found.</p>';
            }
        }).catch((error) => {
            console.error('Error fetching profile information: ', error);
            profileInfo.innerHTML = '<p>Error fetching profile information.</p>';
        });
    };

    // Check if the user is logged in and fetch their info
    auth.onAuthStateChanged((user) => {
        if (user) {
            fetchStudentInfo(user);
        } else {
            profileInfo.innerHTML = '<p>Please log in to view your profile information.</p>';
        }
    });
});
//logout
document.getElementById('logout').addEventListener('click', function () {
    firebase.auth().signOut().then(() => {
      window.location.href = 'studentlogin.html'; // Redirect to login page after logout
    }).catch((error) => {
      console.error('Error during logout:', error);
    });
  });

// edit profile

document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('editProfile');
    const profileForm = document.getElementById('profileEditForm');
    const cancelEditButton = document.getElementById('cancelEdit');
  
    // Show the profile form when "Edit Profile" button is clicked
    if (editButton) {
      editButton.addEventListener('click', function() {
        profileForm.style.display = 'block';
        document.getElementById('profileInfo').style.display = 'none'; // Hide profile info
        editButton.style.display = 'none'; // Hide edit button while editing
      });
    }
  
    // Hide the profile form and show profile info when "Cancel" button is clicked
    if (cancelEditButton) {
      cancelEditButton.addEventListener('click', function() {
        profileForm.style.display = 'none';
        document.getElementById('profileInfo').style.display = 'block'; // Show profile info
        editButton.style.display = 'block'; // Show edit button
      });
    }
  });
  
  
  

document.addEventListener('DOMContentLoaded', () => {
    const editProfileButton = document.getElementById('editProfile');
    const profileForm = document.getElementById('profileForm');
    const cancelEditButton = document.getElementById('cancelEdit');
    const profileInfoDiv = document.getElementById('profileInfo');
    const editSectionDiv = document.getElementById('editSection');
  
    // Show profile form when 'Edit Profile' button is clicked
    editProfileButton.addEventListener('click', () => {
      profileForm.style.display = 'block';
      editProfileButton.style.display = 'none';
    });
  
    // Cancel editing and hide form
    cancelEditButton.addEventListener('click', () => {
      profileForm.style.display = 'none';
      editProfileButton.style.display = 'block';
    });
  
    // Handle form submission
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Get form values
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const department = document.getElementById('department').value;
      const yearOfStudy = document.getElementById('yearOfStudy').value;
  
      // Get user ID (assuming user is logged in and you have the user's ID)
      const userId = firebase.auth().currentUser.uid;
  
      try {
        const db = firebase.firestore();
        await db.collection('students').doc(userId).update({
          fullName: fullName,
          email: email,
          department: department,
          yearOfStudy: yearOfStudy
        });
  
        // Update profile info section
        profileInfoDiv.innerHTML = `
          <p>Full Name: ${fullName}</p>
          <p>Email: ${email}</p>
          <p>Department: ${department}</p>
          <p>Year of Study: ${getYearOfStudyLabel(yearOfStudy)}</p>
        `;
  
        // Hide form and show 'Edit Profile' button
        profileForm.style.display = 'none';
        editProfileButton.style.display = 'block';
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    });
  
    // Helper function to get the year of study label
    function getYearOfStudyLabel(value) {
      const labels = {
        "1": "First Year",
        "2": "Second Year",
        "3": "Third Year",
        "4": "Fourth Year",
        "5": "High School",
        "6": "Secondary School"
      };
      return labels[value] || "Unknown";
    }
  
    // Load profile info on page load
    (async () => {
      const userId = firebase.auth().currentUser.uid;
      const db = firebase.firestore();
  
      try {
        const doc = await db.collection('students').doc(userId).get();
        if (doc.exists) {
          const data = doc.data();
          profileInfoDiv.innerHTML = `
            <p>Full Name: ${data.fullName}</p>
            <p>Email: ${data.email}</p>
            <p>Department: ${data.department}</p>
            <p>Year of Study: ${getYearOfStudyLabel(data.yearOfStudy)}</p>
          `;
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    })();
  });
  