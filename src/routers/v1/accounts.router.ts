/**
 * Copyright (C) 2020 IKOA Business Opportunity
 * All Rights Reserved
 * Author: Reinier Millo Sánchez <reinier.millo88@gmail.com>
 *
 * This file is part of the JobSity Challenge.
 * It can't be copied and/or distributed without the express
 * permission of the author.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { AuthenticationCtrl } from '@/middlewares/authentication.middleware';
import { ResponseHandler } from '@/vendor/ikoabo/middlewares/response.middleware';
import { Objects } from '@/vendor/ikoabo/utils/objects.util';
import { AccountCtrl } from '@/controllers/accounts.controller';
import { TokenCtrl } from '@/controllers/tokens.controller';
import { TokenDocument } from '@/models/tokens.model';
import { Validator } from '@/vendor/ikoabo/middlewares/validator.middleware';
import { AccountRegisterValidation, AccountLoginValidation, AccountsInfoValidation } from '@/models/accounts.joi';
import { ACCOUNT_TYPE } from '@/models/accounts.enum';
import { Token } from '@/vendor/ikoabo/utils/token.util';
import { AccountDocument } from '@/models/accounts.model';

/* Create router object */
const router = Router();

/**
 * @api {post} /accounts/register Register new account
 * @apiName RegisterAccount
 * @apiGroup Accounts
 * @apiPermission 'service' to register user account and ['user', 'admin'] to register service or bot account
 *
 * @apiDescription Register new account into the service. The service support three types
 * of accounts
 * 
 * `AT_USER = 1`  Account for users
 *
 * `AT_SERVICE = 2`  Account for services and applications
 * 
 * `AT_BOT = 3`  Account for bots
 * 
 * To register an account with type `1` the request must be authenticated with the role `service`, but
 * in order to register an account with type `2` or `3` the request must be authenticated with the
 * roles `admin` and `user`.
 * 
 * @apiHeader {String} authorization  Bearer \<access token\>
 *
 * @apiParam (Body request fields) {String} name  Full name to display for the new account (`REQUIRED`)
 * @apiParam (Body request fields) {String} email  Email address to register the account (`REQUIRED`)
 * @apiParam (Body request fields) {String} [password]  Password to register the account. If the password is 
 * omitted then a random password will be generated for the account
 * @apiParam (Body request fields) {String} [about]  Description about the account
 * @apiParam (Body request fields) {Number} type  Type of the registered account. Allowed values: `AT_USER`, `AT_SERVICE` or `AT_BOT` (`REQUIRED`)
 *
 * @apiSuccess {String} email Email address registered for the account
 * @apiSuccess {String} [password]  Password used to register the account. This value will be returned only when
 * a password is autogenerated because it was not sent into the request
 * 
 * @apiError (Error status 401) {Number} error  Error number code
 * 
 * `1000` The access token isn't valid
 * 
 * `1001` The credentials used to authenticate are invalid
 * 
 * `1002` The authenticated account don't holds the required roles
 */
router.post('/register',
  Validator.joi(AccountRegisterValidation),
  (req: any, res: Response, next: NextFunction) => {
    /* Check for the type of account */
    if (Objects.get(req, 'body.type', ACCOUNT_TYPE.AT_USER) === ACCOUNT_TYPE.AT_USER) {
      /* User account must be registered by a service */
      return AuthenticationCtrl.doAuthenticate(['service'])(req, res, next);
    } else {
      /* Service or bot account must be registered by admin user */
      return AuthenticationCtrl.doAuthenticate(['user', 'admin'])(req, res, next);
    }
  },
  (req: any, res: Response, next: NextFunction) => {
    /* Get the given password and if its empty or null generate random password, preferably used in service and bot registration */
    let password: string = Objects.get(req, 'body.password', Token.longToken);
    if (password.length === 0) {
      password = Token.longToken;
    }

    /* Register the new user account */
    AccountCtrl.create({
      name: Objects.get(req, 'body.name'),
      type: Objects.get(req, 'body.type'),
      email: Objects.get(req, 'body.email'),
      password: password,
      about: Objects.get(req, 'body.about'),
    }).then((account: AccountDocument) => {
      /* Set the response information */
      res.locals['response'] = {
        email: Objects.get(req, 'body.email'),
      };

      /* Check if the password was autogenerated to attach to the response */
      if (Objects.get(req, 'body.password', '').toString().length === 0) {
        res.locals['response'].password = password;
      }

      next();
    }).catch(next);
  },
  ResponseHandler.success,
  ResponseHandler.error
);

/**
 * @api {post} /accounts/login Login account
 * @apiName LoginAccount
 * @apiGroup Accounts
 * @apiPermission 'service' to login user account
 *
 * @apiDescription Authenticate an account to get an access token to validate requests. The given access token
 * must be used as Bearer token to sign every request to another services.
 * 
 * Inspired into the OAuth2 standard, to authenticate an user account the request must be signed with a Bearer
 * token of a service. This schema is more simple and less secure than OAuth2 schema, but its the example idea.
 *
 * @apiParam (Body request fields) {String} email  Email address of the account (`REQUIRED`)
 * @apiParam (Body request fields) {String} password  Password of the account (`REQUIRED`)
 * 
 * @apiHeader {String} [authorization]  Bearer \<access token\>
 *
 * @apiSuccess {String} user  Account unique identifier
 * @apiSuccess {String} type  Type of the authenticated account
 * @apiSuccess {String} name  Display name of the authenticated account
 * @apiSuccess {String} about  Display about of the authenticated account
 * @apiSuccess {String} roles  Roles granted to the authenticated account
 * @apiSuccess {String} token  Generated access token
 * 
 * @apiError (Error status 401) {Number} error  Error number code
 * 
 * `1000` The access token isn't valid
 * 
 * `1001` The credentials used to authenticate are invalid
 * 
 * `1002` The authenticated account don't holds the required roles
 */
router.post('/login',
  Validator.joi(AccountLoginValidation),
  (req: any, res: Response, next: NextFunction) => {
    AccountCtrl.fetch(null, { email: Objects.get(req, 'body.email') })
      .then((account: AccountDocument) => {
        /* Set the account to be used in next middleware */
        res.locals['account'] = account;

        /* Inspired in OAuth2, user can do login only from an authenticated service */
        if (account.type === ACCOUNT_TYPE.AT_USER) {
          return AuthenticationCtrl.doAuthenticate(['service'])(req, res, next);
        }

        /* Services and bots can authenticate directly */
        next();
      }).catch(next);
  },
  (req: any, res: Response, next: NextFunction) => {
    /* Validate the given password against the account stored password */
    res.locals['account'].validPassword(Objects.get(req, 'body.password'))
      .then(() => {
        /* Generate new access token to the validated account */
        TokenCtrl.create({
          token: Token.longToken,
          account: Objects.get(res, 'locals.account.id')
        }).then((token: TokenDocument) => {
          /* Set the response information */
          res.locals['response'] = {
            user: Objects.get(res, 'locals.account.id'),
            type: Objects.get(res, 'locals.account.type'),
            name: Objects.get(res, 'locals.account.name'),
            about: Objects.get(res, 'locals.account.about'),
            roles: res['locals'].account.getRoles(),
            token: token.token
          };
          next();
        }).catch(next);
      }).catch(next);
  },
  ResponseHandler.success,
  ResponseHandler.error
);

/**
 * @api {post} /accounts/logout Logout account
 * @apiName LogoutAccount
 * @apiGroup Accounts
 *
 * @apiDescription Logout an account removing the access token used to sign requests.
 * 
 * @apiHeader {String} authorization  Bearer \<access token\>
 * 
 * @apiSuccess {String} user  Account unique identifier
 * 
 * @apiError (Error status 401) {Number} error  Error number code
 * 
 * `1000` The access token isn't valid
 */
router.post('/logout',
  AuthenticationCtrl.doAuthenticate(),
  (req: any, res: Response, next: NextFunction) => {
    /* Delete the current used access token */
    TokenCtrl.delete(Objects.get(res, 'locals.token.id'))
      .then((token: TokenDocument) => {
        /* Set the response information */
        res.locals['response'] = {
          user: token.account,
        };
        next();
      }).catch(next);
  },
  ResponseHandler.success,
  ResponseHandler.error
);

/**
 * @api {get} /accounts/validate Validate account access token
 * @apiName ValidateAccount
 * @apiGroup Accounts
 *
 * @apiDescription Validate an access token to check if its valid. Returns the user information
 * that can be used by external service to validate user permissions.
 * 
 * @apiHeader {String} authorization  Bearer \<access token\>
 * 
 * @apiSuccess {String} user  Account unique identifier
 * @apiSuccess {String} type  Type of the authenticated account
 * @apiSuccess {String} name  Display name of the authenticated account
 * @apiSuccess {String} about  Display about of the authenticated account
 * @apiSuccess {String} roles  Roles granted to the authenticated account
 * 
 * @apiError (Error status 401) {Number} error  Error number code
 * 
 * `1000` The access token isn't valid
 */
router.get('/validate',
  AuthenticationCtrl.doAuthenticate(),
  (_req: any, res: Response, next: NextFunction) => {
    /* Set the response information from authentication */
    res.locals['response'] = {
      user: Objects.get(res, 'locals.token.account.id'),
      type: Objects.get(res, 'locals.token.account.type'),
      name: Objects.get(res, 'locals.token.account.name'),
      about: Objects.get(res, 'locals.token.account.about'),
      roles: res['locals'].token.account.getRoles(),
    };
    next();
  },
  ResponseHandler.success,
  ResponseHandler.error
);

/**
 * @api {post} /accounts/info Retrieve accounts information
 * @apiName InfoAccount
 * @apiGroup Accounts
 *
 * @apiDescription Retrieve accounts information for chat data hadling.
 * 
 * @apiHeader {String} authorization  Bearer \<access token\>
 * 
 * @apiParam (Body request fields) {String[]} users  Users identifier to fetch data (`REQUIRED`)
 * 
 * @apiSuccess {Object[]} users  Accounts information
 * @apiSuccess {String} users.user  Account unique identifier
 * @apiSuccess {Number} users.type  Type of the authenticated account
 * @apiSuccess {String} users.name  Display name of the authenticated account
 * @apiSuccess {String} users.about  Display about of the authenticated account
 * 
 * @apiError (Error status 401) {Number} error  Error number code
 * 
 * `1000` The access token isn't valid
 */
router.post('/info',
  Validator.joi(AccountsInfoValidation),
  AuthenticationCtrl.doAuthenticate(),
  (req: any, res: Response, next: NextFunction) => {
    /* Look for the users information */
    AccountCtrl.fetchRaw({ _id: req.body['users'] })
      .then((users: AccountDocument[]) => {
        res.locals['response'] = {
          users: users.map(value => {
            return {
              user: value.id,
              name: value.name,
              about: value.about,
              type: value.type,
            };
          }),
        };
        next();
      }).catch(next);
  },
  ResponseHandler.success,
  ResponseHandler.error
);

export default router;
