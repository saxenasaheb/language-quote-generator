const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vST62CEHZKlPsU1vg2d6ljSxqdCuTqZ6L3dovqKIyCOQ44EO3mgX9_r58L-fCdzj2stnT26mjj2Jyko/pub?output=csv';

async function fetchQuotes() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        return parseCSV(data);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
            return obj;
        }, {});
    });
}

// Utility functions
function getQuotesByFounder(quotes, founderName) {
    return quotes.filter(quote => quote.Person === founderName);
}

function getAllFounders(quotes) {
    return [...new Set(quotes.map(quote => quote.Person))];
}

function getQuoteById(quotes, id) {
    return quotes.find(quote => quote.ID === id);
}

function getRandomQuote(quotes, founderName = null) {
    let availableQuotes = founderName ? getQuotesByFounder(quotes, founderName) : quotes;
    return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
}