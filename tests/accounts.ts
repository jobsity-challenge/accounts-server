import "module-alias/register";
import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { HttpServer } from "../src/vendor/ikoabo/controllers/server.controller";
import { ServiceSettings } from "../src/settings/service.settings";
import AccountsRouter from "../src/routers/v1/accounts.router";
import { TokenCtrl } from '../src/controllers/tokens.controller';
import { AccountModel } from '../src/models/accounts.model';
import { TokenModel } from '../src/models/tokens.model';
import { Token } from '../src/vendor/ikoabo/utils/token.util';

chai.use(chaiHttp);
const expect = chai.expect;
const assert = chai.assert;

/* Setup http server */
HttpServer.setup(ServiceSettings);

describe('Account service testing', () => {
  it('Login account', async () => {
    await HttpServer.shared.initMongo();
    await HttpServer.shared.initExpress(null, { "/v1/accounts": AccountsRouter });
    const email = `mail${Date.now()}@example.com`;

    /* Manual create account document */
    const account = await AccountModel.create({
      "name": "Account1",
      "email": email,
      "password": "password",
      "type": 2,
    })

    /* Call login */
    const response = await chai.request(HttpServer.shared.app).post('/v1/accounts/login')
      .send({
        "email": email,
        "password": "password",
      });
    chai.expect(response.body.user).to.eql(account.id);
    chai.expect(response.body.name).to.eql(account.name);
    chai.expect(response.body.type).to.eql(account.type);
    chai.expect(response.body.roles).to.eql(['service']);
    chai.expect(response.body.token).not.to.be.empty;
    chai.expect(response.status).to.eql(200);
  }).timeout(8000);

  it('Try to register without authentication', async () => {
    await HttpServer.shared.initMongo();
    await HttpServer.shared.initExpress(null, { "/v1/accounts": AccountsRouter });
    const response = await chai.request(HttpServer.shared.app).post('/v1/accounts/register')
      .send({
        "name": "Account1",
        "email": "mail@example.com",
        "password": "password",
        "type": 2,
      });
    chai.expect(response.body.error).to.eql(1000);
    chai.expect(response.status).to.eql(401);
  }).timeout(8000);


});
