/**
* Copyright (C) 2020 IKOA Business Opportunity
* All Rights Reserved
* Author: Reinier Millo Sánchez <reinier.millo88@gmail.com>
*
* This file is part of the JobSity Challenge.
* It can't be copied and/or distributed without the express
* permission of the author.
*/
import {
  prop,
  getModelForClass,
  DocumentType,
  index,
  Ref
} from "@typegoose/typegoose";
import mongoose from "mongoose";
import { BaseModel } from "@/vendor/ikoabo/models/base.model";
import { Account } from "./accounts.model";

@index({ token: 1 })
@index({ account: 1 })
export class Token extends BaseModel {
  @prop({ required: true })
  token!: string;

  @prop({ required: true, ref: Account })
  account!: Ref<Account>;

  /**
   * Get the mongoose data model
   */
  static get shared() {
    return getModelForClass(Token, {
      schemaOptions: {
        collection: "tokens",
        timestamps: true,
        toJSON: {
          virtuals: true,
          versionKey: false,
          transform: (_doc: any, ret: any) => {
            return {
              id: ret.id,
              token: ret.token,
              account: ret.account,
              createdAt: ret.createdAt,
            };
          },
        },
      },
      options: { automaticName: false },
    });
  }
}

/* Export Mongoose model */
export type TokenDocument = DocumentType<Token>;
export const TokenModel: mongoose.Model<TokenDocument> = Token.shared;
