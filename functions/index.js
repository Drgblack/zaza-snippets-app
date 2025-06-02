const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: functions.config().openai.key,
});
const openai = new OpenAIApi(configuration);

exports.generateSnippet = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const prompt = req.body.prompt || "Say something educational.";
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      });
      res.status(200).send({ result: completion.data.choices[0].message.content });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error generating snippet.");
    }
  });
});