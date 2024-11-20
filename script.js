// Define workouts object (already provided)
const workouts = {
    beginner: {
        'weight-loss': ['15 min jog', '10 push-ups', '15 sit-ups'],
        'muscle-gain': ['3 sets of 8 squats', '3 sets of 8 bench press'],
        'endurance': ['20 min cycling', '15 min jump rope'],
        'flexibility': ['30 min yoga', '15 min stretching'],
        'overall-fitness': ['20 min HIIT', '10 min core workout']
    },
    intermediate: {
        'weight-loss': ['20 min jog', '15 push-ups', '20 sit-ups'],
        'muscle-gain': ['4 sets of 10 squats', '4 sets of 10 bench press'],
        'endurance': ['30 min cycling', '20 min jump rope'],
        'flexibility': ['40 min yoga', '20 min stretching'],
        'overall-fitness': ['30 min HIIT', '20 min core workout']
    },
    advanced: {
        'weight-loss': ['30 min jog', '20 push-ups', '30 sit-ups'],
        'muscle-gain': ['5 sets of 8 squats', '5 sets of 8 bench press'],
        'endurance': ['40 min cycling', '30 min jump rope'],
        'flexibility': ['50 min yoga', '30 min stretching'],
        'overall-fitness': ['40 min HIIT', '30 min core workout']
    }
};

// Initialize Firebase (ensure you have set up Firebase in your project)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    databaseURL: "your-database-url",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
firebase.initializeApp(firebaseConfig);

// Access Firebase Database
const db = firebase.database();

// Function to sync data with Firebase when online
function syncDataWithFirebase() {
    const workoutData = JSON.parse(localStorage.getItem('workoutData'));
    if (workoutData) {
        db.ref('workouts').set(workoutData, function(error) {
            if (error) {
                console.log('Data could not be saved.' + error);
            } else {
                console.log('Data saved successfully.');
            }
        });
    }
}

// Detect online/offline status and sync data when going online
window.addEventListener('online', () => {
    console.log('Back online!');
    syncDataWithFirebase(); // Sync data when going online
});

window.addEventListener('offline', () => {
    console.log('You are offline!');
});

// Initialize IndexedDB for offline storage (simple example)
function openIndexedDB() {
    const request = indexedDB.open('workoutDB', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        // Now you can use db to store workouts in IndexedDB
        console.log('IndexedDB opened successfully.');
    };

    request.onerror = function(event) {
        console.log('Error opening IndexedDB:', event.target.error);
    };
}

openIndexedDB();

// Save workout data in IndexedDB when offline
function saveWorkoutToIndexedDB(workoutData) {
    const request = indexedDB.open('workoutDB', 1);
    
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction('workouts', 'readwrite');
        const objectStore = transaction.objectStore('workouts');
        objectStore.put({ id: 1, workouts: workoutData });

        transaction.oncomplete = function() {
            console.log('Workout data saved to IndexedDB.');
        };
    };

    request.onerror = function(event) {
        console.log('Error saving workout data to IndexedDB:', event.target.error);
    };
}

// Add functionality for form submission
document.getElementById('workout-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get selected values
    const fitnessLevel = document.getElementById('fitness-level').value;
    const goal = document.getElementById('goal').value;

    // Debugging logs to check values
    console.log("Fitness Level:", fitnessLevel);
    console.log("Goal:", goal);

    if (fitnessLevel && goal) {
        // Retrieve the workout list based on selections
        const workoutList = workouts[fitnessLevel][goal];
        const output = `
            <h3 class="fade-in">Your Workout:</h3>
            <ul class="fade-in">
                ${workoutList.map(workout => `<li>${workout}</li>`).join('')}
            </ul>`;

        // Insert the workout list into the output div
        document.getElementById('workout-output').innerHTML = output;

        // Save to IndexedDB for offline storage
        if (!navigator.onLine) {
            saveWorkoutToIndexedDB(workoutList);
        } else {
            // Save data to localStorage (or Firebase) when online
            localStorage.setItem('workoutData', JSON.stringify(workoutList));
        }

        // Add fade-in effect
        document.getElementById('workout-output').classList.add('fade-in');
    } else {
        alert('Please select both your fitness level and goal.');
    }
});

// Initialize Materialize components
document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('select');
    const instances = M.FormSelect.init(elems);
});
