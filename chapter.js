<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SATVerse - Reader</title>
  
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>

  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="chapter.css">
</head>
<body>

  <header>
    <nav>
      <a href="#" class="logo">SAT<span>Verse</span></a>
      <input type="text" name="" id="search-input" placeholder="Search Anime, Manga, Characters">
    </nav>
  </header>
  
  <div style="text-align: center; margin: 15px auto; width: 100%; overflow: hidden;">
    <script>
      atOptions = {
        'key' : 'a83807c1959ec98a479d2ab8c1b5a45c',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    </script>
    <script src="https://celerycribbanish.com/a83807c1959ec98a479d2ab8c1b5a45c/invoke.js"></script>
  </div>
  
  <h1 id="chapter-heading">Loading...</h1>
  
  <div class="action-controls">
    <button class="downloadbtn" onclick="downloadManga()">Download PDF</button>
    <button class="readbtn" onclick="loadManga()">Read Online</button>
  </div>

  <br>
  
  <div id="pdf-container" style="display: none; width: 100%; max-width: 800px; margin: 0 auto; overflow-y: auto; background: transparent;">
      </div>
  
  <footer>
    <div class="footer">
      <button class="previous" id="prev-btn">Previous</button>
      <button class="next" id="next-btn">Next</button>
    </div>
  </footer>

  <script src="chapter.js"></script>

  <script src="https://celerycribbanish.com/59/0f/55/590f5570b214ef5dc10f60745156affd.js"></script>

</body>
</html>
