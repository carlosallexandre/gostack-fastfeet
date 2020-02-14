import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, delivery, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'New delivery assigned to you',
      template: 'newDelivery',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        recipient: recipient.name,
        address: `${recipient.street}, ${recipient.number}, ${recipient.complement}, ${recipient.city}, ${recipient.state}, ${recipient.zipcode}`,
      },
    });
  }
}

export default new DeliveryMail();
