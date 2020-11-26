/**
 * @jest-environment node
 */

const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/user");
const { buildUser, createUser } = require("./factory/user-factory");
const { codes, messages } = require("../config/dictionary");
const { expect } = require("@jest/globals");

let user;

beforeEach(async () => {
  await User.destroy({ truncate: true });
  user = await buildUser();
});

describe("POST new user", () => {
  test("Should sing up a new user", async (done) => {
    const response = await request(app).post("/users").send(user.dataValues);
    expect(response.status).toBe(codes.created);
    done();
  });

  test("Should fail for invalid password", async (done) => {
    const userWrongPassword = {
      ...user.dataValues,
      password: "ab*",
    };
    const response = await request(app).post("/users").send(userWrongPassword);
    expect(response.status).toBe(codes.conflict);
    expect(response.text).toContain(messages.alphaPass);
    done();
  });

  test("Should fail for empty values", async (done) => {
    const response = await request(app).post("/users").send({});
    expect(response.status).toBe(codes.conflict);
    expect(response.text).toContain("empty");
    done();
  });

  test("Should fail for username in use", async (done) => {
    await createUser();
    const response = await request(app).post("/users").send(user.dataValues);
    expect(response.status).toBe(codes.conflict);
    expect(response.text).toContain(messages.usernameInUse);
    done();
  });
});

describe("POST login user", () => {
  test("Should not login nonexistent user", async (done) => {
    const response = await request(app).post("/users/login").send({
      username: "esteban",
      password: "1234",
    });
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain(messages.invalidUser);
    done();
  });

  test("Should not login empty params", async (done) => {
    await request(app)
      .post("/users/login")
      .send({
        username: "",
        password: "",
      })
      .expect(codes.badRequest);
    done();
  });

  test("Should not login user with wrong password", async (done) => {
    const newUser = await createUser();
    const response = await request(app).post("/users/login").send({
      username: newUser.dataValues.username,
      password: "as",
    });
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain(messages.invalidPass);
    done();
  });

  test("Should login user", async (done) => {
    const newUser = await createUser();
    const response = await request(app).post("/users/login").send({
      username: newUser.dataValues.username,
      password: "contrasena",
    });
    expect(response.status).toBe(codes.ok);
    expect(response.text).toContain("token");
    done();
  });
});
