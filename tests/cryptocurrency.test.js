/**
 * @jest-environment node
 */

const request = require("supertest");

const app = require("../src/app");
const User = require("../models/user");
const Token = require("../models/token");
const Cryptocurrency = require("../models/cryptocurrency");
const { createUser } = require("./factory/user-factory");
const { createCryptocurrency } = require("./factory/cryptocurrency-factory");
const { codes, messages } = require("../config/dictionary");
const { expect } = require("@jest/globals");

let user;
const defaultPassword = "contrasena";
const defaultCryptocurrency = "bitcoin";

beforeEach(async () => {
  await User.destroy({ truncate: { cascade: true } });
  await Token.destroy({ truncate: { cascade: true } });
  await Cryptocurrency.destroy({ truncate: { cascade: true } });
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
      password: defaultPassword,
    });
    const response = await request(app)
      .get("/cryptocurrencies")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.ok);
    done();
  });

  test("Should not get cryptocurrencies for user with expired token", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: defaultPassword,
    });
    setTimeout(async () => {
      const response = await request(app)
        .get("/cryptocurrencies")
        .set("Authorization", `Bearer ${body.token}`)
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
      password: defaultPassword,
    });
    const response = await request(app)
      .post("/cryptocurrencies/assign")
      .set("Authorization", `Bearer ${body.token}`)
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
      password: defaultPassword,
    });
    const response = await request(app)
      .post("/cryptocurrencies/assign")
      .set("Authorization", `Bearer ${body.token}`)
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
      password: defaultPassword,
    });
    await createCryptocurrency(user.dataValues.id, "bitcoin");
    const response = await request(app)
      .post("/cryptocurrencies/assign")
      .set("Authorization", `Bearer ${body.token}`)
      .send({
        id: defaultCryptocurrency,
      });
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain(messages.assignedCryptocurrency);
    done();
  });

  test("Should assign cryptocurrency for authorized user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .post("/cryptocurrencies/assign")
      .set("Authorization", `Bearer ${body.token}`)
      .send({
        id: defaultCryptocurrency,
      });
    expect(response.status).toBe(codes.ok);
    expect(response.text).toContain(defaultCryptocurrency);
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
      password: defaultPassword,
    });
    await createCryptocurrency(user.dataValues.id, "bitcoin");
    await createCryptocurrency(user.dataValues.id, "ethernum");
    const response = await request(app)
      .get("/cryptocurrencies/list")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.ok);
    expect(response.text).toContain(defaultCryptocurrency);
    expect(response.text).toContain("prices");
    done();
  });

  test("Should fail for had not assigned any cryptcocurrency", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .get("/cryptocurrencies/list")
      .query({ top: 10 })
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain(messages.notAssignedCryptocurrencies);
    done();
  });

  test("Should fail for exceed top maximun", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .get("/cryptocurrencies/list")
      .query({ top: 26 })
      .set("Authorization", `Bearer ${body.token}`)
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
      password: defaultPassword,
    });
    const response = await request(app)
      .get("/cryptocurrencies/list/bitcoin")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.notFound);
    done();
  });

  test("Should get cryptocurrency for authorized user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: defaultPassword,
    });
    await createCryptocurrency(user.dataValues.id, defaultCryptocurrency);
    const response = await request(app)
      .get("/cryptocurrencies/list/bitcoin")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.ok);
    done();
  });
});

describe("DELETE assigned cryptocurrency", () => {
  test("Should not delete unassigned cryptocurrency for authenticated user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .delete("/cryptocurrencies/assign/bitcoin")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain(messages.unassignedCryptocurrency);
    done();
  });

  test("Should delete assigned cryptocurrency for authenticated user", async (done) => {
    const { body } = await request(app).post("/users/login").send({
      username: user.dataValues.username,
      password: defaultPassword,
    });
    await createCryptocurrency(user.dataValues.id, defaultCryptocurrency);
    const response = await request(app)
      .delete("/cryptocurrencies/assign/bitcoin")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.noContent);
    done();
  });
});
