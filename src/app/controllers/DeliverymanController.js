import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import { storeSchema, updateSchema } from '../validations/deliveryman';

class DeliverymanController {
  index(req, res) {
    Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
    })
      .then(deliverymen => res.json(deliverymen))
      .catch(err => {
        return res.status(500).json({ [err.name]: err.message });
      });
  }

  show(req, res) {
    const { id } = req.params;

    Deliveryman.findByPk(id, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
    })
      .then(deliveryman => {
        if (!deliveryman) {
          throw new Error("Deliveryman doesn't exist.");
        }
        return res.json(deliveryman);
      })
      .catch(err => {
        return res.status(400).json({ [err.name]: err.message });
      });
  }

  store(req, res) {
    storeSchema
      .validate(req.body)
      .then(() => {
        return Deliveryman.create(req.body);
      })
      .then(deliveryman => res.json(deliveryman))
      .catch(err => {
        if (!res.statusCode) {
          res.status(400);
        }
        return res.json({ [err.name]: err.message });
      });
  }

  update(req, res) {
    const { id } = req.params;

    updateSchema
      .validate(req.body)
      .then(() => {
        return Deliveryman.findByPk(id);
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

    Deliveryman.findByPk(id)
      .then(model => {
        if (!model) {
          throw new Error("Deliveryman doesn't exist");
        }
        return model.destroy();
      })
      .then(() => {
        return res.json({ message: 'Deliveryman deleted' });
      })
      .catch(err => {
        return res.status(400).json({ [err.name]: err.message });
      });
  }
}

export default new DeliverymanController();
