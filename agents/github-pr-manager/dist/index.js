#!/usr/bin/env node
import http from 'node:http';
import process from 'node:process';
import { randomUUID } from 'node:crypto';

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '0.0.0.0';
const startedAt = new Date().toISOString();
const jobId = randomUUID();

const log = (message) => {
  const entry = `[github-pr-manager] ${new Date().toISOString()} ${message}`;
  process.stdout.write(`${entry}\n`);
};

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/health')) {
    const payload = JSON.stringify({
      status: 'healthy',
      startedAt,
      port,
      host,
      jobId
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(payload));
    res.end(payload);
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ status: 'not_found', path: req.url }));
});

server.on('error', (error) => {
  log(`Server error: ${error.message}`);
  process.exit(1);
});

server.listen(port, host, () => {
  log(`Listening on http://${host}:${port} (jobId=${jobId})`);
});

const shutdown = () => {
  log('Shutting down...');
  server.close(() => {
    log('Shutdown complete');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
