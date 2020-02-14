import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.id} <${delivery.deliveryman.email}>`,
      subject: 'Your delivery was canceled',
      template: 'canceledDelivery',
      context: {
        deliveryman: delivery.deliveryman.name,
        product: delivery.product,
        description: delivery.DeliveryProblems[0].description,
      },
    });
  }
}

export default new CancellationMail();
