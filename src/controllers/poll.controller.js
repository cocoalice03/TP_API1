const Poll = require('../models/poll.model');

exports.createPoll = async (req, res, next) => {
  try {
    req.body.creator = req.user.id;
    const poll = await Poll.create(req.body);
    res.status(201).json({ status: 'success', data: { poll } });
  } catch (err) { next(err); }
};

exports.vote = async (req, res, next) => {
  try {
    const { optionId } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) return res.status(404).json({ status: 'fail', message: 'Sondage non trouvé' });
    if (poll.voters.includes(req.user.id)) {
      return res.status(400).json({ status: 'fail', message: 'Vous avez déjà voté' });
    }

    const option = poll.options.id(optionId);
    if (!option) return res.status(404).json({ status: 'fail', message: 'Option non trouvée' });

    option.votes += 1;
    poll.voters.push(req.user.id);
    await poll.save();

    res.status(200).json({ status: 'success', data: { poll } });
  } catch (err) { next(err); }
};

exports.getPolls = async (req, res, next) => {
  try {
    const filter = req.query.groupId ? { group: req.query.groupId } : (req.query.eventId ? { event: req.query.eventId } : {});
    const polls = await Poll.find(filter).populate('creator', 'username');
    res.status(200).json({ status: 'success', results: polls.length, data: { polls } });
  } catch (err) { next(err); }
};

exports.deletePoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ status: 'fail', message: 'Sondage non trouvé' });
    if (!poll.creator.equals(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
    await Poll.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
