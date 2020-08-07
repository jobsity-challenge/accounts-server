/**
 * Copyright (C) 2020 IKOA Business Opportunity
 * All Rights Reserved
 * Author: Reinier Millo Sánchez <reinier.millo88@gmail.com>
 *
 * This file is part of the JobSity Challenge.
 * It can't be copied and/or distributed without the express
 * permission of the author.
 */
import { Logger } from "@/vendor/ikoabo/controllers/logger.controller"
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "@/vendor/ikoabo/middlewares/response.middleware";
import { ACCOUNT_ERROR } from "@/models/errors.enum";
import { TokenModel, TokenDocument } from "@/models/tokens.model";
import { Arrays } from "@/vendor/ikoabo/utils/arrays.util";
import { AccountDocument } from "@/models/accounts.model";

/**
 * Base authentication middleware
 * Utility functions to handle authentication from express requests
 */
class Authentication {
  private static _instance: Authentication;
  private _logger: Logger;

  /**
   * Private constructor to allow singleton class
   */
  private constructor() {
    this._logger = new Logger("AuthenticationMiddleware");
  }

  /**
   * Return singleton class instance
   */
  public static get shared(): Authentication {
    if (!Authentication._instance) {
      Authentication._instance = new Authentication();
    }
    return Authentication._instance;
  }

  /**
   * Middleware to validate express request authentication
   * 
   * @param role  Optional roles to be validated on the authenticated user
   */
  public doAuthenticate(role?: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      /* Validate the authorization header for Bearer authorization */
      const authorization: string[] = req.headers.authorization.split(" ");
      if (authorization.length !== 2 || authorization[0] !== 'Bearer') {
        return next({ boError: ACCOUNT_ERROR.ERR_INVALID_ACCESS_TOKEN, boStatus: HTTP_STATUS.HTTP_UNAUTHORIZED });
      }

      /* Look the given access token to validate the request */
      TokenModel.findOne({ token: authorization[1] })
        .populate('account')
        .then((token: TokenDocument) => {
          if (!token || !token.account) {
            return next({ boError: ACCOUNT_ERROR.ERR_INVALID_ACCESS_TOKEN, boStatus: HTTP_STATUS.HTTP_UNAUTHORIZED });
          }

          /* Check for role validation */
          if (role && role.length > 0) {
            /* Intersect the requested roles with account roles */
            const account: AccountDocument = <any>token.account;
            const allowedRoles: string[] = Arrays.intersect(role, account.getRoles());

            /* Allowed roles must have the same size of the requested roles */
            if (allowedRoles.length !== role.length) {
              return next({ boError: ACCOUNT_ERROR.ERR_INVALID_ROLE, boStatus: HTTP_STATUS.HTTP_UNAUTHORIZED });
            }
          }

          /* Pass the validated token to the next middleware */
          res.locals['token'] = token;
          next();
        })
        .catch(next);
    }
  }
}

export const AuthenticationCtrl = Authentication.shared;
