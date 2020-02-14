import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  toDate,
  isWithinInterval,
  addHours,
  subHours,
  isBefore,
} from 'date-fns';

import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';
import DeliveryProblem from '../models/DeliveryProblem';

import { updateSchema, storeSchema } from '../validations/deliverymantask';

class DeliverymanTaskController {
  async index(req, res) {
    const { deliverymanId } = req.params;

    /*
     *  Check if deliveryman exist
     */
    const deliveryman = await Deliveryman.findOne({
      where: { id: deliverymanId },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    /*
     *  build queries
     */
    const { filter } = req.query;
    const queryWhere = {};

    switch (filter) {
      case 'delivered':
        queryWhere.end_date = { [Op.ne]: null };
        break;
      case 'canceled':
        queryWhere.canceled_at = { [Op.ne]: null };
        break;
      case 'available':
      default:
        queryWhere.end_date = null;
        queryWhere.canceled_at = null;
        break;
    }
    queryWhere.deliveryman_id = deliverymanId;

    /*
     *  Find deliveries
     */
    const deliveries = await Delivery.findAll({
      where: queryWhere,
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
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async show(req, res) {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId, {
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
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const { deliverymanId, deliveryId } = req.params;
    const { start_date, end_date, signature_id } = req.body;

    /*
      Validation
     */
    if (!(await updateSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res
        .status(400)
        .json({ error: 'Delivery not found. Please check delivery id' });
    }

    /*
      Check if delivery has ended
    */
    if (delivery.end_date || delivery.canceled_at) {
      return res.status(400).json({ error: 'That delivery has ended ' });
    }
    /*
      Check permission. Only deliveryman assigned to delivery could update it.
    */
    if (delivery.deliveryman_id !== Number(deliverymanId)) {
      return res
        .status(401)
        .json({ error: 'That delivery is not assigned to you' });
    }

    if (start_date) {
      /*
        Check quantity of withdrawals today.
        Limit: 5.
      */
      const result = await Delivery.findAndCountAll({
        where: {
          deliveryman_id: deliverymanId,
          start_date: {
            [Op.between]: [startOfDay(start_date), endOfDay(start_date)],
          },
        },
        limit: 5,
      });

      if (result.count >= 5) {
        return res
          .status(400)
          .json({ error: 'You have reached the withdrawal limit.' });
      }

      /*
        Check if withdrawal is between 08:00h and 18:00h
      */
      const isBetween = isWithinInterval(toDate(start_date), {
        start: addHours(startOfDay(start_date), 8),
        end: subHours(endOfDay(start_date), 6),
      });

      if (!isBetween) {
        return res
          .status(400)
          .json({ error: 'Time outside the allowed range' });
      }

      await delivery.update({ start_date: toDate(start_date) });
    } else if (end_date && signature_id) {
      /*
        Check if delivery was withdrawn
      */
      if (!delivery.start_date) {
        return res
          .status(400)
          .json({ error: 'Delivery was not witdrawn yet.' });
      }

      /*
        Check if end_date is before start_date
      */
      if (isBefore(toDate(end_date), toDate(start_date))) {
        return res
          .status(400)
          .json({ error: 'End date must be greather than start date.' });
      }

      await delivery.update({
        end_date: toDate(end_date),
        signature_id: Number(signature_id),
      });
    }

    return res.json(delivery);
  }

  async store(req, res) {
    const { deliverymanId, deliveryId } = req.params;
    const { description } = req.body;

    if (!(await storeSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed ' });
    }

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res
        .status(400)
        .json({ error: 'Delivery not found. Please check delivery id' });
    }

    if (delivery.deliveryman_id !== Number(deliverymanId)) {
      return res
        .status(401)
        .json({ error: 'That delivery is not assigned to you' });
    }

    const { id } = await DeliveryProblem.create({
      delivery_id: deliveryId,
      description,
    });

    return res.json({ id, deliveryId, description });
  }
}

export default new DeliverymanTaskController();
