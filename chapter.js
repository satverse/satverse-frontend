
// ==========================================
// CONFIGURATION: LOCALHOST YA RAILWAY URL
// ==========================================
const BACKEND_URL = "https://satverse-backend-production.up.railway.app"; 

// URL Parameters Parsing
const urlParams = new URLSearchParams(window.location.search);
const rawManga = urlParams.get("manga");
const manga = rawManga ? rawManga.toLowerCase() : null; 
const chapterNumStr = urlParams.get("chapter");

if (!manga || !chapterNumStr) {
  document.body.innerHTML = "<h2 style='color:white; text-align:center; margin-top:50px;'>Invalid Chapter URL. Please use the link provided by the bot.</h2>";
  throw new Error("Missing parameters");
}

const chapterId = "chapter-" + chapterNumStr;
const currentChapterNum = parseInt(chapterNumStr);

// UI Update
const heading = document.getElementById("chapter-heading");
heading.innerText = `${manga.replace(/_/g," ").toUpperCase()} CHAPTER ${currentChapterNum}`;

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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();


// ==========================================
// CRITICAL INJECTION: PDF.js Engine Setup
// ==========================================
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

async function loadManga() {
    const container = document.getElementById('pdf-container');
    container.style.display = "block";
    container.innerHTML = "<p style='color: white; text-align: center; margin-top: 20px;'>Loading Manga... Please wait.</p>";

    const pdfUrl = `${BACKEND_URL}/stream-pdf/${manga}/${currentChapterNum}`;

    try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        container.innerHTML = ""; // Clear loading text

        // Sequential rendering loop
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            
            // Adjust scale for quality vs performance
            const viewport = page.getViewport({ scale: 1.5 }); 
            
            const canvas = document.createElement('canvas');
            canvas.style.display = "block";
            canvas.style.margin = "0 auto 10px auto"; 
            canvas.style.maxWidth = "100%"; 
            canvas.style.height = "auto";
            canvas.style.borderRadius = "5px"; // Slight visual enhancement
            
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            container.appendChild(canvas);

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            // Wait for render before initiating the next to prevent memory overflow
            await page.render(renderContext).promise; 
        }
    } catch (error) {
        console.error('Error loading PDF Engine:', error);
        container.innerHTML = "<p style='color: red; text-align: center; margin-top: 20px;'>Error loading chapter. Server might be calculating cache or link is invalid.</p>";
    }
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
  
  let totalChapters = sessionStorage.getItem(`totalChapters_${manga}`);

  if (!totalChapters) {
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

