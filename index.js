import { ChatGPTAPI } from "chatgpt";
import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();

async function getRecommendations(seedItem, type) {
	const prompt = `Generate five ${type}s recommendations for similar ${type} to "${seedItem}"`;
	const queryParams = {
		model: "text-davinci-003",
		prompt,
		max_tokens: 1000,
	};
	const headers = {
		Authorization: `Bearer ${process.env.CHAT_GPT_KEY}`,
		"Content-Type": "application/json",
	};

	const urlParams = new URLSearchParams(queryParams);
	const url = `https://api.openai.com/v1/completions`;

	const response = await axios.post(url, queryParams, { headers });
	const recommendations = response.data.choices[0].text
		.trim()
		.split("\n")
		.map((line) => {
			if (type === "artist") {
				const [artist] = line.split(",");
				return { artist };
			} else {
				const [album_name, artist] = line.split(" by ");
				return { album_name, artist };
			}
		});

	const key = `${type.charAt(0).toUpperCase()}${type.slice(
		1
	)} Recommendations`;
	return { [key]: recommendations };
}

async function getSongRecommendations(seedSong) {
	return await getRecommendations(seedSong, "song");
}

async function getArtistRecommendations(seedArtist) {
	return await getRecommendations(seedArtist, "artist");
}

async function getAlbumRecommendations(seedAlbum) {
	return await getRecommendations(seedAlbum, "album");
}

// Route to generate album recommendations
app.get("/recommendations", async (req, res) => {
	const { album } = req.query;

	try {
		const response = await getAlbumRecommendations(album);

		res.send(response);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error generating album recommendations");
	}
});

// Route to generate artist recommendations
app.get("/artist-recommendations", async (req, res) => {
	const { artist } = req.query;

	try {
		const response = await getArtistRecommendations(artist);

		res.send(response);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error generating artist recommendations");
	}
});

// Route to generate song recommendations
app.get("/song-recommendations", async (req, res) => {
	const { song } = req.query;

	try {
		const response = await getSongRecommendations(song);

		res.send(response);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error generating song recommendations");
	}
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
