// Ensure Firebase is initialized
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const email = document.getElementById('email').value;
  const fullName = document.getElementById('fullName').value;
  const department = document.getElementById('department').value;
// Check if password is at least 6 characters
if (password.length < 6) {
  alert('Password must be at least 6 characters long!');
  return;
}


  if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
  }

  try {
      // Create user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Add teacher data to Firestore
      await db.collection('teachers').doc(user.uid).set({
          username: username,
          email: email,
          fullName: fullName,
          department: department,
      });

      alert('Registration successful!');
      showLoginForm(); // Optionally show the login form after successful registration
  } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error registering teacher.');
  }
});

document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (password.length < 6) {
    alert('Password must be at least 6 characters long!');
    return;
  }
  
  
  try {
      // Sign in user with email and password
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      alert('Login successful!');
      // Redirect to the teacher dashboard or perform desired action
      window.location.href = 'pending_appointments.html'; 
  } catch (error) {
      console.error('Error during login: ', error);
      alert('Error logging in.');
  }
});

function showSignupForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
}

function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
}
