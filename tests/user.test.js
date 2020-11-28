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
