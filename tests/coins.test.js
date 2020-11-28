/**
 * @jest-environment node
 */

const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/user");
const Token = require("../src/models/token");
const Coin = require("../src/models/coins");
const { createUser } = require("./factory/user-factory");
const { createCoin } = require("./factory/coin-factory");
const { codes, messages } = require("../config/dictionary");

let user;

beforeEach(async () => {
  await User.destroy({ truncate: true });
  await Token.destroy({ truncate: true });
  await Coin.destroy({ truncate: true });
  user = await createUser();
});

describe("GET Cryptocoins", () => {
  test("Should no get coins for unauthorized user", async (done) => {
    const response = await request(app).get("/cryptocoins").send();
    expect(response.status).toBe(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should get coins for authorized user", async (done) => {
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

  test("Should not get coins for user with expired token", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    setTimeout(async () => {
      const response = await request(app)
        .get("/cryptocoins")
        .set("Authorization", body.token)
        .send();
      expect(response.status).toBe(codes.unauthorized);
      done();
    }, 3000);
  });
});

describe("POST assign cryptocoin", () => {
  test("Should fail for unauthorized user", async (done) => {
    const response = await request(app).post("/cryptocoins/assign").send();
    expect(response.status).toBe(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should fail for empty value", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .post("/cryptocoins/assign")
      .set("Authorization", body.token)
      .send({
        id: "",
      });
    expect(response.status).toBe(codes.conflict);
    expect(response.text).toContain("empty");
    done();
  });

  test("Should fail for invalid value", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .post("/cryptocoins/assign")
      .set("Authorization", body.token)
      .send({
        id: "bircoin",
      });
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain(messages.invalidCoin);
    done();
  });

  test("Should fail for cryptocurrency already assigned", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    await createCoin(user.dataValues.id, "bitcoin");
    const response = await request(app)
      .post("/cryptocoins/assign")
      .set("Authorization", body.token)
      .send({
        id: "bitcoin",
      });
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain(messages.assignedCoin);
    done();
  });

  test("Should assign cryptocurrency for authorized user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .post("/cryptocoins/assign")
      .set("Authorization", body.token)
      .send({
        id: "bitcoin",
      });
    expect(response.status).toBe(codes.ok);
    expect(response.text).toContain("bitcoin");
    done();
  });
});

describe("GET user cryptocurrencies", () => {
  test("Should fail for unauthorized user", async (done) => {
    const response = await request(app).get("/cryptocoins/list").send();
    expect(response.status).toBe(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should list cryptocurrency for authorized user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    await createCoin(user.dataValues.id, "bitcoin");
    await createCoin(user.dataValues.id, "ethernum");
    const response = await request(app)
      .get("/cryptocoins/list")
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.ok);
    expect(response.text).toContain("bitcoin");
    expect(response.text).toContain("prices");
    done();
  });

  test("Should fail for excced top maximun", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .get("/cryptocoins/list")
      .query({ top: 26 })
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain("maximun");
    done();
  });
});
