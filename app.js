const CSV_URL = "https://rapid-union-d544.mauricehaghighi.workers.dev/"; 
const EXTRA_CSV_URL = "https://divine-dew-07d6.mauricehaghighi.workers.dev/"; 
let acronyms = [];
let originalData = []; 

const input = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const llmCheckbox = document.getElementById("llmCheckbox");
const extraDataCheckbox = document.getElementById("extraDataCheckbox");

async function loadCSV(url = CSV_URL, saveOriginal = true) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Fehler beim Laden der CSV: ${res.status}`);
        const csvText = await res.text();

        const parsed = Papa.parse(csvText, { header: true, delimiter: ";" }).data.filter(a => a.acronym);
        acronyms = parsed;
        if (saveOriginal) originalData = parsed.slice(); 
        console.log(`CSV geladen: ${parsed.length} Einträge`);
    } catch (err) {
        console.error("CSV Ladefehler:", err);
        resultDiv.innerText = "Fehler beim Laden der CSV.";
    }
}

loadCSV();

input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    suggestions.innerHTML = "";

    if (!query) return;

    const matches = acronyms
        .filter(a => a.acronym.toLowerCase().startsWith(query))
        .slice(0, 5);

    matches.forEach(match => {
        const li = document.createElement("li");
        li.textContent = match.acronym;
        li.addEventListener("click", () => {
            input.value = match.acronym;
            suggestions.innerHTML = "";
            showResult(match);
        });
        suggestions.appendChild(li);
    });
});

searchBtn.addEventListener("click", () => {
    const query = input.value.trim().toLowerCase();
    suggestions.innerHTML = "";
    const match = acronyms.find(a => a.acronym.toLowerCase() === query);

    if (match) {
        showResult(match);
    } else {
        resultDiv.innerText = "Kein Eintrag gefunden.";
    }
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

function showResult(match) {
    resultDiv.innerHTML = `
        <p><strong>Acronym:</strong> ${match.acronym}</p>
        <p><strong>Definition:</strong> ${match.definition}</p>
        <p><strong>Description:</strong> ${match.description}</p>
        <p><strong>Type:</strong> ${match.type}</p>
        <button id="googleBtn">Google Suche</button>
    `;

    document.getElementById("googleBtn").addEventListener("click", () => {
        const searchQuery = `${match.acronym} meaning ${match.type}`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        window.open(url, "_blank");
    });
}

