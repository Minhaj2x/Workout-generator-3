// indexeddb.js
export function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('WorkoutGeneratorDB', 1);
  
      request.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('workouts')) {
          db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
        }
      };
  
      request.onsuccess = event => resolve(event.target.result);
      request.onerror = event => reject(event.target.error);
    });
  }
  
  export async function addToIndexedDB(data) {
    const db = await openDatabase();
    const tx = db.transaction('workouts', 'readwrite');
    const store = tx.objectStore('workouts');
    store.add(data);
    return tx.complete;
  }
  
  export async function getAllFromIndexedDB() {
    const db = await openDatabase();
    const tx = db.transaction('workouts', 'readonly');
    const store = tx.objectStore('workouts');
    return store.getAll();
  }
  
  export async function deleteFromIndexedDB(id) {
    const db = await openDatabase();
    const tx = db.transaction('workouts', 'readwrite');
    const store = tx.objectStore('workouts');
    store.delete(id);
    return tx.complete;
  }
  