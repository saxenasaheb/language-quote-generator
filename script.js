// Function to populate the language dropdown
function populateLanguageDropdown() {
    const languageSelect = document.getElementById('language');
    languageData.availableLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.name;
        option.textContent = lang.name;
        languageSelect.appendChild(option);
    });
}

// Function to get language code
function getLangCode(language) {
    return languageData.getLanguageCode(language);
}

// Function to display quotes
function displayQuotes(language) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quoteData.quotes[language]) {
        const selectedQuotes = getRandomQuotes(quoteData.quotes[language], 5);
        quoteDisplay.innerHTML = selectedQuotes.map(quote => `
            <div class="quote">
                <p class="original" lang="${getLangCode(language)}">"${quote.text}"</p>
                ${quote.translation ? `<p class="translation">Translation: "${quote.translation}"</p>` : ''}
            </div>
        `).join('');
    } else {
        quoteDisplay.innerHTML = '<p>No quotes available for this language.</p>';
    }
}

// Function to get random quotes
function getRandomQuotes(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandomQuotes: more elements taken than available");
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Populate the language dropdown
    populateLanguageDropdown();

    // Get form and quote display elements
    const form = document.getElementById('quoteForm');
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Event listener for form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const language = document.getElementById('language').value;
        displayQuotes(language);
    });

    // Optional: Display quotes in the default language when the page loads
    const defaultLanguage = document.getElementById('language').value;
    displayQuotes(defaultLanguage);
});