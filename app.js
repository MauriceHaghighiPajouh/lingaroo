const CSV_URL = "https://rapid-union-d544.mauricehaghighi.workers.dev/";

let acronyms = [];

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    delimiter: ";",
    complete: function(results) {
        acronyms = results.data.filter(a => a.acronym);
        console.log("CSV geladen:", acronyms);
    },
    error: function(err) {
        console.error("Fehler beim Laden der CSV:", err);
    }
});

const input = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");

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
    const match = acronyms.find(a => a.acronym.toLowerCase() === query);
    suggestions.innerHTML = "";
    if (match) {
        showResult(match);
    } else {
        resultDiv.innerText = "Kein Eintrag gefunden.";
    }
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
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

const llmCheckbox = document.getElementById("llmCheckbox");
const extraDataCheckbox = document.getElementById("extraDataCheckbox");

extraDataCheckbox.addEventListener("change", () => {
    console.log("Zusätzliche Daten aktiviert:", extraDataCheckbox.checked);
});
