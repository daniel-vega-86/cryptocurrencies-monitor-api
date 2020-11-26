/**
 * @jest-environment node
 */

const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/user");
const Token = require("../src/models/token");
const { createUser } = require("./factory/user-factory");
const { codes, messages } = require("../config/dictionary");

let user;

beforeEach(async () => {
  await User.destroy({ truncate: true });
  await Token.destroy({ truncate: true });
  user = await createUser();
});

describe("GET Cryptocoins", () => {
  test("Should no get coins for unauthorized user", async (done) => {
    const response = await request(app).get("/cryptocoins").send();
    expect(response.status).toBe(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should get coins for unauthorized user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .get("/cryptocoins")
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.ok);
    done();
  });
});
