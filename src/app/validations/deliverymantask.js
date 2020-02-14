import * as Yup from 'yup';

const updateSchema = Yup.object().shape({
  start_date: Yup.number(),
  end_date: Yup.number().when('start_date', (start_date, field) =>
    start_date ? field.notRequired() : field.required()
  ),
  signature_id: Yup.number().when('end_date', (end_date, field) =>
    end_date ? field.required() : field.notRequired()
  ),
});

const storeSchema = Yup.object().shape({
  description: Yup.string().required(),
});

export { updateSchema, storeSchema };
