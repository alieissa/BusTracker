function initFirebase(databaseURL) {

  // Tries to retreive ['DEFAULT'] app
  // If not found creates it
  // let firebaseApp = firebase.initializeApp({databaseURL: databaseURL});
  try {
      let firebaseApp = firebase.initializeApp({databaseURL: databaseURL});
      return firebaseApp;
  }
  catch(error) {
    return firebase.app();
  }
}

export {initFirebase}
