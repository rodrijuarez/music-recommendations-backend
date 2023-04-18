import { ChatGPTAPI } from 'chatgpt'
import  express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express();


// Route to generate movie recommendations
app.get('/recommendations', async (req, res) => {
  const { movie } = req.query;

  // Generate the prompt to send to OpenAI
  const prompt  = `Generate movie recommendations for "${movie}" but with a different director`;


  try {

  const api = new ChatGPTAPI({
    apiKey: process.env.CHAT_GPT_KEY
  })

  const response = await api.sendMessage(prompt)

    res.send(response.text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating movie recommendations');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
