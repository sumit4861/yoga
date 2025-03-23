import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZmSzphanrYQC0FqTyR_OYKNB42wOythQ",
    authDomain: "manflowyoga-a36a7.firebaseapp.com",
    projectId: "manflowyoga-a36a7",
    storageBucket: "manflowyoga-a36a7.firebasestorage.app",
    messagingSenderId: "512748165114",
    appId: "1:512748165114:web:1906b5e8d9d83062c5f643"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const courseList = document.getElementById("courseList");
const logoutBtn = document.getElementById("logoutBtn");

// Fetch available teachers (courses)
async function fetchCourses() {
    const teachersRef = collection(db, "teachers");
    const teachersSnapshot = await getDocs(teachersRef);
    let courses = [];

    teachersSnapshot.forEach(doc => {
        courses.push({ id: doc.id, ...doc.data() });
    });

    return courses;
}

// Display courses for the logged-in user
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        alert("User data not found!");
        return;
    }

    const userData = userDoc.data();
    const enrolledCourses = userData.enrolledCourses || [];

    const courses = await fetchCourses();
    courseList.innerHTML = "";

    if (courses.length === 0) {
        courseList.innerHTML = "<p>No courses available.</p>";
        return;
    }

    courses.forEach(course => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${course.name} 
            ${enrolledCourses.includes(course.id) 
                ? `<button onclick="accessCourse('${course.id}')">Access</button> 
                   <button onclick="removeCourse('${course.id}')">Remove</button>` 
                : `<button onclick="addCourse('${course.id}')">Add</button>`}
        `;
        courseList.appendChild(li);
    });
});

// Add Course
window.addCourse = async (courseId) => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to add a course.");

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
        enrolledCourses: arrayUnion(courseId)
    });

    alert("Course added successfully!");
    window.location.reload();
};

// Access Course
window.accessCourse = async (courseId) => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
        activeCourse: courseId
    });

    window.location.href = "course-content.html";
};

// Remove Course
window.removeCourse = async (courseId) => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
        enrolledCourses: arrayRemove(courseId)
    });

    alert("Course removed successfully!");
    window.location.reload();
};

// Logout Function
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logged out successfully.");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout Error:", error);
        alert("Failed to log out. Try again.");
    }
});
