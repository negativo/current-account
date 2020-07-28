import * as Joi from "joi";

export const createAccount: Joi.SchemaMap = {
  customerId: Joi.number().required(),
  initialCredit: Joi.number()
};

export const updateAccount: Joi.SchemaMap = {
  balance: Joi.number().required()
};

export const getAccount: Joi.SchemaMap = {
  limit: Joi.number(),
  offset: Joi.number()
};
