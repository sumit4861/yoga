import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

document.getElementById("loginBtn").addEventListener("click", async () => {
    const name = document.getElementById("loginName").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const loginStatus = document.getElementById("loginStatus");

    const q = query(collection(db, "teachers"), where("name", "==", name), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        loginStatus.innerText = "✅ Login successful!";
        document.getElementById("uploadSection").style.display = "block";
    } else {
        loginStatus.innerText = "❌ Invalid name or password!";
    }
});

document.getElementById("uploadVideoBtn").addEventListener("click", async () => {
    const name = document.getElementById("loginName").value.trim();
    const videoUrl = document.getElementById("videoUrl").value.trim();
    const uploadStatus = document.getElementById("uploadStatus");

    const q = query(collection(db, "teachers"), where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const teacherDoc = querySnapshot.docs[0].ref;
        await updateDoc(teacherDoc, { videoUrl });

        uploadStatus.innerText = "✅ Video uploaded successfully!";
    } else {
        uploadStatus.innerText = "❌ Error uploading video!";
    }
});
