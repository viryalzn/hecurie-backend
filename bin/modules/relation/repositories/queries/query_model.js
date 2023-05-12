const Joi = require('joi');
const uuid = Joi.string().guid();

const paginationSchema = () => Joi.object({
  query: Joi.object({
    relationId: Joi.string().guid().optional(),
    symptomCode: Joi.string().optional(),
    modifiedAt: Joi.object().optional(),
    createdAt: Joi.object().optional(),
  }).default(),
  sort: Joi.object({
    symptomName: Joi.number().min(-1).max(1)
  }).unknown().optional().default({}),
  page: Joi.number().optional().default(1),
  size: Joi.number().optional().default(10)
});

const getRelation = () => Joi.object().keys({
  relationId: uuid.required(),
});

module.exports = {
  paginationSchema,
  getRelation
};
