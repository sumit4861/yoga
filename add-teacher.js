import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZmSzphanrYQC0FqTyR_OYKNB42wOythQ",
    authDomain: "manflowyoga-a36a7.firebaseapp.com",
    projectId: "manflowyoga-a36a7",
    storageBucket: "manflowyoga-a36a7.firebasestorage.app",
    messagingSenderId: "512748165114",
    appId: "1:512748165114:web:1906b5e8d9d83062c5f643"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("addTeacherBtn").addEventListener("click", async () => {
    const name = document.getElementById("teacherName").value.trim();
    const password = document.getElementById("teacherPassword").value.trim();
    const contact = document.getElementById("teacherContact").value.trim();
    const experience = document.getElementById("teacherExperience").value.trim();
    const imageUrl = document.getElementById("teacherImageUrl").value.trim();
    const statusMessage = document.getElementById("statusMessage");

    if (!name || !password || !contact || !experience || !imageUrl) {
        statusMessage.innerText = "⚠️ All fields are required!";
        return;
    }

    try {
        await addDoc(collection(db, "teachers"), {
            name,
            password,
            contact,
            experience,
            imageUrl
        });
        statusMessage.innerText = "✅ Teacher added successfully!";
    } catch (error) {
        console.error("Error adding teacher:", error);
        statusMessage.innerText = "❌ Error adding teacher!";
    }
});
