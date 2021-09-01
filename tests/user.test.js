const request = require("supertest");
const app = require("../src/server");

jest.setTimeout(10000);

// TEST /user with validation token
describe("GET /user/create", function () {
  it("get create page", async () => {
    await request(app).get("/user/create").expect(200);
  });
});

describe("POST /user/create", function () {
  const body = {
    username: "yagura",
    email: "pipocas@gmail.com",
    password1: "123456789",
    password2: "123456789",
  };

  it("Should test user creation", function (done) {
    request(app).post("/user/create").send(body).expect(201, done);
  });

  it("Shoud test name collision", function (done) {
    body.email = "lica@gmail.com";
    request(app).post("/user/create").send(body).expect(401, done);
  });

  it("Should test email collision", function (done) {
    body.username = "Paulo";
    body.email = "pipocas@gmail.com";
    request(app).post("/user/create").send(body).expect(401, done);
  });

  it("Should test if passwords are different", function (done) {
    body.password1 = "12345987666";
    request(app).post("/user/create").send(body).expect(401, done);
  });
});

describe("POST /login", function () {
  it("Should send cookie if valide login", function (done) {
    const body = {
      username: "yagura",
      password: "123456789",
    };
    request(app)
      .post("/login")
      .send(body)
      .then((res) => {
        expect(res.status).toBe(302);
        expect(res.header).toHaveProperty("set-cookie");
        done();
      })
      .catch((err) => done(err));
  });

  it("Throw error if user not found", function (done) {
    const body = {
      username: "papafrancisco",
      password: "123456789",
    };
    request(app).post("/login").send(body).expect(401, done);
  });

  it("Throw error if password wrong", function (done) {
    const body = {
      username: "yagura",
      password: "123456799",
    };

    request(app).post("/login").send(body).expect(401, done);
  });
});

describe("GET /login", function () {
  it("Should render with no token", function (done) {
    request(app).get("/login").expect(200, done);
  });

  it("Should redirect to /user if token found", function (done) {
    request(app)
      .get("/login")
      .set("Cookie", "JWT_TOKEN=secret")
      .expect(302, done);
  });
});
