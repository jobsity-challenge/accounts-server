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
import { Token, TokenDocument, TokenModel } from "@/models/tokens.model";

/**
 * Tokens CRUD controller
 */
class Tokens extends CRUD<Token, TokenDocument>{
  private static _instance: Tokens;

  /**
   * Private constructor to allow singleton class instance
   */
  private constructor() {
    super('Tokens', TokenModel);
  }

  /**
   * Get the singleton class instance
   */
  public static get shared(): Tokens {
    if (!Tokens._instance) {
      Tokens._instance = new Tokens();
    }
    return Tokens._instance;
  }
}

export const TokenCtrl = Tokens.shared;
