/**
 * Copyright (C) 2020 IKOA Business Opportunity
 * All Rights Reserved
 * Author: Reinier Millo Sánchez <reinier.millo88@gmail.com>
 *
 * This file is part of the JobSity Challenge.
 * It can't be copied and/or distributed without the express
 * permission of the author.
 */
import { Joi } from "@/vendor/ikoabo/middlewares/validator.middleware";
import { ACCOUNT_TYPE } from "@/models/accounts.enum";

/**
 * Body schema validation for account register
 */
export const AccountRegisterValidation = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().allow("").optional(),
  about: Joi.string().allow("").optional(),
  type: Joi.number().min(ACCOUNT_TYPE.AT_UNKNOWN).max(ACCOUNT_TYPE.AT_BOT).required(),
});

/**
 * Body schema validation for account login
 */
export const AccountLoginValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
