document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quoteForm');
    const quoteDisplay = document.getElementById('quoteDisplay');

    const quotes = {
        "English": [
            { text: "To be or not to be, that is the question.", translation: null },
            { text: "I think, therefore I am.", translation: null },
            { text: "Stay hungry, stay foolish.", translation: null },
            { text: "The only way to do great work is to love what you do.", translation: null },
            { text: "Be the change you wish to see in the world.", translation: null }
        ],
        "Spanish": [
            { text: "En boca cerrada no entran moscas.", translation: "Flies don't enter a closed mouth." },
            { text: "El que la sigue la consigue.", translation: "He who follows it, achieves it." },
            { text: "Más vale tarde que nunca.", translation: "Better late than never." },
            { text: "Al mal tiempo, buena cara.", translation: "In bad weather, a good face." },
            { text: "Dime con quién andas y te diré quién eres.", translation: "Tell me who you walk with and I'll tell you who you are." }
        ],
        "French": [
            { text: "Je pense, donc je suis.", translation: "I think, therefore I am." },
            { text: "La vie est belle.", translation: "Life is beautiful." },
            { text: "L'amour est aveugle.", translation: "Love is blind." },
            { text: "Après la pluie, le beau temps.", translation: "After the rain, good weather." },
            { text: "Qui vivra verra.", translation: "Who will live will see." }
        ],
        "Hindi": [
            { text: "जो डर गया, वो मर गया।", translation: "One who gets scared, dies." },
            { text: "करत करत अभ्यास के जड़मति होत सुजान।", translation: "With practice, even a fool becomes wise." },
            { text: "जहाँ चाह वहाँ राह।", translation: "Where there's a will, there's a way." },
            { text: "अतिथि देवो भव:", translation: "The guest is equivalent to God." },
            { text: "विद्या धनं सर्व धनं प्रधानम्।", translation: "Knowledge is the supreme wealth." }
        ],
        "Manipuri": [
            { text: "अहिंग नुमित खुदिंगी ऐना नुंशिजरि।", translation: "I love you day and night." },
            { text: "लैबाक मचा ओइबा फजबनि।", translation: "It's good to be a patriot." },
            { text: "थबक शुबा मीना पुन्सी नुंशाई।", translation: "Life is happy for those who work." },
            { text: "ऐगी इमा लैबाकपु नुंशिजौ।", translation: "Let's love our motherland." },
            { text: "हैबा शक्ति पुम्नमक शिजिन्नौ।", translation: "Let's use all our strength." }
        ],
        "Kannada": [
            { text: "ದುಡಿಮೆಯೇ ದೈವ", translation: "Work is worship." },
            { text: "ಕಷ್ಟಪಟ್ಟರೆ ಫಲ ಸಿಗುತ್ತದೆ", translation: "Hard work pays off." },
            { text: "ಮನಸ್ಸಿದ್ದರೆ ಮಾರ್ಗ", translation: "Where there's a will, there's a way." },
            { text: "ಸತ್ಯಮೇವ ಜಯತೇ", translation: "Truth alone triumphs." },
            { text: "ಅತಿಥಿ ದೇವೋ ಭವ", translation: "The guest is God." }
        ]
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const language = document.getElementById('language').value;
        displayQuotes(language);
    });

    function displayQuotes(language) {
        if (quotes[language]) {
            const selectedQuotes = getRandomQuotes(quotes[language], 5);
            quoteDisplay.innerHTML = selectedQuotes.map(quote => `
                <div class="quote">
                    <p class="original">"${quote.text}"</p>
                    ${quote.translation ? `<p class="translation">Translation: "${quote.translation}"</p>` : ''}
                </div>
            `).join('');
        } else {
            quoteDisplay.innerHTML = '<p>No quotes available for this language.</p>';
        }
    }

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
});