const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const authRoutes = require('./routes/auth.routes');
const groupRoutes = require('./routes/group.routes');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const threadRoutes = require('./routes/thread.routes');
const socialRoutes = require('./routes/social.routes');
const pollRoutes = require('./routes/poll.routes');

const app = express();

// 0. Logging des requêtes (Audit)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 1. Sécurisation des en-têtes HTTP
app.use(helmet());

// 2. Gestion du CORS
app.use(cors());

// 3. Limitation des requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, veuillez réessayer dans 15 minutes.'
});
app.use('/api', limiter);

// 4. Body Parser
app.use(express.json({ limit: '10kb' }));

// 5. Prévention des injections NoSQL
app.use(mongoSanitize());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/threads', threadRoutes);
app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/polls', pollRoutes);

// Routes de base
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API Social Network Sécurisée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Une erreur interne est survenue'
  });
});

module.exports = app;
