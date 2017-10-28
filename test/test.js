var app = require("./../server");
var request = require("supertest")(app);
var should = require("should");

// This agent refers to PORT where the program is running.

// var server = supertest.agent("http://localhost:8080");

// UNIT test begin

describe("SAMPLE unit test",function(){

  // #1 should return home page
  it("should return home page",function(done){
    // calling home page
    request
        .get("/")
        .expect("Content-type","application/json; charset=utf-8")
        .expect(200) // THis is HTTP response
        .end(function(err,res){
          // HTTP status should be 200
          res.status.should.equal(200);
          done();
        });
  });

});