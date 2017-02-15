'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Potluck = mongoose.model('Potluck'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  potluck;

/**
 * Potluck routes tests
 */
describe('Potluck CRUD tests', function () {

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

    // Save a user to the test db and create new Potluck
    user.save(function () {
      potluck = {
        name: 'Potluck name'
      };

      done();
    });
  });

  it('should be able to save a Potluck if logged in', function (done) {
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

        // Save a new Potluck
        agent.post('/api/potlucks')
          .send(potluck)
          .expect(200)
          .end(function (potluckSaveErr, potluckSaveRes) {
            // Handle Potluck save error
            if (potluckSaveErr) {
              return done(potluckSaveErr);
            }

            // Get a list of Potlucks
            agent.get('/api/potlucks')
              .end(function (potlucksGetErr, potlucksGetRes) {
                // Handle Potlucks save error
                if (potlucksGetErr) {
                  return done(potlucksGetErr);
                }

                // Get Potlucks list
                var potlucks = potlucksGetRes.body;

                // Set assertions
                (potlucks[0].user._id).should.equal(userId);
                (potlucks[0].name).should.match('Potluck name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Potluck if not logged in', function (done) {
    agent.post('/api/potlucks')
      .send(potluck)
      .expect(403)
      .end(function (potluckSaveErr, potluckSaveRes) {
        // Call the assertion callback
        done(potluckSaveErr);
      });
  });

  it('should not be able to save an Potluck if no name is provided', function (done) {
    // Invalidate name field
    potluck.name = '';

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

        // Save a new Potluck
        agent.post('/api/potlucks')
          .send(potluck)
          .expect(400)
          .end(function (potluckSaveErr, potluckSaveRes) {
            // Set message assertion
            (potluckSaveRes.body.message).should.match('Please fill Potluck name');

            // Handle Potluck save error
            done(potluckSaveErr);
          });
      });
  });

  it('should be able to update an Potluck if signed in', function (done) {
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

        // Save a new Potluck
        agent.post('/api/potlucks')
          .send(potluck)
          .expect(200)
          .end(function (potluckSaveErr, potluckSaveRes) {
            // Handle Potluck save error
            if (potluckSaveErr) {
              return done(potluckSaveErr);
            }

            // Update Potluck name
            potluck.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Potluck
            agent.put('/api/potlucks/' + potluckSaveRes.body._id)
              .send(potluck)
              .expect(200)
              .end(function (potluckUpdateErr, potluckUpdateRes) {
                // Handle Potluck update error
                if (potluckUpdateErr) {
                  return done(potluckUpdateErr);
                }

                // Set assertions
                (potluckUpdateRes.body._id).should.equal(potluckSaveRes.body._id);
                (potluckUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Potlucks if not signed in', function (done) {
    // Create new Potluck model instance
    var potluckObj = new Potluck(potluck);

    // Save the potluck
    potluckObj.save(function () {
      // Request Potlucks
      request(app).get('/api/potlucks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Potluck if not signed in', function (done) {
    // Create new Potluck model instance
    var potluckObj = new Potluck(potluck);

    // Save the Potluck
    potluckObj.save(function () {
      request(app).get('/api/potlucks/' + potluckObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', potluck.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Potluck with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/potlucks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Potluck is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Potluck which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Potluck
    request(app).get('/api/potlucks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Potluck with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Potluck if signed in', function (done) {
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

        // Save a new Potluck
        agent.post('/api/potlucks')
          .send(potluck)
          .expect(200)
          .end(function (potluckSaveErr, potluckSaveRes) {
            // Handle Potluck save error
            if (potluckSaveErr) {
              return done(potluckSaveErr);
            }

            // Delete an existing Potluck
            agent.delete('/api/potlucks/' + potluckSaveRes.body._id)
              .send(potluck)
              .expect(200)
              .end(function (potluckDeleteErr, potluckDeleteRes) {
                // Handle potluck error error
                if (potluckDeleteErr) {
                  return done(potluckDeleteErr);
                }

                // Set assertions
                (potluckDeleteRes.body._id).should.equal(potluckSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Potluck if not signed in', function (done) {
    // Set Potluck user
    potluck.user = user;

    // Create new Potluck model instance
    var potluckObj = new Potluck(potluck);

    // Save the Potluck
    potluckObj.save(function () {
      // Try deleting Potluck
      request(app).delete('/api/potlucks/' + potluckObj._id)
        .expect(403)
        .end(function (potluckDeleteErr, potluckDeleteRes) {
          // Set message assertion
          (potluckDeleteRes.body.message).should.match('User is not authorized');

          // Handle Potluck error error
          done(potluckDeleteErr);
        });

    });
  });

  it('should be able to get a single Potluck that has an orphaned user reference', function (done) {
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

          // Save a new Potluck
          agent.post('/api/potlucks')
            .send(potluck)
            .expect(200)
            .end(function (potluckSaveErr, potluckSaveRes) {
              // Handle Potluck save error
              if (potluckSaveErr) {
                return done(potluckSaveErr);
              }

              // Set assertions on new Potluck
              (potluckSaveRes.body.name).should.equal(potluck.name);
              should.exist(potluckSaveRes.body.user);
              should.equal(potluckSaveRes.body.user._id, orphanId);

              // force the Potluck to have an orphaned user reference
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

                    // Get the Potluck
                    agent.get('/api/potlucks/' + potluckSaveRes.body._id)
                      .expect(200)
                      .end(function (potluckInfoErr, potluckInfoRes) {
                        // Handle Potluck error
                        if (potluckInfoErr) {
                          return done(potluckInfoErr);
                        }

                        // Set assertions
                        (potluckInfoRes.body._id).should.equal(potluckSaveRes.body._id);
                        (potluckInfoRes.body.name).should.equal(potluck.name);
                        should.equal(potluckInfoRes.body.user, undefined);

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
      Potluck.remove().exec(done);
    });
  });
});
