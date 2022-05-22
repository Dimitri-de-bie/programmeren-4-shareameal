const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const jwt = require("jsonwebtoken");
const { jwtSecretKey, logger } = require("../../src/config/config");

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
  describe("UC-201-2 niet valide email adress /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("email niet valide json", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          password: "Iseen1",
          street: "straat",
          city: "stad",
          emailAdress: "test",
          phoneNumber: "0612345678",
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
  describe("UC-201-3 niet valide password /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("password niet valide json", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          password: "test",
          street: "straat",
          city: "stad",
          emailAdress: "test@test.com",
          phoneNumber: "0612345678",
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
  describe("UC-201-4 email/gebruiker already exists /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("When a email already exists a correct error should be shown!", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          password: "Iseen1",
          street: "straat",
          city: "stad",
          emailAdress: "j.doe@server.com",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(409);
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
          password: "Iseen1",
          street: "straat",
          city: "stad",
          emailAdress: "test@test.com",
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
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { results, statusCode } = res.body;
          statusCode.should.equals(200);
          results.should.be.a("array");
          done();
        });
    });
  });
  describe("UC-202-3 toon alle users met niet bestaande naam hebben /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("alle user met niet bestaande naam worden getoont ", (done) => {
      chai
        .request(server)
        .get("/api/user?name=z")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { results, statusCode } = res.body;
          statusCode.should.equals(200);
          results.should.be.a("array");
          done();
        });
    });
  });

  describe("UC-202-4 toon alle users die active zijn /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("alle active users worden getoont", (done) => {
      chai
        .request(server)
        .get("/api/user?isActive=true")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { results, statusCode } = res.body;
          statusCode.should.equals(200);
          results.should.be.a("array");
          done();
        });
    });
  });
  describe("UC-202-5 toon alle users die niet active zijn /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("alle nniet active users worden getoont", (done) => {
      chai
        .request(server)
        .get("/api/user?isActive=false")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { results, statusCode } = res.body;
          statusCode.should.equals(200);
          results.should.be.a("array");
          done();
        });
    });
  });
  describe("UC-202-6 toon alle users die de letter h hebben /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("alle user met H worden getoont ", (done) => {
      chai
        .request(server)
        .get("/api/user?name=h")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
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
describe("UC-203 userprofiel", () => {
  describe("UC-203-1 niet bestaande token /api/user", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("Er moet een fout code gegeven worden", (done) => {
      chai
        .request(server)
        .get("/api/user/profile")
        .set("authorization", "Bearer 99999")

        .end((err, res) => {
          res.should.be.an("object");
          let { status, error } = res.body;
          status.should.equals(401);
          error.should.be.a("string").that.equals("Not authorized");

          done();
        });
    });
  });
  describe("UC-203-2 succesvol opgehaald", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("hij word succesvol opgehaald", (done) => {
      chai
        .request(server)
        .get("/api/user/profile")
        .set("authorization", "Bearer " + jwt.sign({ userId: 6 }, jwtSecretKey))

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
describe("UC-204 details van gebruiker", () => {
  describe("UC-204-1 niet bestaande token /api/user", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("Er moet een fout code gegeven worden", (done) => {
      chai
        .request(server)
        .get("/api/user/profile")
        .set("authorization", "Bearer 99999")

        .end((err, res) => {
          res.should.be.an("object");
          let { status, error } = res.body;
          status.should.equals(401);
          error.should.be.a("string").that.equals("Not authorized");

          done();
        });
    });
  });
  describe("UC-204-2 gebruikerid bestaat niet /api/user", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("error krijgen dat id niet gevonden kan worden", (done) => {
      chai
        .request(server)
        .get("/api/user/9999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(404);
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
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))
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
  describe("UC-205-1 email mist /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("error dat het email mist", (done) => {
      chai
        .request(server)
        .post("/api/user/1")
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be.a("string").that.equals("emailadress ontbreekt");
          done();
        });
    });
  });
  describe("UC-205-3 nonvalide telefoonnummer /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("succes wanner succesvol gewijzigt", (done) => {
      chai
        .request(server)
        .post("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ userId: 6 }, jwtSecretKey))
        .send({
          firstName: "voornaam",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "nieuwemaidal",
          phoneNumber: "061",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be
            .a("string")
            .that.equals("niet valide telefoonnummer");
          done();
        });
    });
  });
  describe("UC-205-4 gebruikerid bestaat niet /api/user", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("error krijgen dat id niet gevonden kan worden", (done) => {
      chai
        .request(server)
        .post("/api/user/9999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be
            .a("string")
            .that.equals("User with ID 9999 not found");
          done();
        });
    });
  });
  describe("UC-205-5 niet ingelogd /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("niet ingelogd", (done) => {
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
          let { status, error } = res.body;
          status.should.equals(401);
          error.should.be
            .a("string")
            .that.equals("Authorization header missing!");
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
        .set("authorization", "Bearer " + jwt.sign({ userId: 6 }, jwtSecretKey))
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
          status.should.equals(200);
          result.should.be
            .a("string")
            .that.equals("User with ID 6 succesfully changed");
          done();
        });
    });
  });
});
describe("UC-206 delete a user", () => {
  describe("UC-206-1 gebruiker bestaat niet /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("gebruiker bestaat niet error", (done) => {
      chai
        .request(server)
        .delete("/api/user/99999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be
            .a("string")
            .that.equals("User with ID 99999 not found!");
          done();
        });
    });
  });

  describe("UC-206-2 niet ingelogd /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("niet ingelogd", (done) => {
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
          let { status, error } = res.body;
          status.should.equals(401);
          error.should.be
            .a("string")
            .that.equals("Authorization header missing!");
          done();
        });
    });
  });

  describe("UC-206-3 not owned user /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("wanneer een get word gedaan moet er alle users getoont worden", (done) => {
      chai
        .request(server)
        .delete("/api/user/7")
        .set("authorization", "Bearer " + jwt.sign({ userId: 6 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(403);
          result.should.be
            .a("string")
            .that.equals("geen toegang om deze te verwijderen");
          done();
        });
    });
  });

  describe("UC-206-4 delete user /api/user ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("wanneer een get word gedaan moet er alle users getoont worden", (done) => {
      chai
        .request(server)
        .delete("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ userId: 6 }, jwtSecretKey))
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
});
