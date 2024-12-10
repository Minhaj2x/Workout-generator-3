// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; 

// Firebase configuration (replace this with your actual Firebase configuration)
const firebaseConfig = {
  apiKey: "AIzaSyCp2HL00e9b-VrTZ2Knc0kcR3HBG45pqFk",
  authDomain: "workout-generator-efb98.firebaseapp.com",
  projectId: "workout-generator-efb98",
  storageBucket: "workout-generator-efb98.firebasestorage.app",
  messagingSenderId: "498104719291",
  appId: "1:498104719291:web:fc32ea802aa3e1a627169e",
  measurementId: "G-VXE3EF916T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to test Firestore access
async function testFirestore() {
  try {
    const workoutsRef = collection(db, "workouts");
    const querySnapshot = await getDocs(workoutsRef);
    if (querySnapshot.empty) {
      console.log("No workouts found in Firestore.");
    } else {
      querySnapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
      });
    }
  } catch (e) {
    console.error("Error fetching workouts from Firestore: ", e);
  }
}

// Call the test function to verify Firestore is working
testFirestore();

// Open IndexedDB (called 'workouts-db' with version 1)
let indexedDb;
const request = indexedDB.open('workouts-db', 1);

request.onupgradeneeded = function(event) {
  indexedDb = event.target.result;
  if (!indexedDb.objectStoreNames.contains('workouts')) {
    const workoutStore = indexedDb.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
    workoutStore.createIndex('timestamp', 'timestamp', { unique: false });
  }
};

request.onsuccess = function(event) {
  indexedDb = event.target.result;
};

request.onerror = function(event) {
  console.error("Error opening IndexedDB:", event);
};

// Function to add workout data to IndexedDB
function addWorkoutToIndexedDB(workoutData) {
  const transaction = indexedDb.transaction(['workouts'], 'readwrite');
  const store = transaction.objectStore('workouts');
  const workout = {
    level: workoutData.level,
    goal: workoutData.goal,
    workoutSuggestions: workoutData.workoutSuggestions,
    timestamp: new Date()
  };
  store.add(workout);
}

// Function to retrieve all workouts from IndexedDB
function getWorkoutsFromIndexedDB(callback) {
  const transaction = indexedDb.transaction(['workouts'], 'readonly');
  const store = transaction.objectStore('workouts');
  const request = store.getAll();
  request.onsuccess = function(event) {
    callback(event.target.result);
  };
  request.onerror = function(event) {
    console.error("Error retrieving workouts from IndexedDB:", event);
  };
}

// Handle form submission
document.getElementById('fitness-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Get values from the form
    const level = document.getElementById('level').value;
    const goal = document.getElementById('goal').value;

    // Generate workout based on selected fitness level and goal
    const workoutList = document.getElementById('workout-list');
    workoutList.innerHTML = ''; // Clear previous suggestions

    let workoutSuggestions = [];

    if (level === 'beginner') {
        if (goal === 'weight_loss') {
            workoutSuggestions = [
                '30-minute brisk walk',
                'Bodyweight squats - 3 sets of 12',
                'Push-ups - 3 sets of 8',
                'Plank - 3 sets of 30 seconds'
            ];
        } else if (goal === 'muscle_gain') {
            workoutSuggestions = [
                'Bodyweight squats - 3 sets of 12',
                'Push-ups - 3 sets of 10',
                'Dumbbell rows - 3 sets of 10',
                'Dumbbell curls - 3 sets of 12'
            ];
        } else if (goal === 'endurance') {
            workoutSuggestions = [
                'Brisk walking - 45 minutes',
                'Jogging intervals - 20 minutes',
                'Jump rope - 3 sets of 2 minutes'
            ];
        }
    } else if (level === 'intermediate') {
        if (goal === 'weight_loss') {
            workoutSuggestions = [
                '45-minute steady-state cardio (bike, treadmill, etc.)',
                'Lunges - 4 sets of 12',
                'Push-ups - 4 sets of 15',
                'Mountain climbers - 4 sets of 20'
            ];
        } else if (goal === 'muscle_gain') {
            workoutSuggestions = [
                'Barbell squats - 4 sets of 8',
                'Bench press - 4 sets of 10',
                'Pull-ups - 3 sets of 8',
                'Deadlifts - 4 sets of 8'
            ];
        } else if (goal === 'endurance') {
            workoutSuggestions = [
                'Jogging - 30 minutes',
                'High-intensity interval training (HIIT) - 20 minutes',
                'Stair climbing - 4 sets of 3 minutes'
            ];
        }
    } else if (level === 'advanced') {
        if (goal === 'weight_loss') {
            workoutSuggestions = [
                'HIIT - 30 minutes',
                'Burpees - 5 sets of 20',
                'Kettlebell swings - 4 sets of 15',
                'Rowing machine - 20 minutes'
            ];
        } else if (goal === 'muscle_gain') {
            workoutSuggestions = [
                'Deadlifts - 5 sets of 5',
                'Squats - 5 sets of 5',
                'Overhead press - 4 sets of 8',
                'Bent-over rows - 4 sets of 8'
            ];
        } else if (goal === 'endurance') {
            workoutSuggestions = [
                'Marathon training (long runs) - 1 hour',
                'Interval sprints - 10 sets of 1-minute sprints',
                'Swimming - 45 minutes'
            ];
        }
    }

    // Display the workout suggestions
    workoutSuggestions.forEach(function(workout) {
        const listItem = document.createElement('li');
        listItem.textContent = workout;
        workoutList.appendChild(listItem);
    });

    // Show the workout output
    const workoutOutput = document.getElementById('workout-output');
    workoutOutput.classList.add('visible');

    // Check if the app is offline
    if (navigator.onLine) {
        // Save to Firebase if online
        try {
            await addDoc(collection(db, "workouts"), {
                level: level,
                goal: goal,
                workoutSuggestions: workoutSuggestions,
                timestamp: new Date()
            });
            console.log("Workout saved to Firestore!");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } else {
        // Save to IndexedDB if offline
        const workoutData = {
            level: level,
            goal: goal,
            workoutSuggestions: workoutSuggestions
        };
        addWorkoutToIndexedDB(workoutData);
        console.log("Workout saved to IndexedDB!");
    }
});

// Sync offline workouts with Firebase when online
window.addEventListener('online', function() {
    getWorkoutsFromIndexedDB(function(workouts) {
        workouts.forEach(async function(workout) {
            try {
                await addDoc(collection(db, "workouts"), workout);
                console.log("Synced workout to Firebase:", workout);
            } catch (e) {
                console.error("Error syncing workout to Firebase:", e);
            }
        });
    });
});
