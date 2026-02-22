/**
 * Simple static file server for the Angular build output.
 * No npm install needed — uses only built-in Node.js modules.
 * Run with: node serve-frontend.js
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist', 'spare-parts', 'browser');
const PORT = 4200;

const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.js'   : 'application/javascript',
  '.mjs'  : 'application/javascript',
  '.css'  : 'text/css',
  '.json' : 'application/json',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.svg'  : 'image/svg+xml',
  '.ico'  : 'image/x-icon',
  '.woff' : 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf'  : 'font/ttf',
};

http.createServer((req, res) => {
  const url      = req.url.split('?')[0];                          // strip query string
  let   filePath = path.join(DIST, url === '/' ? 'index.html' : url);
  const ext      = path.extname(filePath).toLowerCase();

  fs.access(filePath, fs.constants.F_OK, (accessErr) => {
    // Unknown path or no extension → Angular SPA fallback
    if (accessErr || !ext) {
      filePath = path.join(DIST, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const contentType = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });

}).listen(PORT, '127.0.0.1', () => {
  console.log('Frontend  →  http://localhost:' + PORT);
});
