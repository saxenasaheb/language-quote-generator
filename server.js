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
  console.log("Received request for quote:", quote, "language:", language);

  if (!quote || !language) {
      return res.status(400).json({ error: 'Missing quote or language parameter' });
  }

  const quoteId = generateQuoteId(quote, language);
  const imagePath = path.join(imagesDir, `${quoteId}.png`);
  const imageUrl = `/images/${quoteId}.png`;

  console.log("Generated image path:", imagePath);
  console.log("Image URL:", imageUrl);

  try {
      if (fs.existsSync(imagePath)) {
          console.log("Image already exists");
          return res.json({ imageUrl });
      }

      const image = new Jimp(1200, 630, '#1e3c72');
      const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
      const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

      // Function to wrap text
      const wrapText = (text, maxWidth) => {
          const words = text.split(' ');
          let lines = [];
          let currentLine = words[0];

          for (let i = 1; i < words.length; i++) {
              const width = Jimp.measureText(font, currentLine + ' ' + words[i]);
              if (width < maxWidth) {
                  currentLine += ' ' + words[i];
              } else {
                  lines.push(currentLine);
                  currentLine = words[i];
              }
          }
          lines.push(currentLine);
          return lines;
      };

      // Write quote
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
        console.log("Image saved successfully");

        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Error generating image', details: error.message });
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

res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');