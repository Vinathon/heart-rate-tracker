// middleware/validatePayload.js
const { payloadSchema } = require('../validation/validation');

const validatePayload = (req, res, next) => {
  const { error } = payloadSchema.validate(req.body, {
    abortEarly: false, // Validate all fields
    allowUnknown: false, // Disallow unknown fields
  });

  if (error) {
    // Extract detailed error messages
    const errorDetails = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorDetails });
  }

  next();
};

module.exports = validatePayload;
