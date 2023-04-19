import { ChatGPTAPI } from "chatgpt";
import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();

async function getAlbumRecommendations(seedAlbum) {
	const prompt = `Generate album recommendations for similar music albums to "${seedAlbum}"`;
	const queryParams = {
		model: "davinci",
		prompt,
		max_tokens: 5,
	};
	const headers = {
		Authorization: `Bearer ${process.env.CHAT_GPT_KEY}`,
	};

	const urlParams = new URLSearchParams(queryParams);
	const url = `https://api.openai.com/v1/completions`;
	const response = await axios.post(url, queryParams, { headers });
	const recommendations = response.data.choices[0].text
		.trim()
		.split("\n")
		.map((line) => {
			const [album_name, artist] = line.split(" by ");
			return { album_name, artist };
		});
	return { "Album Recommendations": recommendations };
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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
