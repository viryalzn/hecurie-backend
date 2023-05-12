const Joi = require('joi');
const uuid = Joi.string().guid();

const paginationSchema = () => Joi.object({
  query: Joi.object({
    illnessId: Joi.string().guid().optional(),
    illnessCode: Joi.string().optional(),
    modifiedAt: Joi.object().optional(),
    createdAt: Joi.object().optional(),
  }).default(),
  sort: Joi.object({
    illnessName: Joi.number().min(-1).max(1)
  }).unknown().optional().default({}),
  page: Joi.number().optional().default(1),
  size: Joi.number().optional().default(10)
});

const getDiagnosis = () => Joi.object().keys({
  patientId: uuid.required(),
});

module.exports = {
  paginationSchema,
  getDiagnosis
};
