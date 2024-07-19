const express = require('express');
const Jimp = require('jimp');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Ensure the images directory exists
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate a unique identifier for a quote
function generateQuoteId(quote, language) {
    return crypto.createHash('md5').update(`${quote}${language}`).digest('hex');
}

app.get('/api/og', async (req, res) => {
    const { quote, language } = req.query;
    const quoteId = generateQuoteId(quote, language);
    const imagePath = path.join(imagesDir, `${quoteId}.png`);
    const imageUrl = `/images/${quoteId}.png`;

    // Check if the image already exists
    if (fs.existsSync(imagePath)) {
        return res.json({ imageUrl });
    }

    try {
        const image = new Jimp(1200, 630, '#1e3c72');
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

        // Function to wrap text (keep your existing implementation)
        const wrapText = (text, maxWidth) => {
            // ... (keep your existing wrapText function)
        };

        // Write quote (keep your existing implementation)
        const wrappedQuote = wrapText(`"${quote}"`, 1000);
        let y = 100;
        wrappedQuote.forEach(line => {
            const width = Jimp.measureText(font, line);
            const x = (1200 - width) / 2;
            image.print(font, x, y, line);
            y += 80; // line height
        });

        // Write language
        const langText = `- ${language} proverb`;
        const langWidth = Jimp.measureText(smallFont, langText);
        image.print(smallFont, (1200 - langWidth) / 2, 550, langText);

        // Save the image
        await image.writeAsync(imagePath);
        
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).send('Error generating image');
    }
});

// New endpoint to get image URL for a specific quote
app.get('/api/quote-image', (req, res) => {
    const { quote, language } = req.query;
    const quoteId = generateQuoteId(quote, language);
    const imageUrl = `/images/${quoteId}.png`;
    res.json({ imageUrl });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});