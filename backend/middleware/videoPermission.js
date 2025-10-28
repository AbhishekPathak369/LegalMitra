const Case = require('../models/Case');

const canStartMeeting = async (req, res, next) => {
  try {
    const user = req.user;
    const { caseId } = req.body;

    // Admins can do anything
    if (user.role === 'admin') return next();

    // Lawyers can start meetings for their cases
    if (user.role === 'lawyer') {
      const caseDoc = await Case.findOne({
        _id: caseId,
        $or: [
          { lawyer: user._id },
          { 'assignedLawyers': user._id }
        ]
      });
      
      if (caseDoc) return next();
    }

    // Clients can only request meetings
    if (user.role === 'client') {
      return res.status(403).json({
        success: false,
        error: 'Clients cannot start meetings directly. Please request a meeting.',
        action: 'request_meeting'
      });
    }

    return res.status(403).json({
      success: false,
      error: 'Insufficient permissions to start video meeting'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const canJoinMeeting = async (req, res, next) => {
  try {
    const user = req.user;
    const { meetingId } = req.params;

    const caseDoc = await Case.findOne({
      'videoMeetings.meetingId': meetingId
    });

    if (!caseDoc) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Check if user is case participant
    const isParticipant = 
      caseDoc.lawyer.toString() === user._id.toString() ||
      caseDoc.client.toString() === user._id.toString() ||
      user.role === 'admin';

    if (isParticipant) return next();

    res.status(403).json({ error: 'Not authorized to join this meeting' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { canStartMeeting, canJoinMeeting };