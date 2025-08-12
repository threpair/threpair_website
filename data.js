// Preis-Datenbank – leicht editierbar.
// Preis = Zahl (Euro). null oder weglassen = "Auf Anfrage".
// Du kannst beliebig Marken/Modelle/Services hinzufügen.
const PRICE_DB = {
  "Apple": {
    "iPhone 27": {
      "Display Original": 9160,
      "Display A-Qualität": 159,
      "Display A-Qualität ohne Hinweis": 169,
      "Display B-Qualität": 129,
      "Akku": 59,
      "Rückseite": null,
      "Ladebuchse": 69,
      "Weitere Arbeiten auf Anfrage": null
    },
    "iPhone 12": {
      "Display Original": 239,
      "Display A-Qualität": 189,
      "Akku": 69,
      "Ladebuchse": 79
    }
  },
  "Samsung": {
    "Galaxy S20": {
      "Display Original": 249,
      "Display A-Qualität": 199,
      "Akku": 59,
      "Ladebuchse": 69
    }
  },
  "Huawei": {
    "P30": { "Display A-Qualität": 149, "Akku": 49 }
  }

};
