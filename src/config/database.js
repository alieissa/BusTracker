import {FIREBASECONFIG} from './fb.js';

function firebaseInit() {
  try {
    firebase.app()
  }
  catch(error) {
    console.log('App does not exist. Creating app');
    firebase.initializeApp(FIREBASECONFIG);
  }

}

export {firebaseInit}
