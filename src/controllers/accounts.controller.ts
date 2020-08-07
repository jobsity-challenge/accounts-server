/**
 * Copyright (C) 2020 IKOA Business Opportunity
 * All Rights Reserved
 * Author: Reinier Millo Sánchez <reinier.millo88@gmail.com>
 *
 * This file is part of the JobSity Challenge.
 * It can't be copied and/or distributed without the express
 * permission of the author.
 */
import { CRUD } from "@/vendor/ikoabo/controllers/crud.controller";
import { AccountDocument, Account, AccountModel } from "@/models/accounts.model";

/**
 * Accounts CRUD controller
 */
class Accounts extends CRUD<Account, AccountDocument>{
  private static _instance: Accounts;

  /**
   * Private constructor to allow singleton class instance
   */
  private constructor() {
    super('Accounts', AccountModel);
  }

  /**
   * Get the singleton class instance
   */
  public static get shared(): Accounts {
    if (!Accounts._instance) {
      Accounts._instance = new Accounts();
    }
    return Accounts._instance;
  }
}

export const AccountCtrl = Accounts.shared;
