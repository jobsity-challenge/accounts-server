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
  pre
} from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { BaseModel } from "@/vendor/ikoabo/models/base.model";
import { ACCOUNT_TYPE } from "@/models/accounts.enum";
import { ACCOUNT_ERROR } from "./errors.enum";
import { HTTP_STATUS } from "@/vendor/ikoabo/middlewares/response.middleware";

@pre<Account>("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  /* Update the user crypt password */
  bcrypt.hash(this.password, 10, (err: mongoose.Error, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
})
@pre<Account>("findOneAndUpdate", function (next) {
  if (!this.getUpdate().$set["password"]) {
    next();
  }

  /* Update the user crypt password */
  bcrypt.hash(
    this.getUpdate().$set["password"],
    10,
    (err: mongoose.Error, hash) => {
      if (err) {
        return next(err);
      }
      this.getUpdate().$set["password"] = hash;
      next();
    }
  );
})
@index({ email: 1 }, { unique: true })
export class Account extends BaseModel {
  @prop({ required: true })
  name!: string;

  @prop()
  about?: string;

  @prop({ required: true, enum: ACCOUNT_TYPE, default: ACCOUNT_TYPE.AT_USER })
  type!: ACCOUNT_TYPE;

  @prop({ required: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop({ type: String })
  roles!: string[];

  /**
   * Get the mongoose data model
   */
  static get shared() {
    return getModelForClass(Account, {
      schemaOptions: {
        collection: "accounts",
        timestamps: true,
        toJSON: {
          virtuals: true,
          versionKey: false,
          transform: (_doc: any, ret: any) => {
            return {
              id: ret.id,
              name: ret.name,
              about: ret.about,
              email: ret.email,
              roles: ret.roles,
              createdAt: ret.createdAt,
            };
          },
        },
      },
      options: { automaticName: false },
    });
  }

  /**
   * Check if the given password match with the user stored password
   * 
   * @param password  Passwor to be checked
   */
  public validPassword?(password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!password || !("password" in this)) {
        reject({ boError: ACCOUNT_ERROR.ERR_INVALID_CREDENTIALS, boStatus: HTTP_STATUS.HTTP_FORBIDDEN });
      }
      bcrypt.compare(
        password,
        this.password,
        (err: mongoose.Error, isMatch: boolean) => {
          if (isMatch) {
            return resolve();
          }

          reject(err ? err : { boError: ACCOUNT_ERROR.ERR_INVALID_CREDENTIALS, boStatus: HTTP_STATUS.HTTP_FORBIDDEN });
        }
      );
    });
  }

  /**
   * Return the user roles, adding virtual roles
   */
  public getRoles?(): string[] {
    /* Make a copy of the user roles */
    const tmpRoles: string[] = Array.from(this.roles);

    /* Add virtual roles based on type of user */
    switch (this.type) {
      case ACCOUNT_TYPE.AT_USER:
        tmpRoles.push('user');
        break;
      case ACCOUNT_TYPE.AT_SERVICE:
        tmpRoles.push('service');
        break;
      case ACCOUNT_TYPE.AT_BOT:
        tmpRoles.push('bot');
        break;
    }
    return tmpRoles;
  }
}

/* Export Mongoose model */
export type AccountDocument = DocumentType<Account>;
export const AccountModel: mongoose.Model<AccountDocument> = Account.shared;
