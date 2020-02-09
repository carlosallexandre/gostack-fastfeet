import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';
import storeSchema from '../validations/auth';

class SessionController {
  store(req, res) {
    const { email, password } = req.body;
    let id;
    let name;

    storeSchema
      .validate(req.body)
      .then(() => {
        return User.findOne({ where: { email } });
      })
      .then(user => {
        id = user.id;
        name = user.name;
        return user.checkPassword(password);
      })
      .then(result => {
        if (!result) {
          throw new Error('Invalid credentials');
        }
        return res.json({
          user: { id, name, email },
          token: jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
          }),
        });
      })
      .catch(err => {
        if (err.name === 'ValidationError') {
          res.status(400);
        } else {
          err.name = 'Error';
          err.message = 'Invalid credentials';
          res.status(401);
        }
        return res.json({ [err.name]: err.message });
      });
  }
}

export default new SessionController();
