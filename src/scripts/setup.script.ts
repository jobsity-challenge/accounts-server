/**
 * Copyright (C) 2020 IKOA Business Opportunity
 * All Rights Reserved
 * Author: Reinier Millo Sánchez <reinier.millo88@gmail.com>
 *
 * This file is part of the JobSity Challenge.
 * It can't be copied and/or distributed without the express
 * permission of the author.
 */
import "module-alias/register";
import { Logger, LOG_LEVEL } from "@/vendor/ikoabo/controllers/logger.controller";
import { Account, AccountModel, AccountDocument } from "@/models/accounts.model";
import { ACCOUNT_TYPE } from "@/models/accounts.enum";
import { HttpServer } from "@/vendor/ikoabo/controllers/server.controller";
import { ServiceSettings } from "@/settings/service.settings";
import async from "async";

/* Setup logger */
Logger.setLogLevel(LOG_LEVEL.DEBUG);

/* Initials accounts */
const accounts: Account[] = [
  {
    name: "John Doe",
    about: "Default administrative user",
    email: "jdoe@challenge.com",
    password: "challenge*2020",
    type: ACCOUNT_TYPE.AT_USER,
    roles: ["admin"],
  },
  {
    name: "Jane Doe",
    about: "Another user",
    email: "janedoe@challenge.com",
    password: "challenge*2020",
    type: ACCOUNT_TYPE.AT_USER,
    roles: [],
  },
  {
    name: "Chat Server",
    about: "Chat server account",
    email: "chat@challenge.com",
    password: "challenge*2020",
    type: ACCOUNT_TYPE.AT_SERVICE,
    roles: [],
  },
  {
    name: "Chat Client",
    about: "Chat web client application",
    email: "web@challenge.com",
    password: "challenge*2020",
    type: ACCOUNT_TYPE.AT_SERVICE,
    roles: [],
  },
  {
    name: "Bot Server",
    about: "Bot Server account",
    email: "bot@challenge.com",
    password: "challenge*2020",
    type: ACCOUNT_TYPE.AT_BOT,
    roles: [],
  }
];

/* Setup http server */
HttpServer.setup(ServiceSettings);
const _logger: Logger = new Logger("InitData");

/* Initialize mongo connection */
HttpServer.shared.initMongo().then(() => {
  _logger.debug("*** DATA IMPORT STARTED ***");

  /* Registrate all initial accounts */
  async.forEach(
    accounts,
    (value: Account, cb: any) => {
      /* Register the account */
      AccountModel.create(value)
        .then((value: AccountDocument) => {
          _logger.debug('Registered new account', value);
          cb();
        })
        .catch(cb);
    },
    (err: any) => {
      if (err) {
        _logger.error("Error registering accounts", err);
        process.exit(-1);
        return;
      }

      _logger.debug(
        "*** DONE INITIAL DATA IMPORT ***"
      );
      process.exit(0);
    }
  );
});
