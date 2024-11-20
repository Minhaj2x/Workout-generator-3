import { syncDataWithFirebase } from './firebaseSync.js';

// Listen for when the app goes online
window.addEventListener('online', () => {
  console.log('App is back online! Syncing data...');
  syncDataWithFirebase(); // Sync local data with Firebase
});

// Listen for when the app goes offline
window.addEventListener('offline', () => {
  console.log('App is offline. Local data will be stored.');
});
