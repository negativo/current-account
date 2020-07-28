import * as Joi from "joi";

export const createTransaction: Joi.SchemaMap = {
  accountId: Joi.number().required(),
  value: Joi.number().required(),
  transactor: Joi.string().required()
};

export const getTransactions = {
  accountId: Joi.number().required(),
  limit: Joi.number(),
  offset: Joi.number()
};
