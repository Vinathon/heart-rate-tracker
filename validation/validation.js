const Joi = require('joi');

// Define schema for heart rate data entries
const heartRateDataSchema = Joi.object({
  on_date: Joi.string().isoDate().required().messages({
    'string.base': '"on_date" should be a string',
    'string.isoDate': '"on_date" must be a valid ISO date',
    'any.required': '"on_date" is required',
  }),
  measurement: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.base': '"measurement" should be a string',
      'string.pattern.base': '"measurement" must be a numeric string',
      'any.required': '"measurement" is required',
    }),
});

// Define schema for HEART_RATE clinical data
const heartRateSchema = Joi.object({
  uom: Joi.string().required().messages({
    'any.required': '"uom" is required for HEART_RATE',
  }),
  data: Joi.array().items(heartRateDataSchema).required().messages({
    'array.base': '"data" should be an array of heart rate entries',
    'any.required': '"data" is required for HEART_RATE',
  }),
  name: Joi.string().required().messages({
    'any.required': '"name" is required for HEART_RATE',
  }),
});

// Define the overall clinical data schema, allowing unknown keys
const clinicalDataSchema = Joi.object({
  HEART_RATE: heartRateSchema.required().messages({
    'any.required': '"HEART_RATE" is required in clinical_data',
  }),
}).unknown(true); // This allows unknown keys in clinical_data

// Define the payload schema
const payloadSchema = Joi.object({
  clinical_data: clinicalDataSchema.required().messages({
    'any.required': '"clinical_data" is required',
  }),
  patient_id: Joi.string().required().messages({
    'any.required': '"patient_id" is required',
  }),
  from_healthkit_sync: Joi.boolean().required().messages({
    'any.required': '"from_healthkit_sync" is required',
  }),
  orgId: Joi.string().required().messages({
    'any.required': '"orgId" is required',
  }),
  timestamp: Joi.string().isoDate().required().messages({
    'string.isoDate': '"timestamp" must be a valid ISO date',
    'any.required': '"timestamp" is required',
  }),
});

module.exports = {
  payloadSchema,
};
