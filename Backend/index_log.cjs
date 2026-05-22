const http = require('http');

const server = http.createServer((req, res) => {
    console.log('Request received:', req.url);
    // Don't respond, just log
});

const PORT = 5013;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});