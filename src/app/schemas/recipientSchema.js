import * as yup from 'yup';

const schemaToCreate = yup.object().shape({
  name: yup.string().required(),
  street: yup.string().required(),
  number: yup.number(),
  complement: yup.string(),
  state: yup.string().required(),
  city: yup.string().required(),
  zipcode: yup
    .number()
    .required()
    .min(8)
    .max(8),
});

const schemaToUpdate = yup.object().shape({
  name: yup.string(),
  street: yup.string(),
  number: yup.number(),
  complement: yup.string(),
  state: yup.string(),
  city: yup.string(),
  zipcode: yup.number(),
});

export { schemaToCreate, schemaToUpdate };
