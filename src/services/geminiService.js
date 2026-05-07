// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAIRecommendations(user, events) {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
You are an AI event recommendation engine. 
Given the user's profile and a list of available events, return a JSON array containing the top 5 most relevant events. 

User Data:
Preferences/Interests: ${user.interests.join(", ")}
Location: Coordinates [${user.location?.coordinates?.join(', ') || 'Unknown'}]

Available Events:
${events.map(e => JSON.stringify({
    eventId: e._id || e.id,
    eventName: e.eventName,
    description: e.description,
    category: e.eventType?.name || e.eventType || 'Unknown',
    location: e.city + ', ' + e.eventLocation,
    distanceKm: e.distance ? e.distance.toFixed(1) + ' km away' : 'Unknown distance'
  })).join("\n")}

Based on the user preferences and location distance, rank the events from most relevant to least relevant. 
Calculate a match score (0-100) indicating how well the event fits the user's profile.

You must return ONLY a valid JSON array of objects with exactly "eventId" and "match" properties like this:
[
  { "eventId": "60c72b2f5f1b2c001f3e4d5a", "match": 95 },
  { "eventId": "60c72b2f5f1b2c001f3e4d5b", "match": 89 }
]
Do not include \`\`\`json or any other text in your response. Just the raw valid JSON array.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// module.exports = getAIRecommendations;