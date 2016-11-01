function initFirebase(databaseURL) {

  // Tries to retreive ['DEFAULT'] app
  // If not found creates it
  // let firebaseApp = firebase.initializeApp({databaseURL: databaseURL});
  try {
      let firebaseApp = firebase.initializeApp({databaseURL: databaseURL});
      return firebaseApp;
    // let firebaseApp = firebase.app()

  }
  catch(error) {
    // console.log('Firebase app already exists ...');
    return firebase.app();
  }

}

export {initFirebase}
