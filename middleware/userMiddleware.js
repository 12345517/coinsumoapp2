const User = require('../models/User');

// Middleware to get a user by ID
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id).populate('wallet');
    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }
    res.user = user;
    next();
  } catch (err) {
    next({ status: 500, message: err.message });
  }
}

async function findPosition(sponsorId) {
  let position = { front: 0, level: 1, position: 0 };

  if (sponsorId) {
    const sponsor = await User.findById(sponsorId);
    if (!sponsor) {
      throw new Error('Sponsor not found');
    }

    if (sponsor.level === 10) {
      position.level = 11;
      return position;
    }

    for (let front = 0; front < 3; front++) {
      for (let pos = 0; pos < 10; pos++) {
        const user = await User.findOne({
          front: front,
          level: sponsor.level + 1,
          position: pos,
        });

        if (!user) {
          position.front = front;
          position.level = sponsor.level + 1;
          position.position = pos;
          return position;
        }
      }
    }
  }

  return position;
}

module.exports = { getUser, findPosition };