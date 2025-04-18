const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/news', async (req, res) => {
    const results = [];

    // BBC
    try {
        const bbcResp = await axios.get('https://www.bbc.com/news/business');
        const $ = cheerio.load(bbcResp.data);
        $('a.gs-c-promo-heading').each((i, el) => {
            const title = $(el).text().trim();
            const url = 'https://www.bbc.com' + $(el).attr('href');
            results.push({ source: 'BBC', title, url });
        });
    } catch (err) {
        console.error('BBC Error:', err.message);
    }

    // Les Echos
    try {
        const lesEchosResp = await axios.get('https://www.lesechos.fr/finance-marches');
        const $ = cheerio.load(lesEchosResp.data);
        $('a.teaser__link').each((i, el) => {
            const title = $(el).text().trim();
            const url = 'https://www.lesechos.fr' + $(el).attr('href');
            results.push({ source: 'Les Echos', title, url });
        });
    } catch (err) {
        console.error('Les Echos Error:', err.message);
    }

    res.json(results);
});

// Fallback to serve index.html on root route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
