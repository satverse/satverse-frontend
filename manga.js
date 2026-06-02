const urlParams = new URLSearchParams(window.location.search);
const rawManga = urlParams.get('manga');
// CRITICAL: Bot database me lowercase formatting use karta hai
const manga = rawManga ? rawManga.toLowerCase() : null;

const firebaseConfig = {
  apiKey: "AIzaSyDikMWMhhAc5BUfhpC8nmmXMxPqGRbJWLM",
  authDomain: "testadmin-a8643.firebaseapp.com",
  projectId: "testadmin-a8643",
  storageBucket: "testadmin-a8643.firebasestorage.app",
  messagingSenderId: "774620762413",
  appId: "1:774620762413:web:f2f81b568f3af1f0a3c3a4",
  measurementId: "G-XDN2Y664QJ"
};

// CRITICAL FIX: Safe initialization checking
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  if (!manga) {
    document.getElementById('manga-title').innerText = "No Manga Selected";
    document.getElementById('chapters-list').innerHTML = "<li>Please select a manga query parameter.</li>";
    return;
  }
  
  document.getElementById('manga-title').innerText = manga.replace(/_/g, " ").toUpperCase();
  initializeMangaContext(manga);
  chapterlistsetting();
});

async function initializeMangaContext(mangaName) {
  try {
    const cleanedQuery = mangaName.replace(/_/g, " ");
    const targetUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(cleanedQuery)}&limit=1`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    const response = await fetch(proxyUrl);
    const proxyData = await response.json();
    const searchResult = JSON.parse(proxyData.contents);
    
    if (!searchResult.data || searchResult.data.length === 0) {
      document.getElementById('manga-title').innerText = cleanedQuery.toUpperCase();
      return;
    }
    
    hydrateMangaMetadataUI(searchResult.data[0]);
  } catch (error) {
    // Errors silently bypassed
  }
}

function hydrateMangaMetadataUI(mangaDoc) {
  document.getElementById('manga-title').innerText = mangaDoc.attributes.title.en || Object.values(mangaDoc.attributes.title)[0];
}

async function chapterlistsetting() {
  let totalChapters = sessionStorage.getItem(`totalChapters_${manga}`);
  let chapterlist = document.getElementById("chapters-list");
  chapterlist.innerHTML = "";

  if (totalChapters !== null) {
    totalChapters = Number(totalChapters);
    generateChapterLinks(totalChapters, chapterlist);
  } else {
    const mangaRef = db.collection("mangas").doc(manga);
    const docSnap = await mangaRef.get();

    if (docSnap.exists) {
      const mangaData = docSnap.data();
      totalChapters = mangaData.totalChapters;
      
      sessionStorage.setItem(`totalChapters_${manga}`, totalChapters.toString());
      generateChapterLinks(totalChapters, chapterlist);
    } else {
      chapterlist.innerHTML = "<li>No chapters found in database.</li>";
    }
  }
}

function generateChapterLinks(total, container) {
  for (let i = 1; i <= total; i++) {
    container.innerHTML += `<li><a href="chapter.html?manga=${manga}&chapter=${i}">Chapter ${i}</a></li>`;
  }
}
