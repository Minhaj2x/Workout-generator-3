// sync.js
import { createData } from './firebase.js';
import { getAllFromIndexedDB, deleteFromIndexedDB } from './indexeddb.js';

export async function syncDataWithFirebase() {
  const workouts = await getAllFromIndexedDB();

  for (const workout of workouts) {
    await createData('workouts', workout);
    await deleteFromIndexedDB(workout.id); // Remove from IndexedDB after syncing
  }
}
