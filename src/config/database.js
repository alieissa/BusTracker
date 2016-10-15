import {FIREBASECONFIG} from './fb.js';

function firebaseInit() {
  firebase.initializeApp(FIREBASECONFIG);
}

export {firebaseInit}
