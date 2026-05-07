// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function getAIRecommendations(user, events) {

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const prompt = `
// User Interests: ${user.interests}

// Events:
// ${events.map(e => `${e._id} - ${e.eventName} - ${e.description}`).join("\n")}

// Select the best events for the user.
// Return JSON format:

// [
//  { "eventId": "", "match": 95 }
// ]
// `;

//   const result = await model.generateContent(prompt);

//   return result.response.text();
// }

// module.exports = getAIRecommendations;