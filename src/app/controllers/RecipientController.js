import Recipient from '../models/Recipient';
import { schemaToCreate, schemaToUpdate } from '../schemas/recipientSchema';

class RecipientController {
  index(req, res) {
    Recipient.findAll().then(models => res.json(models));
  }

  show(req, res) {
    const { id } = req.params;
    Recipient.findByPk(id).then(model => res.json(model));
  }

  store(req, res) {
    schemaToCreate
      .validate(req.body)
      .then(() => {
        return Recipient.create(req.body);
      })
      .then(recipient => {
        return res.status(200).json(recipient);
      })
      .catch(err => {
        return res.status(400).json({ [err.name]: err.message });
      });
  }

  update(req, res) {
    const { id } = req.params;

    schemaToUpdate
      .validate(req.body)
      .then(() => {
        return Recipient.findByPk(id);
      })
      .then(model => {
        Object.entries(req.body).map(value => {
          const [key, val] = value;
          model[key] = val;
          return true;
        });
        return model.save();
      })
      .then(model => {
        return res.json(model);
      })
      .catch(err => {
        return res.status(400).json({ [err.name]: err.message });
      });
  }

  destroy(req, res) {
    const { id } = req.params;

    Recipient.findByPk(id)
      .then(model => {
        if (!model) {
          throw new Error("Recipient doesn't exist");
        }
        return model.destroy();
      })
      .then(() => {
        return res.json({ message: 'Recipient deleted' });
      })
      .catch(err => {
        return res.status(400).json({ [err.name]: err.message });
      });
  }
}

export default new RecipientController();
