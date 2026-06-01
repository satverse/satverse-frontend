// ==========================================
// CONFIGURATION: LOCALHOST YA RAILWAY URL
// ==========================================
const BACKEND_URL = "http://localhost:3000"; // Live hone ke baad ise Railway link se replace kar dena

// URL Parameters Parsing
const urlParams = new URLSearchParams(window.location.search);
const manga = urlParams.get("manga");
const chapterNumStr = urlParams.get("chapter");

// Fallback logic & Redirect if missing
if (!manga || !chapterNumStr) {
  document.body.innerHTML = "<h2 style='color:white; text-align:center; margin-top:50px;'>Invalid Chapter URL. Please use the link provided by the bot.</h2>";
  throw new Error("Missing parameters");
}

const chapterId = "chapter-" + chapterNumStr;
const currentChapterNum = parseInt(chapterNumStr);

// UI Update
const heading = document.getElementById("chapter-heading");
heading.innerText = `${manga.replace("_"," ").toUpperCase()} CHAPTER ${currentChapterNum}`;

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDikMWMhhAc5BUfhpC8nmmXMxPqGRbJWLM",
  authDomain: "testadmin-a8643.firebaseapp.com",
  projectId: "testadmin-a8643",
  storageBucket: "testadmin-a8643.firebasestorage.app",
  messagingSenderId: "774620762413",
  appId: "1:774620762413:web:f2f81b568f3af1f0a3c3a4",
  measurementId: "G-XDN2Y664QJ"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Note: getTelegramLink() function removed. Backend handles verification natively now.

// Core Streaming & Download Triggers
function loadManga() {
  const viewer = document.getElementById('pdfViewer');
  viewer.src = `${BACKEND_URL}/stream-pdf/${manga}/${currentChapterNum}`;
  viewer.style.display = "inline-block";
}

function downloadManga() {
  window.location.href = `${BACKEND_URL}/download-pdf/${manga}/${currentChapterNum}`;
}

// Navigation Controls
document.getElementById("prev-btn").onclick = () => {
  const prevNum = currentChapterNum - 1;
  if (prevNum < 1) return;
  window.location.href = `chapter.html?manga=${manga}&chapter=${prevNum}`;
}

document.getElementById("next-btn").onclick = async () => {
  const nextNum = currentChapterNum + 1;
  
  // Optimization: RAM/Session storage se data uthao, Firebase calls bachao
  let totalChapters = sessionStorage.getItem(`totalChapters_${manga}`);

  if (!totalChapters) {
    // Agar user direct is page par aaya hai (bina manga.html ke)
    const mangaRef = db.collection("mangas").doc(manga);
    const docSnap = await mangaRef.get();

    if (docSnap.exists) {
      totalChapters = docSnap.data().totalChapters;
      sessionStorage.setItem(`totalChapters_${manga}`, totalChapters.toString());
    } else {
      alert("Error: Database registry not found for this manga.");
      return;
    }
  }

  if (nextNum > parseInt(totalChapters)) {
    alert("You have reached the latest chapter!");
    return;
  }
  
  window.location.href = `chapter.html?manga=${manga}&chapter=${nextNum}`;
}