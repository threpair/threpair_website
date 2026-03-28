<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preisliste iPhone & Samsung | TH Repair Vreden</title>
  <meta name="description" content="Echte Preisliste für iPhone und Samsung Reparaturen in Vreden. Display, Akku, Backcover, Ladebuchse und Reinigung.">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="topbar">
    <div class="container">
      <a href="https://wa.me/4925649392860">WhatsApp: 02564 9392860</a>
      <a href="tel:025649392860">Anrufen</a>
      <a href="index.html">Startseite</a>
    </div>
  </div>
  <header class="header">
    <div class="container">
      <a class="brand" href="index.html"><span class="brand-mark">TH</span><span>TH Repair</span></a>
      <nav class="nav">
        <a href="index.html">Startseite</a>
        <a href="#preise">Preise</a>
        <a href="#hinweise">Hinweise</a>
      </nav>
      <a class="btn btn-primary" href="https://wa.me/4925649392860">WhatsApp</a>
    </div>
  </header>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Echte Preisliste</h2>
          <p class="section-text">Apple und Samsung. Anderes Modell? Einfach kurz anfragen.</p>
        </div>
      </div>

      <div class="price-layout" id="preise">
        <aside class="card sidebar">
          <div class="field">
            <label for="brandSelect">Marke</label>
            <select id="brandSelect"></select>
          </div>
          <div class="field">
            <label for="modelSearch">Modell suchen</label>
            <input id="modelSearch" type="text" placeholder="z. B. iPhone 12 Pro">
          </div>
          <div class="field">
            <label for="modelSelect">Modell</label>
            <select id="modelSelect"></select>
          </div>
          <div class="card notice" style="padding:16px;margin-top:8px">
            <strong>Reinigung:</strong> 35 €<br>
            <span class="small">Lautsprecher, Mikrofon und Ladebuchse</span>
          </div>
        </aside>

        <main id="priceResult"></main>
      </div>
    </div>
  </section>

  <section class="section" id="hinweise">
    <div class="container grid-2">
      <div class="card">
        <h2>Garantie</h2>
        <ul>
          <li>Original-Ersatzteile: <strong>12 Monate</strong></li>
          <li>Nachbau-Ersatzteile: <strong>6 Monate</strong></li>
          <li>Akkus original und Nachbau: <strong>immer 3 Monate</strong></li>
          <li>Garantie gilt nur auf das ersetzte Bauteil, nicht auf das ganze Handy</li>
          <li>Keine Garantie bei Wasserschäden</li>
          <li>Keine Garantie auf Schäden, für die wir nichts können</li>
        </ul>
      </div>
      <div class="card">
        <h2>Versicherung & Kostenvoranschlag</h2>
        <p>Wir unterstützen bei Versicherungsfällen und der Abwicklung.</p>
        <p>Für den Kostenvoranschlag berechnen wir <strong>35 €</strong>, vorab zu zahlen.</p>
        <p>Die Versicherung zahlt normalerweise an den Geschädigten, nicht direkt an uns.</p>
        <a class="btn btn-primary" href="https://wa.me/4925649392860">Jetzt anfragen</a>
      </div>
    </div>
  </section>

  <div class="modal" id="infoModal" aria-hidden="true">
    <div class="modal-box">
      <button class="modal-close" id="modalClose" type="button">×</button>
      <h3 id="modalTitle"></h3>
      <p id="modalText"></p>
    </div>
  </div>

  <script src="preise.js"></script>
  <script src="script.js"></script>
</body>
</html>
