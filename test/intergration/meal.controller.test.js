const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const jwt = require("jsonwebtoken");
const { jwtSecretKey, logger } = require("../../src/config/config");

let database = [];

chai.should();
chai.use(chaiHttp);

describe("UC-301 maaltijd aanmaken", () => {
  describe("UC-301-1 verplicht veld ontbreekt /api/meal ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("When a required input is missing, a valid error should be returned!", (done) => {
      chai
        .request(server)
        .post("/api/meal")
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))
        .send({
          // isVega: 1,
          // is vega ontbreekt
          isVegan: 1,
          isToTakeHome: 1,
          maxAmountOfParticipants: 4,
          price: 10.69,
          imageUrl: "test",
          name: "name",
          description: "testde",
          allergenes: "1",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be.a("string").that.equals("isVega must be a int");

          done();
        });
    });
  });

  describe("UC-301-2 niet ingelogd /api/meal ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("geen token mee gegeven", (done) => {
      chai
        .request(server)
        .post("/api/meal")
        .send({
          isVega: 1,
          isVegan: 1,
          isToTakeHome: 1,
          maxAmountOfParticipants: 4,
          price: 10.69,
          imageUrl: "test",
          name: "name",
          description: "testde",
          allergenes: "1",
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

  describe("UC-301-3 succesvol geregistreerd /api/meal ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("succesvol geregistreed", (done) => {
      chai
        .request(server)
        .post("/api/meal")
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))
        .send({
          isVega: 1,
          isVegan: 1,
          isToTakeHome: 1,
          dateTime: "2022-05-21 16:34:02",
          maxAmountOfParticipants: 4,
          price: 10.69,
          imageUrl: "test",
          name: "name",
          description: "testde",
          allergenes: "1",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(201);
          result.should.be
            .a("string")
            .that.equals("meal has been succesfully added");

          done();
        });
    });
  });
});
describe("UC-303 lijst van maaltijden opvragen", () => {
  describe("UC-303-1 Lijst van maaltijden geretourneerd /api/meal ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("Response bevat JSON object met een lijst met nul of meer maaltijden", (done) => {
      chai
        .request(server)
        .get("/api/meal")
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
describe("UC-304 details van een maaltijd opvragen", () => {
  describe("UC-304-1 maaltijd bestaat niet /api/meal/9999", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("response bevat json object met daarin generieke foutinformatie", (done) => {
      chai
        .request(server)
        .get("/api/meal/9999")
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(404);
          result.should.be
            .a("string")
            .that.equals("meal with ID 9999 not found");
          done();
        });
    });
  });

  describe("UC-304-2 details van maaltijd geretourneerd /api/meal/1", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("succes melding vertonen", (done) => {
      chai
        .request(server)
        .get("/api/meal/1")
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
describe("UC-305 maaltijd verwijderen", () => {
  describe("UC-305-2 niet ingelogd /api/meal ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("maaltidj is niet verwijderd, Response bevat json object met  daarin generieke foutinformatie", (done) => {
      chai
        .request(server)
        .delete("/api/meal/7")
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

  describe("UC-305-3 niet de eigenaar van de data /api/meal ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("maaltijd niet verwijderen, json met error", (done) => {
      chai
        .request(server)
        .delete("/api/meal/2")
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))
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
  describe("UC-305-4 maaltijd bestaat niet /api/meal ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("maaltijd niet verwijderen, json met error", (done) => {
      chai
        .request(server)
        .delete("/api/meal/655")
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(404);
          result.should.be
            .a("string")
            .that.equals("meal with ID 655 not found!");

          done();
        });
    });
  });
  describe("UC-305-5 succesvol verwijderd /api/meal ", () => {
    beforeEach((done) => {
      database = [];
      done();
    });

    it("maaltijd niet verwijderen, json met error", (done) => {
      chai
        .request(server)
        .delete("/api/meal/6")
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(200);
          result.should.be
            .a("string")
            .that.equals("meal with ID 6 has been deleted!");

          done();
        });
    });
  });
});
