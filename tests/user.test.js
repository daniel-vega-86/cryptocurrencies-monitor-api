/**
 * @jest-environment node
 */

const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/user");
const Token = require("../src/models/token");
const { buildUser, createUser } = require("./factory/user-factory");
const { codes, messages } = require("../config/dictionary");

let user;

beforeEach(async () => {
  await User.destroy({ truncate: true });
  await Token.destroy({ truncate: true });
  user = await buildUser();
});

describe("POST new user", () => {
  test("Should sing up a new user", async (done) => {
    const response = await request(app).post("/users").send(user.dataValues);
    expect(response.status).toBe(codes.created);
    expecte().toBeThu;
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

describe("POST logout user", () => {
  test("Should fail for unautheticated user", async (done) => {
    const response = await request(app)
      .post("/users/logout")
      .send()
      .expect(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should logout for authorized user", async (done) => {
    const newuser = await createUser();
    const { body } = await request(app).post("/users/login").send({
      username: newuser.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .post("/users/logout")
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.noContent);
    done();
  });
});

describe("POST logoutAll user'sessions", () => {
  test("Should fail for unautheticated user", async (done) => {
    const response = await request(app)
      .post("/users/logoutAll")
      .send()
      .expect(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should logout for authorized user", async (done) => {
    const newuser = await createUser();
    const { body } = await request(app).post("/users/login").send({
      username: newuser.dataValues.username,
      password: "contrasena",
    });
    const response = await request(app)
      .post("/users/logoutAll")
      .set("Authorization", body.token)
      .send();
    expect(response.status).toBe(codes.noContent);
    done();
  });
});
