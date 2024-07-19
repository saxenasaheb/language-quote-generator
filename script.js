function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Global variables to keep track of current quotes and index
let currentQuotes = [];
let currentIndex = 0;
let currentQuoteImageUrl = '';

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

async function displayQuote(quote, language) {
    console.log("Displaying quote for language:", language);
    const quoteText = document.getElementById('quoteText');
    const quoteTranslation = document.getElementById('quoteTranslation');
    const quoteImage = document.getElementById('quoteImage');

    quoteText.textContent = `"${quote.text}"`;
    quoteTranslation.textContent = quote.translation ? `Translation: "${quote.translation}"` : '';
    quoteText.setAttribute('lang', getLangCode(language));

    try {
        const response = await fetch(`/api/og?quote=${encodeURIComponent(quote.text)}&language=${encodeURIComponent(language)}`);
        const data = await response.json();
        currentQuoteImageUrl = data.imageUrl;
        quoteImage.style.backgroundImage = `url(${currentQuoteImageUrl})`;
        updateOGImage(quote.text, language, currentQuoteImageUrl);
    } catch (error) {
        console.error('Error fetching quote image:', error);
        quoteImage.style.backgroundColor = '#f0f0f0'; // Fallback background color
    }
    
    setupShareButtons(quote, language);
}

// Function to get a random image URL
function getRandomImageUrl() {
    const width = 800;
    const height = 400;
    const randomId = Math.floor(Math.random() * 1000); // Random image
    return `https://picsum.photos/seed/${randomId}/${width}/${height}`;
}

function updateOGImage(quote, language, imageUrl) {
    const fullImageUrl = `https://language-quote-generator.vercel.app${imageUrl}`;
    document.querySelector('meta[property="og:image"]').setAttribute('content', fullImageUrl);
    document.querySelector('meta[property="twitter:image"]').setAttribute('content', fullImageUrl);
    document.querySelector('meta[property="og:title"]').setAttribute('content', `${language} Proverb`);
    document.querySelector('meta[property="og:description"]').setAttribute('content', quote);
}

function setupShareButtons(quote, language) {
    console.log("Setting up share buttons for language:", language);
    const twitterBtn = document.getElementById('twitterShare');
    const whatsappBtn = document.getElementById('whatsappShare');
    const telegramBtn = document.getElementById('telegramShare');

    twitterBtn.onclick = () => shareOnTwitter(quote.text, quote.translation, language);
    whatsappBtn.onclick = () => shareOnWhatsApp(quote.text, quote.translation, language);
    telegramBtn.onclick = () => shareOnTelegram(quote.text, quote.translation, language);
}

// Function to load quotes for a selected language
function loadQuotes(language) {
    console.log("Loading quotes for language:", language);
    currentQuotes = quoteData.quotes[language] || [];
    
    // Shuffle the quotes
    currentQuotes = shuffleArray([...currentQuotes]);
    
    currentIndex = 0;
    if (currentQuotes.length > 0) {
        displayQuote(currentQuotes[currentIndex], language);
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
        const currentLanguage = document.getElementById('language').value;
        displayQuote(currentQuotes[currentIndex], currentLanguage);
        updateNavigationButtons();
    }
}

// Function to display the previous quote
function prevQuote() {
    if (currentQuotes.length > 0) {
        currentIndex = (currentIndex - 1 + currentQuotes.length) % currentQuotes.length;
        const currentLanguage = document.getElementById('language').value;
        displayQuote(currentQuotes[currentIndex], currentLanguage);
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
        const selectedLanguage = this.value;
        console.log("Selected language:", selectedLanguage);
        loadQuotes(selectedLanguage);
    });

    nextButton.addEventListener('click', nextQuote);
    prevButton.addEventListener('click', prevQuote);

    // Load quotes for the default selected language
    const initialLanguage = languageSelect.value;
    console.log("Initial language:", initialLanguage);
    loadQuotes(initialLanguage);
});

function shareOnTwitter(quote, translation, language) {
    console.log("Sharing on Twitter for language:", language);
    const text = `${language} proverb`;
    const url = 'https://language-quote-generator.vercel.app/';
    const imageUrl = `https://language-quote-generator.vercel.app${currentQuoteImageUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&image=${encodeURIComponent(imageUrl)}`;
    window.open(twitterUrl, '_blank');
}

function shareOnWhatsApp(quote, translation, language) {
    console.log("Sharing on WhatsApp for language:", language);
    const text = `${language} proverb`;
    const url = 'https://language-quote-generator.vercel.app/';
    const imageUrl = `https://language-quote-generator.vercel.app${currentQuoteImageUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url + '\n' + imageUrl)}`;
    window.open(whatsappUrl, '_blank');
}

function shareOnTelegram(quote, translation, language) {
    console.log("Sharing on Telegram for language:", language);
    const text = `${language} proverb`;
    const url = 'https://language-quote-generator.vercel.app/';
    const imageUrl = `https://language-quote-generator.vercel.app${currentQuoteImageUrl}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text + '\n' + imageUrl)}`;
    window.open(telegramUrl, '_blank');
}
function getLangCode(language) {
    const langCodes = {
        'English': 'en',
        'Spanish': 'es',
        'French': 'fr',
        'German': 'de',
        'Italian': 'it',
        'Japanese': 'ja',
        'Russian': 'ru',
        'Arabic': 'ar',
        'Hindi': 'hi',
        'Kannada': 'kn',
        'Telugu': 'te',
        'Mandarin': 'zh'
    };
    return langCodes[language] || 'en';
}