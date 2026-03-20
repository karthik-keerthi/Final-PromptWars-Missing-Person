import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};

export const seedDatabase = async () => {
  const q = query(collection(db, 'missingPersons'), limit(1));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log("Seeding database with initial data...");
    const initialData = [
      {
        registrationNumber: "13347",
        name: "Jithender Prajapathi",
        relation: "S/o. Bheraram Prajapathi",
        dateMissingFrom: "14-03-2026",
        lastSeen: "From home",
        mobileNumbers: "871266265, 8712660534",
        age: 32,
        languagesKnown: "Hindi, Marwadi",
        district: "Hyderabad",
        policeStationArea: "Afzalgunj",
        caseRegistered: "117/2026",
        mentalHealthStatus: "Normal",
        personImageWebLink: "https://unknownbodies.org/wp-content/uploads/shfimages/missings/1773647395.jpg",
        status: "missing",
        createdAt: serverTimestamp()
      },
      {
        registrationNumber: "13346",
        name: "Manimala",
        relation: "D/o. Thipanna",
        dateMissingFrom: "14-03-2026",
        lastSeen: "From home",
        mobileNumbers: "9700760432, 8712665189",
        age: 18,
        languagesKnown: "Telugu, English",
        district: "Hyderabad",
        policeStationArea: "Borabanda",
        caseRegistered: "146/2026",
        mentalHealthStatus: "Normal",
        personImageWebLink: "https://unknownbodies.org/wp-content/uploads/shfimages/missings/1773818238.jpg",
        status: "missing",
        createdAt: serverTimestamp()
      },
      {
        registrationNumber: "13345",
        name: "Prabh Dayal Sharma",
        relation: "S/o. Shanak Sharma",
        dateMissingFrom: "01-01-2026",
        lastSeen: "From home",
        mobileNumbers: "97979 46555",
        age: 90,
        languagesKnown: "Hindi",
        district: "Hyderabad",
        policeStationArea: "Jammu",
        caseRegistered: "./2026",
        mentalHealthStatus: "Normal",
        personImageWebLink: "https://unknownbodies.org/wp-content/uploads/shfimages/missings/1773578091.jpg",
        status: "missing",
        createdAt: serverTimestamp()
      },
      {
        registrationNumber: "13344",
        name: "Kamini Anjaiah",
        relation: "S/o. Ramaiah",
        dateMissingFrom: "08-03-2026",
        lastSeen: "Saroor nagar limits",
        mobileNumbers: "9908749110, 9391389377",
        age: 45,
        languagesKnown: "Telugu",
        district: "R.R.Dist",
        policeStationArea: "",
        caseRegistered: "",
        mentalHealthStatus: "Mentally disable",
        personImageWebLink: "https://unknownbodies.org/wp-content/uploads/shfimages/missings/1773576919.jpg",
        status: "missing",
        createdAt: serverTimestamp()
      },
      {
        registrationNumber: "13343",
        name: "OO",
        relation: "O",
        dateMissingFrom: "13-03-2026",
        lastSeen: "O",
        mobileNumbers: "0",
        age: 72,
        languagesKnown: "Telugu, Hindi",
        district: "Hyderabad",
        policeStationArea: "",
        caseRegistered: "",
        mentalHealthStatus: "Alzimer",
        personImageWebLink: "https://unknownbodies.org/wp-content/uploads/shfimages/missings/1773906260.jpg",
        status: "missing",
        createdAt: serverTimestamp()
      }
    ];

    for (const person of initialData) {
      await addDoc(collection(db, 'missingPersons'), person);
    }
    console.log("Database seeded successfully.");
  }
};
