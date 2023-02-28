import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore/lite';
import { getRemoteConfig } from 'firebase/remote-config';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from './constants';

const app = initializeApp(FIREBASE_CONFIG);
const remoteConfigFirebase = getRemoteConfig(app);
const fireStoreDbFirebase = getFirestore(app);
const analyticsFirebase = getAnalytics(app);

export {
  remoteConfigFirebase,
  fireStoreDbFirebase,
  analyticsFirebase,
};
