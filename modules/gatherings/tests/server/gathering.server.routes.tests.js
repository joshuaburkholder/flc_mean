'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Gathering = mongoose.model('Gathering'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  gathering;

/**
 * Gathering routes tests
 */
describe('Gathering CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Gathering
    user.save(function () {
      gathering = {
        name: 'Gathering name'
      };

      done();
    });
  });

  it('should be able to save a Gathering if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Gathering
        agent.post('/api/gatherings')
          .send(gathering)
          .expect(200)
          .end(function (gatheringSaveErr, gatheringSaveRes) {
            // Handle Gathering save error
            if (gatheringSaveErr) {
              return done(gatheringSaveErr);
            }

            // Get a list of Gatherings
            agent.get('/api/gatherings')
              .end(function (gatheringsGetErr, gatheringsGetRes) {
                // Handle Gatherings save error
                if (gatheringsGetErr) {
                  return done(gatheringsGetErr);
                }

                // Get Gatherings list
                var gatherings = gatheringsGetRes.body;

                // Set assertions
                (gatherings[0].user._id).should.equal(userId);
                (gatherings[0].name).should.match('Gathering name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Gathering if not logged in', function (done) {
    agent.post('/api/gatherings')
      .send(gathering)
      .expect(403)
      .end(function (gatheringSaveErr, gatheringSaveRes) {
        // Call the assertion callback
        done(gatheringSaveErr);
      });
  });

  it('should not be able to save an Gathering if no name is provided', function (done) {
    // Invalidate name field
    gathering.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Gathering
        agent.post('/api/gatherings')
          .send(gathering)
          .expect(400)
          .end(function (gatheringSaveErr, gatheringSaveRes) {
            // Set message assertion
            (gatheringSaveRes.body.message).should.match('Please fill Gathering name');

            // Handle Gathering save error
            done(gatheringSaveErr);
          });
      });
  });

  it('should be able to update an Gathering if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Gathering
        agent.post('/api/gatherings')
          .send(gathering)
          .expect(200)
          .end(function (gatheringSaveErr, gatheringSaveRes) {
            // Handle Gathering save error
            if (gatheringSaveErr) {
              return done(gatheringSaveErr);
            }

            // Update Gathering name
            gathering.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Gathering
            agent.put('/api/gatherings/' + gatheringSaveRes.body._id)
              .send(gathering)
              .expect(200)
              .end(function (gatheringUpdateErr, gatheringUpdateRes) {
                // Handle Gathering update error
                if (gatheringUpdateErr) {
                  return done(gatheringUpdateErr);
                }

                // Set assertions
                (gatheringUpdateRes.body._id).should.equal(gatheringSaveRes.body._id);
                (gatheringUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Gatherings if not signed in', function (done) {
    // Create new Gathering model instance
    var gatheringObj = new Gathering(gathering);

    // Save the gathering
    gatheringObj.save(function () {
      // Request Gatherings
      request(app).get('/api/gatherings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Gathering if not signed in', function (done) {
    // Create new Gathering model instance
    var gatheringObj = new Gathering(gathering);

    // Save the Gathering
    gatheringObj.save(function () {
      request(app).get('/api/gatherings/' + gatheringObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', gathering.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Gathering with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/gatherings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Gathering is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Gathering which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Gathering
    request(app).get('/api/gatherings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Gathering with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Gathering if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Gathering
        agent.post('/api/gatherings')
          .send(gathering)
          .expect(200)
          .end(function (gatheringSaveErr, gatheringSaveRes) {
            // Handle Gathering save error
            if (gatheringSaveErr) {
              return done(gatheringSaveErr);
            }

            // Delete an existing Gathering
            agent.delete('/api/gatherings/' + gatheringSaveRes.body._id)
              .send(gathering)
              .expect(200)
              .end(function (gatheringDeleteErr, gatheringDeleteRes) {
                // Handle gathering error error
                if (gatheringDeleteErr) {
                  return done(gatheringDeleteErr);
                }

                // Set assertions
                (gatheringDeleteRes.body._id).should.equal(gatheringSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Gathering if not signed in', function (done) {
    // Set Gathering user
    gathering.user = user;

    // Create new Gathering model instance
    var gatheringObj = new Gathering(gathering);

    // Save the Gathering
    gatheringObj.save(function () {
      // Try deleting Gathering
      request(app).delete('/api/gatherings/' + gatheringObj._id)
        .expect(403)
        .end(function (gatheringDeleteErr, gatheringDeleteRes) {
          // Set message assertion
          (gatheringDeleteRes.body.message).should.match('User is not authorized');

          // Handle Gathering error error
          done(gatheringDeleteErr);
        });

    });
  });

  it('should be able to get a single Gathering that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Gathering
          agent.post('/api/gatherings')
            .send(gathering)
            .expect(200)
            .end(function (gatheringSaveErr, gatheringSaveRes) {
              // Handle Gathering save error
              if (gatheringSaveErr) {
                return done(gatheringSaveErr);
              }

              // Set assertions on new Gathering
              (gatheringSaveRes.body.name).should.equal(gathering.name);
              should.exist(gatheringSaveRes.body.user);
              should.equal(gatheringSaveRes.body.user._id, orphanId);

              // force the Gathering to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Gathering
                    agent.get('/api/gatherings/' + gatheringSaveRes.body._id)
                      .expect(200)
                      .end(function (gatheringInfoErr, gatheringInfoRes) {
                        // Handle Gathering error
                        if (gatheringInfoErr) {
                          return done(gatheringInfoErr);
                        }

                        // Set assertions
                        (gatheringInfoRes.body._id).should.equal(gatheringSaveRes.body._id);
                        (gatheringInfoRes.body.name).should.equal(gathering.name);
                        should.equal(gatheringInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Gathering.remove().exec(done);
    });
  });
});
