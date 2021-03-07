const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  UserModel
} = require('../../models');

module.exports = {
  createUser: async ({ userInput }) => {

    const existingUser = await UserModel.findOne({ email: userInput.email })
      .then(user => !!user);

    if (existingUser) {

      throw new Error('User already exists');
    }

    const hasedPassword = bcrypt.hashSync(userInput.password, 12);

    const user = new UserModel({
      email: userInput.email,
      password: hasedPassword
    });

    return user.save()
      .then(data => ({ ...data._doc, password: null }))
      .catch(e => {
        throw e;
      });
  },
  login: async ({
    email,
    password
  }) => {

    const user = await UserModel.findOne({  email: email });

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      'secretkey',
      {
        expiresIn: '1h'
      }
    );

    return {
      token: token,
      userId: user._id,
      tokenExpiration: 1
    };
  }
};