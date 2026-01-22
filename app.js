const CSV_URL = "https://rapid-union-d544.mauricehaghighi.workers.dev/";

let acronyms = [];


Papa.parse(CSV_URL, {
    download: true,
    header: true,
    delimiter: ";",
    complete: function(results) {
        acronyms = results.data.filter(a => a.acronym); // leere Zeilen ignorieren
        console.log("CSV geladen:", acronyms);
    },
    error: function(err) {
        console.error("Fehler beim Laden der CSV:", err);
    }
});


document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (!query) {
        resultDiv.innerText = "Bitte ein Acronym eingeben.";
        return;
    }

    const match = acronyms.find(a => a.acronym.toLowerCase() === query);

    if (match) {
        resultDiv.innerHTML = `
            <p><strong>Acronym:</strong> ${match.acronym}</p>
            <p><strong>Definition:</strong> ${match.definition}</p>
            <p><strong>Description:</strong> ${match.description}</p>
            <p><strong>Type:</strong> ${match.type}</p>
        `;
    } else {
        resultDiv.innerText = "Kein Eintrag gefunden.";
    }
});
