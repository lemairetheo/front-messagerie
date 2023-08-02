import { initializeApp } from 'firebase/app';
import * as fConfig from '/content/data/firebaseConfig.json';
import { getFirestore, collection as getCollection, addDoc } from 'firebase/firestore/lite';

const firebaseConfig = {
	authDomain: fConfig.authDomain,
	projectId: fConfig.projectId,
	storageBucket: fConfig.storageBucket,
	messagingSenderId: fConfig.messagingSenderId,
	appId: fConfig.appId,
	measurementId: fConfig.measurementId
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const addLead = async (payload) => {
	const collection = getCollection(db, 'leads_legs');
	await addDoc(collection, payload);
};
