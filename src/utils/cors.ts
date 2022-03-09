const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['Date','Uid','ETag'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // exposedHeaders: 'X-Total-Results',
  "preflightContinue": true,


}
module.exports = corsOptions;