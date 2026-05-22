const express = require('express');

const app = express();
const PORT = 5011;

// Simple routes
app.get("/health", (req, res) => {
    res.send('OK');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});