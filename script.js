// Global variables to keep track of current quotes and index
let currentQuotes = [];
let currentIndex = 0;

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

// Function to display a single quote
function displayQuote(quote) {
    const quoteText = document.getElementById('quoteText');
    const quoteTranslation = document.getElementById('quoteTranslation');
    const quoteImage = document.getElementById('quoteImage');

    quoteText.textContent = `"${quote.text}"`;
    quoteTranslation.textContent = quote.translation ? `Translation: "${quote.translation}"` : '';
    
    const imageUrl = getRandomImageUrl();
    console.log("Attempting to load image:", imageUrl);

    // Create a new image object to test loading
    const img = new Image();
    img.onload = function() {
        quoteImage.style.backgroundImage = `url(${imageUrl})`;
    };
    img.onerror = function() {
        console.error("Failed to load image:", imageUrl);
        quoteImage.style.backgroundColor = '#f0f0f0'; // Fallback background color
    };
    img.src = imageUrl;
}

// Function to get a random image URL
function getRandomImageUrl() {
    // Using Lorem Picsum for placeholder images
    const width = 800;
    const height = 400;
    const randomId = Math.floor(Math.random() * 1000); // Random image
    return `https://picsum.photos/seed/${randomId}/${width}/${height}`;
}

// Function to load quotes for a selected language
function loadQuotes(language) {
    currentQuotes = quoteData.quotes[language] || [];
    currentIndex = 0;
    if (currentQuotes.length > 0) {
        displayQuote(currentQuotes[currentIndex]);
    } else {
        document.getElementById('quoteText').textContent = 'No quotes available for this language.';
        document.getElementById('quoteTranslation').textContent = '';
    }
    updateNavigationButtons();
}

// Function to display the next quote
function nextQuote() {
    if (currentQuotes.length > 0) {
        currentIndex = (currentIndex + 1) % currentQuotes.length;
        displayQuote(currentQuotes[currentIndex]);
        updateNavigationButtons();
    }
}

// Function to display the previous quote
function prevQuote() {
    if (currentQuotes.length > 0) {
        currentIndex = (currentIndex - 1 + currentQuotes.length) % currentQuotes.length;
        displayQuote(currentQuotes[currentIndex]);
        updateNavigationButtons();
    }
}

// Function to update the state of navigation buttons
function updateNavigationButtons() {
    const prevButton = document.getElementById('prevQuote');
    const nextButton = document.getElementById('nextQuote');
    
    prevButton.disabled = currentQuotes.length <= 1;
    nextButton.disabled = currentQuotes.length <= 1;
}

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    populateLanguageDropdown();

    const languageSelect = document.getElementById('language');
    const nextButton = document.getElementById('nextQuote');
    const prevButton = document.getElementById('prevQuote');

    languageSelect.addEventListener('change', function() {
        loadQuotes(this.value);
    });

    nextButton.addEventListener('click', nextQuote);
    prevButton.addEventListener('click', prevQuote);

    // Load quotes for the default selected language
    loadQuotes(languageSelect.value);
});