import * as yup from 'yup';

const storeSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  avatar_id: yup.number().required(),
});

const updateSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  avatar_id: yup.number(),
});

export { storeSchema, updateSchema };
