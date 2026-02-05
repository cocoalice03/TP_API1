const Joi = require('joi');

const groupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().max(200),
  isPrivate: Joi.boolean().default(false)
});

const eventSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  date: Joi.date().greater('now').required(),
  location: Joi.string().required(),
  description: Joi.string().max(500),
  group: Joi.string().required(),
  hasTicketing: Joi.boolean(),
  price: Joi.number(),
  bonusEnabled: Joi.boolean()
});

const threadSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  groupId: Joi.string(),
  eventId: Joi.string()
}).xor('groupId', 'eventId');

const messageSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required()
});

const albumSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().max(200),
  group: Joi.string(),
  event: Joi.string()
}).xor('group', 'event');

const photoSchema = Joi.object({
  url: Joi.string().uri().required(),
  caption: Joi.string().max(200)
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required()
});

const pollSchema = Joi.object({
  question: Joi.string().min(5).required(),
  options: Joi.array().items(Joi.object({
    text: Joi.string().required()
  })).min(2).required(),
  group: Joi.string(),
  event: Joi.string()
}).xor('group', 'event');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: 'fail', message: error.details[0].message });
  }
  next();
};

module.exports = { 
  groupSchema, 
  eventSchema, 
  threadSchema, 
  messageSchema, 
  albumSchema, 
  photoSchema, 
  commentSchema, 
  pollSchema, 
  validate 
};
