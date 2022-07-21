const User = require('../models/User');

const userController = {};

// Password is stored in plaintext at the moment and our verification is passing the User object back and forth.
// Will change to something more secure later on.

userController.register = async (req, res, next) => {
  try {
    console.log('registering user');
    const { firstName, lastName, location, email, password } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      location,
      email,
      password,
    });
    res.locals.user = user;
    res.send(user);
  } catch (err) {
    return next(err);
  }
};

userController.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) throw new Error('Incorrect login credentials');
    res.send(user);
  } catch (err) {
    return next(err);
  }
};

userController.getAll = async (req, res, next) => {
  try {
    console.log('GET ALL');
    const users = await User.find({});
    console.log(users);
    res.send(users);
  } catch (err) {
    return next(err);
  }
};

userController.getSpecificUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    return next(err);
  }
};

module.exports = userController;
