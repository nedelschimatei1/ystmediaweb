import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  redact: {
    // basic default redaction rules; adjust as needed
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'err.stack',
      'err.message'
    ],
    remove: false,
  },
});

export default logger;
