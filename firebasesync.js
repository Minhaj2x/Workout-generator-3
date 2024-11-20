import { getAllFromIndexedDB, addToIndexedDB, deleteFromIndexedDB } from './indexeddb.js';
import { createData, readData, updateData, deleteData } from './firebase.js';

// Sync local data (from IndexedDB) with Firebase when online
export async function syncDataWithFirebase() {
  // Step 1: Get all the local data from IndexedDB
  const localWorkouts = await getAllFromIndexedDB();

  // Step 2: Sync each workout to Firestore
  for (const workout of localWorkouts) {
    try {
      // Add the workout to Firestore
      await createData('workouts', workout);
      
      // After syncing, remove from IndexedDB to avoid duplication
      await deleteFromIndexedDB(workout.id);
    } catch (error) {
      console.error('Error syncing workout to Firebase:', error);
    }
  }
}

// Handle adding a new workout (either to Firebase or IndexedDB based on connection status)
export async function addWorkout(workout) {
  if (navigator.onLine) {
    // Add to Firebase if online
    await createData('workouts', workout);
  } else {
    // Add to IndexedDB if offline
    await addToIndexedDB(workout);
  }
}

// Handle updating a workout (either in Firebase or IndexedDB based on connection status)
export async function updateWorkout(id, updatedData) {
  if (navigator.onLine) {
    // Update Firebase if online
    await updateData('workouts', id, updatedData);
  } else {
    // Update IndexedDB if offline
    const workout = await getWorkoutByIdFromIndexedDB(id);
    if (workout) {
      await addToIndexedDB({ ...workout, ...updatedData });
    }
  }
}

// Handle deleting a workout (either from Firebase or IndexedDB based on connection status)
export async function deleteWorkout(id) {
  if (navigator.onLine) {
    // Delete from Firebase if online
    await deleteData('workouts', id);
  } else {
    // Delete from IndexedDB if offline
    await deleteFromIndexedDB(id);
  }
}

// Helper function to get a workout by ID from IndexedDB
async function getWorkoutByIdFromIndexedDB(id) {
  const db = await openDatabase();
  const tx = db.transaction('workouts', 'readonly');
  const store = tx.objectStore('workouts');
  return store.get(id);
}
