const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");

let database = [];

chai.should();
chai.use(chaiHttp);

describe("UC-201 Registreren als nieuwe gebruiker", () => {
  describe("UC-201-1 verplicht veld ontbreekt /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("When a required input is missing, a valid error should be returned!", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          //Firstname is missing
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "email@hotmail.com",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be
            .a("string")
            .that.equals("Firstname must be a string");

          done();
        });
    });
  });

  describe("UC-201-2 email already exists /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("When a email already exists a correct error should be shown!", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "j.doe@server.com",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(401);
          result.should.be.a("string").that.equals("email bestaat al");

          done();
        });
    });
  });

  describe("UC-201-5 succesvol geregistreerd add users /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("gebruiker succesvol geregistreerd", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          isActive: "",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "dkangnawk",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(201);
          result.should.be
            .a("string")
            .that.equals("User has been succesfully added");

          done();
        });
    });
  });
});

describe("UC-202 overzicht van gebruikers", () => {
  describe("UC-202-1 toon alle users /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("wanneer een get word gedaan moet er alle users getoont worden", (done) => {
      chai
        .request(server)
        .get("/api/user")
        .end((err, res) => {
          res.should.be.an("object");
          let { results, statusCode } = res.body;
          statusCode.should.equals(200);
          results.should.be.a("array");
          done();
        });
    });
  });
});
describe("UC-204 details van gebruiker", () => {
  describe("UC-204-1 gebruikerid bestaat niet /api/user", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("error krijgen dat id niet gevonden kan worden", (done) => {
      chai
        .request(server)
        .get("/api/user/9999")
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(401);
          result.should.be
            .a("string")
            .that.equals("User with ID 9999 not found");
          done();
        });
    });
  });

  describe("UC-204-3 gebruiker bestaat /api/user", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("succes melding vertonen", (done) => {
      chai
        .request(server)
        .get("/api/user/1")
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(200);
          result.should.be.a("array");
          done();
        });
    });
  });
});
describe("UC-205 gebruiker wijzigen", () => {
  describe("UC-205-1 email bestaat al /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("error dat het email al bestaat", (done) => {
      chai
        .request(server)
        .post("/api/user/1")
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "j.doe@server.com",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(401);
          result.should.be.a("string").that.equals("Email already exists");
          done();
        });
    });
  });

  describe("UC-205-6 succesvol gewijzigd /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("succes wanner succesvol gewijzigt", (done) => {
      chai
        .request(server)
        .post("/api/user/6")
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "nieuwemaidal",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(201);
          result.should.be
            .a("string")
            .that.equals("User with ID 6 succesfully changed");
          done();
        });
    });
  });
  describe("UC-205-4 gebruiker bestaat niet /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("gebruiker bestaat niet error", (done) => {
      chai
        .request(server)
        .post("/api/user/99999")
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "nieuwemail",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(401);
          result.should.be
            .a("string")
            .that.equals("User with ID 99999 not found");
          done();
        });
    });
  });
});
describe("UC-206 delete a user", () => {
  describe("UC-206-1 delete user /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("wanneer een get word gedaan moet er alle users getoont worden", (done) => {
      chai
        .request(server)
        .delete("/api/user/6")
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(200);
          result.should.be
            .a("string")
            .that.equals("User with ID has been deleted!");
          done();
        });
    });
  });
  describe("UC-206-1 gebruiker bestaat niet /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("gebruiker bestaat niet error", (done) => {
      chai
        .request(server)
        .delete("/api/user/99999")
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(401);
          result.should.be
            .a("string")
            .that.equals("User with ID 99999 not found!");
          done();
        });
    });
  });
});
