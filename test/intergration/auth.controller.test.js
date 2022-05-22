const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const jwt = require("jsonwebtoken");
const { jwtSecretKey, logger } = require("../../src/config/config");

let database = [];

chai.should();
chai.use(chaiHttp);

describe("UC-101 login", () => {
  describe("UC-101-1 verplicht veld ontbreekt /api/auth/login ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("When a required input is missing, a valid error should be returned!", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          password: "secret",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, error } = res.body;
          status.should.equals(400);
          error.should.be
            .a("string")
            .that.equals(
              "AssertionError [ERR_ASSERTION]: email must be a string."
            );

          done();
        });
    });
  });

  describe("UC-101-2 valide email adres /api/auth/login ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("geen token mee gegeven", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          emailAdress: "hallo",
          password: "Iseen1",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be.a("string").that.equals("email invalid");

          done();
        });
    });
  });

  describe("UC-101-3 niet valide email /api/auth/login", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("json met foutmelding", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          emailAdress: "Valide@email.com",
          password: "w",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be.a("string").that.equals("password invalid");

          done();
        });
    });
  });
  describe("UC-101-4 gebruiker bestaat niet /api/auth/login", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("json met foutmelding", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          emailAdress: "email@hotmail.nl",
          password: "Iseen1",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(404);
          message.should.be
            .a("string")
            .that.equals("User not found or password invalid");

          done();
        });
    });
    describe("UC-101-5 gebruiker succesvol ingelogd /api/auth/login", () => {
      beforeEach((done) => {
        database = [];
        done();
      });

      it("json met foutmelding", (done) => {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({
            emailAdress: "email@hotmail.com",
            password: "Iseen1",
          })
          .end((err, res) => {
            res.should.be.an("object");
            let { statusCode, results } = res.body;
            statusCode.should.equals(200);
            results.id.should.be.a("number").that.equals(1);

            done();
          });
      });
    });
  });
});
