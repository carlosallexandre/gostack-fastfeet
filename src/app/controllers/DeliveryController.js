import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

import { storeSchema, updateSchema } from '../validations/delivery';

class DeliveryController {
  index(req, res) {
    Delivery.findAll({
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zipcode',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    })
      .then(deliveries => res.json(deliveries))
      .catch(err => {
        return res.status(500).json({ [err.name]: err.message });
      });
  }

  show(req, res) {
    const { id } = req.params;

    Delivery.findByPk(id, {
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zipcode',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    })
      .then(delivery => {
        if (!delivery) {
          throw new Error("Delivery doesn't exist.");
        }
        return res.json(delivery);
      })
      .catch(err => {
        return res.status(400).json({ [err.name]: err.message });
      });
  }

  store(req, res) {
    storeSchema
      .validate(req.body)
      .then(() => {
        return Delivery.create(req.body);
      })
      .then(delivery => res.json(delivery))
      .catch(err => {
        return res.status(400).json({ [err.name]: err.message });
      });
  }

  update(req, res) {
    const { id } = req.params;

    updateSchema
      .validate(req.body)
      .then(() => {
        return Delivery.findByPk(id);
      })
      .then(model => {
        return model.update(req.body);
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

    Delivery.findByPk(id)
      .then(model => {
        if (!model) {
          throw new Error("Delivery doesn't exist");
        }
        return model.destroy();
      })
      .then(() => {
        return res.json({ message: 'Delivery deleted' });
      })
      .catch(err => {
        return res.status(400).json({ [err.name]: err.message });
      });
  }
}

export default new DeliveryController();
