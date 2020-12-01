/**
 * @jest-environment node
 */

const request = require("supertest");

const app = require("../src/app");
const User = require("../models/user");
const Token = require("../models/token");
const { buildUser, createUser } = require("./factory/user-factory");
const { codes, messages } = require("../config/dictionary");

let user;
const defaultPassword = "contrasena";

beforeEach(async () => {
  await User.destroy({ truncate: { cascade: true } });
  await Token.destroy({ truncate: { cascade: true } });
  user = await buildUser();
});

describe("POST new user", () => {
  test("Should sing up a new user", async (done) => {
    const response = await request(app).post("/users").send(user.dataValues);
    expect(response.status).toBe(codes.created);
    expect(response.text).toContain(user.dataValues.username);
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
      password: defaultPassword,
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
      password: defaultPassword,
    });
    expect(response.status).toBe(codes.ok);
    expect(response.text).toContain("token");
    done();
  });
});

describe("POST logout user", () => {
  test("Should fail for unautheticated user", async (done) => {
    const response = await request(app)
      .delete("/users/logout")
      .send()
      .expect(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should logout for authorized user", async (done) => {
    const newuser = await createUser();
    const { body } = await request(app).post("/users/login").send({
      username: newuser.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .delete("/users/logout")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.noContent);
    done();
  });
});

describe("POST logoutAll user'sessions", () => {
  test("Should fail for unautheticated user", async (done) => {
    const response = await request(app).delete("/users/logoutAll").send();
    expect(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should logout for authorized user", async (done) => {
    const newuser = await createUser();
    const { body } = await request(app).post("/users/login").send({
      username: newuser.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .delete("/users/logoutAll")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.noContent);
    done();
  });
});

describe("GET user profile", () => {
  test("Should fail for unautheticated user", async (done) => {
    const response = await request(app).get("/users/me").send();
    expect(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should get profile for authorized user", async (done) => {
    const newuser = await createUser();
    const { body } = await request(app).post("/users/login").send({
      username: newuser.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.ok);
    expect(response.text).toContain(newuser.username);
    done();
  });
});

describe("PATCH user profile", () => {
  test("Should fail for unautheticated user", async (done) => {
    const response = await request(app).patch("/users/me").send();
    expect(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should fail for invalid update", async (done) => {
    const newuser = await createUser();
    const { body } = await request(app).post("/users/login").send({
      username: newuser.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${body.token}`)
      .send({
        email: "",
      });
    expect(response.status).toBe(codes.badRequest);
    expect(response.text).toContain("Invalid update.");
    done();
  });

  test("Should update user profile", async (done) => {
    const newuser = await createUser();
    const { body } = await request(app).post("/users/login").send({
      username: newuser.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${body.token}`)
      .send({
        username: "estebanvega",
      });
    expect(response.status).toBe(codes.ok);
    expect(response.text).toContain("estebanvega");
    done();
  });
});

describe("DELETE user profile", () => {
  test("Should fail for unautheticated user", async (done) => {
    const response = await request(app).delete("/users/me").send();
    expect(codes.unauthorized);
    expect(response.text).toContain(messages.unauthorized);
    done();
  });

  test("Should delete user profile", async (done) => {
    const newuser = await createUser();
    const { body } = await request(app).post("/users/login").send({
      username: newuser.dataValues.username,
      password: defaultPassword,
    });
    const response = await request(app)
      .delete("/users/me")
      .set("Authorization", `Bearer ${body.token}`)
      .send();
    expect(response.status).toBe(codes.noContent);
    done();
  });
});
