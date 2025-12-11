// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaU115wSrppVRB0tZ-GirADoUq8f4DTjc",
    authDomain: "darkemp-f42fa.firebaseapp.com",
    projectId: "darkemp-f42fa",
    storageBucket: "darkemp-f42fa.firebasestorage.app",
    messagingSenderId: "590368625084",
    appId: "1:590368625084:web:8421097e776f89173f9bb9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Firebase Auth State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'flex';
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
        
        // Update UI for logged in user
        updateDashboardForUser(user);
    } else {
        // User is signed out
        document.getElementById('login-btn').style.display = 'flex';
        document.getElementById('logout-btn').style.display = 'none';
    }
});

// Update dashboard for logged in user
function updateDashboardForUser(user) {
    // You can customize the dashboard based on user
    console.log('User logged in:', user.email);
}