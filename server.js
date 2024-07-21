require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const cache = new Map();
const cacheDuration = 10 * 60 * 1000; // 10 minutes

app.use(express.json());

const STEAM_API_KEY = process.env.STEAM_API_KEY;

app.post('/inspect', async (req, res) => {
    const { links } = req.body;

    if (!Array.isArray(links) || links.length === 0) {
        return res.status(400).json({ error: 'Please provide an array of links in the request body.' });
    }

    try {
        const results = await Promise.all(links.map(link => processLink(link)));
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function processLink(link) {
    if (cache.has(link) && Date.now() - cache.get(link).timestamp < cacheDuration) {
        return cache.get(link).data;
    }

    const itemDetails = await fetchItemDetailsFromSteam(link);
    if (itemDetails) {
        cache.set(link, { data: itemDetails, timestamp: Date.now() });
    }
    return itemDetails || { error: 'Error fetching item details.' };
}

async function fetchItemDetailsFromSteam(link) {
    const match = link.match(/M(\d+)/);
    if (!match) {
        return { error: 'Invalid link format.' };
    }
    const itemId = match[1];

    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${itemId}`;

    try {
        const response = await axios.get(url);

        if (response.data && response.data.response) {
            return {
                floatValue: response.data.response.floatValue || 0,
                paintSeed: response.data.response.paintSeed || 0,
                paintIndex: response.data.response.paintIndex || 0,
                stickers: response.data.response.stickers.map(sticker => ({
                    name: sticker.name || '',
                    wear: sticker.wear || 0
                })) || []
            };
        }
        return { error: 'Error in API response.' };
    } catch (error) {
        console.error(`Error fetching item details: ${error.message}`);
        return { error: 'Error fetching item details.' };
    }
}

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
