import * as Joi from "joi";

export const createCustomer: Joi.SchemaMap = {
  email: Joi.string()
    .email()
    .trim()
    .required(),
  password: Joi.string()
    .trim()
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
};

export const updateCustomer: Joi.SchemaMap = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
};

export const changePassword: Joi.SchemaMap = {
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
};

export const login: Joi.SchemaMap = {
  email: Joi.string()
    .email()
    .trim()
    .required(),
  password: Joi.string()
    .trim()
    .required()
};
