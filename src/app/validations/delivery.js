import * as yup from 'yup';

const storeSchema = yup.object().shape({
  product: yup.string().required(),
  recipient_id: yup.number().required(),
  deliveryman_id: yup.number().required(),
});

const updateSchema = yup.object().shape({
  product: yup.string(),
  recipient_id: yup.number(),
  deliveryman_id: yup.number(),
});

export { storeSchema, updateSchema };
