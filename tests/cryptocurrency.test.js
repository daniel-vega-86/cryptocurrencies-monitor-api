/**
 * @jest-environment node
 */

const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/user");
const Token = require("../src/models/token");
const Cryptocurrency = require("../src/models/cryptocurrency");
const { createUser } = require("./factory/user-factory");
const { createCryptocurrency } = require("./factory/cryptocurrency-factory");
const { codes, messages } = require("../config/dictionary");

let user;

beforeEach(async () => {
  await User.destroy({ truncate: true });
  await Token.destroy({ truncate: true });
  await Cryptocurrency.destroy({ truncate: true });
  user = await createUser();
});

describe("GET Cryptocurrencies", () => {
  test("Should no get cryptocurrencies for unauthorized user", async (done) => {
    const response = await request(app).get("/cryptocurrencies").send();
    expect(response.status).toBe(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should get cryptocurrencies for authorized user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .get("/cryptocurrencies")
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.ok);
    done();
  });

  test("Should not get cryptocurrencies for user with expired token", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    setTimeout(async () => {
      const response = await request(app)
        .get("/cryptocurrencies")
        .set("Authorization", body.token)
        .send();
      expect(response.status).toBe(codes.unauthorized);
      done();
    }, 3000);
  });
});

describe("POST assign cryptocurrencies", () => {
  test("Should fail for unauthorized user", async (done) => {
    const response = await request(app).post("/cryptocurrencies/assign").send();
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
      .post("/cryptocurrencies/assign")
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
      .post("/cryptocurrencies/assign")
      .set("Authorization", body.token)
      .send({
        id: "bircoin",
      });
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain(messages.invalidCryptocurrency);
    done();
  });

  test("Should fail for cryptocurrency already assigned", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    await createCryptocurrency(user.dataValues.id, "bitcoin");
    const response = await request(app)
      .post("/cryptocurrencies/assign")
      .set("Authorization", body.token)
      .send({
        id: "bitcoin",
      });
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain(messages.assignedCryptocurrency);
    done();
  });

  test("Should assign cryptocurrency for authorized user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .post("/cryptocurrencies/assign")
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
    const response = await request(app).get("/cryptocurrencies/list").send();
    expect(response.status).toBe(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should list cryptocurrency for authorized user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    await createCryptocurrency(user.dataValues.id, "bitcoin");
    await createCryptocurrency(user.dataValues.id, "ethernum");
    const response = await request(app)
      .get("/cryptocurrencies/list")
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.ok);
    expect(response.text).toContain("bitcoin");
    expect(response.text).toContain("prices");
    done();
  });

  test("Should fail for exceed top maximun", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .get("/cryptocurrencies/list")
      .query({ top: 26 })
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain("maximun");
    done();
  });
});

describe("GET Cryptocurrency", () => {
  test("Should no get cryptocurrency for unauthorized user", async (done) => {
    const response = await request(app)
      .get("/cryptocurrencies/list/bitcoin")
      .send();
    expect(response.status).toBe(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should not get unassigned cryptocurrency", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .get("/cryptocurrencies/list/bitcoin")
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.badRequest);
    done();
  });

  test("Should get cryptocurrency for authorized user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    await createCryptocurrency(user.dataValues.id, "bitcoin");
    const response = await request(app)
      .get("/cryptocurrencies/list/bitcoin")
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.ok);
    done();
  });
});

describe("DELETE assigned cryptocurrency", () => {
  test("Should delete assigned cryptocurrency for authenticated user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: "contrasena",
    });
    await createCryptocurrency(user.dataValues.id, "bitcoin");
    const response = await request(app)
      .delete("/cryptocurrencies/assign/bitcoin")
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.noContent);
    done();
  });
});
