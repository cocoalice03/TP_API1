const Thread = require('../models/thread.model');
const Message = require('../models/message.model');
const Group = require('../models/group.model');
const Event = require('../models/event.model');

exports.createThread = async (req, res, next) => {
  try {
    const { title, groupId, eventId } = req.body;

    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ status: 'fail', message: 'Groupe non trouvé' });
      // Vérifier si membre du groupe
      if (!group.members.includes(req.user.id) && req.user.role !== 'admin') {
        return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
      }
      req.body.group = groupId;
    } else if (eventId) {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ status: 'fail', message: 'Événement non trouvé' });
      // Vérifier si participant ou créateur
      if (!event.participants.includes(req.user.id) && !event.creator.equals(req.user.id) && req.user.role !== 'admin') {
        return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
      }
      req.body.event = eventId;
    }

    req.body.creator = req.user.id;
    const thread = await Thread.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { thread }
    });
  } catch (err) {
    next(err);
  }
};

exports.postMessage = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ status: 'fail', message: 'Fil non trouvé' });

    // Vérifier les permissions (si groupe ou event)
    if (thread.group) {
      const group = await Group.findById(thread.group);
      if (!group.members.includes(req.user.id) && req.user.role !== 'admin') {
        return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
      }
    }

    const message = await Message.create({
      content: req.body.content,
      thread: req.params.threadId,
      sender: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: { message }
    });
  } catch (err) {
    next(err);
  }
};

exports.getThreadMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ thread: req.params.threadId })
      .populate('sender', 'username')
      .sort('createdAt');

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: { messages }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteThread = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ status: 'fail', message: 'Fil non trouvé' });

    if (!thread.creator.equals(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
    }

    await Thread.findByIdAndDelete(req.params.threadId);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};

