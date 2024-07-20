// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();
const VERCEL_URL = 'https://language-quote-generator.vercel.app/';

// Global variables
let currentQuotes = [];
let currentIndex = 0;
let currentQuoteImageUrl = '';
let currentQuote = null;
let currentLanguage = '';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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

    const randomImageUrl = getRandomImageUrl();
    quoteImage.style.backgroundImage = `url(${randomImageUrl})`;

    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
        const canvas = await html2canvas(quoteImage, {
            backgroundColor: null,
            logging: false,
            useCORS: true
        });
        const imageDataUrl = canvas.toDataURL('image/png');

        const imageName = `quote_${Date.now()}.png`;
        const imageRef = storage.ref().child(imageName);
        
        console.log("Attempting to upload image:", imageName);
        const snapshot = await imageRef.putString(imageDataUrl, 'data_url');
        console.log("Image uploaded successfully");
        
        currentQuoteImageUrl = await snapshot.ref.getDownloadURL();
        console.log("Image URL:", currentQuoteImageUrl);

        currentQuote = quote;
        currentLanguage = language;

        updateOGImage(quote.text, language, currentQuoteImageUrl);
    } catch (error) {
        console.error('Error generating or uploading image:', error);
        console.error('Error details:', error.code, error.message);
        currentQuoteImageUrl = randomImageUrl; // Fallback to random image URL
    }
    
    setupShareButtons();
}

function getRandomImageUrl() {
    const width = 800;
    const height = 400;
    const randomId = Math.floor(Math.random() * 1000); // Random image
    return `https://picsum.photos/seed/${randomId}/${width}/${height}`;
}


function updateOGImage(quote, language, imageUrl) {
    console.log("Updating OG tags with image URL:", imageUrl);
    const metaTags = {
        'og:image': imageUrl,
        'twitter:image': imageUrl,
        'og:title': `${language} Proverb`,
        'og:description': quote,
        'og:url': VERCEL_URL
    };

    Object.entries(metaTags).forEach(([property, content]) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`) ||
                      document.querySelector(`meta[name="${property}"]`);
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute(property.includes('og:') ? 'property' : 'name', property);
            document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
        console.log(`Updated ${property} meta tag with: ${content}`);
    });
}


function setupShareButtons() {
    const shareActions = {
        'twitterShare': shareOnTwitter,
        'whatsappShare': shareOnWhatsApp,
        'telegramShare': shareOnTelegram
    };

    Object.entries(shareActions).forEach(([id, action]) => {
        document.getElementById(id).onclick = action;
    });
}

function loadQuotes(language) {
    console.log("Loading quotes for language:", language);
    currentQuotes = shuffleArray([...(quoteData.quotes[language] || [])]);
    currentIndex = 0;

    if (currentQuotes.length > 0) {
        displayQuote(currentQuotes[currentIndex], language);
    } else {
        document.getElementById('quoteText').textContent = 'No quotes available for this language.';
        document.getElementById('quoteTranslation').textContent = '';
    }
    updateNavigationButtons();
}

function nextQuote() {
    if (currentQuotes.length > 0) {
        currentIndex = (currentIndex + 1) % currentQuotes.length;
        const currentLanguage = document.getElementById('language').value;
        displayQuote(currentQuotes[currentIndex], currentLanguage);
        updateNavigationButtons();
    }
}

function prevQuote() {
    if (currentQuotes.length > 0) {
        currentIndex = (currentIndex - 1 + currentQuotes.length) % currentQuotes.length;
        const currentLanguage = document.getElementById('language').value;
        displayQuote(currentQuotes[currentIndex], currentLanguage);
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    const prevButton = document.getElementById('prevQuote');
    const nextButton = document.getElementById('nextQuote');
    
    prevButton.disabled = nextButton.disabled = (currentQuotes.length <= 1);
}

function getShareUrl() {
    const baseUrl = window.location.hostname === 'localhost' ? window.location.origin : VERCEL_URL;
    return `${baseUrl}?quote=${encodeURIComponent(currentQuote.text)}&lang=${encodeURIComponent(currentLanguage)}&image=${encodeURIComponent(currentQuoteImageUrl)}`;
}   

function shareOnTwitter() {
    if (!currentQuote) return;
    const text = `"${currentQuote.text}" - ${currentLanguage} proverb`;
    const url = getShareUrl();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    console.log("Sharing on Twitter with URL:", url);
    window.open(twitterUrl, '_blank');
}

function shareOnWhatsApp() {
    if (!currentQuote) return;
    const text = `"${currentQuote.text}" - ${currentLanguage} proverb`;
    const url = getShareUrl();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url)}`;
    console.log("Sharing on WhatsApp with URL:", url);
    window.open(whatsappUrl, '_blank');
}

function shareOnTelegram() {
    if (!currentQuote) return;
    const text = `"${currentQuote.text}" - ${currentLanguage} proverb`;
    const url = getShareUrl();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    console.log("Sharing on Telegram with URL:", url);
    window.open(telegramUrl, '_blank');
}


function getLangCode(language) {
    const langCodes = {
        'English': 'en', 'Spanish': 'es', 'French': 'fr', 'German': 'de',
        'Italian': 'it', 'Japanese': 'ja', 'Russian': 'ru', 'Arabic': 'ar',
        'Hindi': 'hi', 'Kannada': 'kn', 'Telugu': 'te', 'Mandarin': 'zh'
    };
    return langCodes[language] || 'en';
}

function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteText = urlParams.get('quote');
    const lang = urlParams.get('lang');
    if (quoteText && lang) {
        const quote = { text: quoteText, translation: '' }; // You might want to handle translation differently
        displayQuote(quote, lang);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    populateLanguageDropdown();

    const languageSelect = document.getElementById('language');
    document.getElementById('nextQuote').addEventListener('click', nextQuote);
    document.getElementById('prevQuote').addEventListener('click', prevQuote);

    languageSelect.addEventListener('change', function() {
        loadQuotes(this.value);
    });

    handleUrlParams();
    if (!currentQuote) {
        loadQuotes(languageSelect.value);
    }
});