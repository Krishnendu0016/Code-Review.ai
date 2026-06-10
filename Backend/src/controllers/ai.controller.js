const aiService = require("../services/ai.service")

module.exports.getReview = async (req, res) => {
    const code = req.body.code;

    if (!code) {
        return res.status(400).send("Code is required");
    }

    try {
        const response = await aiService(code);
        res.send(response);
    } catch (err) {
        console.error("AI service error:", err.message);

        // Pass Google API errors back to the client clearly
        const status = err.status || 500;
        const message = err.message || "AI service failed";
        res.status(status).send(message);
    }
}