'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Directory = mongoose.model('Directory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  directory;

/**
 * Directory routes tests
 */
describe('Directory CRUD tests', function () {

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

    // Save a user to the test db and create new Directory
    user.save(function () {
      directory = {
        name: 'Directory name'
      };

      done();
    });
  });

  it('should be able to save a Directory if logged in', function (done) {
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

        // Save a new Directory
        agent.post('/api/directories')
          .send(directory)
          .expect(200)
          .end(function (directorySaveErr, directorySaveRes) {
            // Handle Directory save error
            if (directorySaveErr) {
              return done(directorySaveErr);
            }

            // Get a list of Directories
            agent.get('/api/directories')
              .end(function (directoriesGetErr, directoriesGetRes) {
                // Handle Directories save error
                if (directoriesGetErr) {
                  return done(directoriesGetErr);
                }

                // Get Directories list
                var directories = directoriesGetRes.body;

                // Set assertions
                (directories[0].user._id).should.equal(userId);
                (directories[0].name).should.match('Directory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Directory if not logged in', function (done) {
    agent.post('/api/directories')
      .send(directory)
      .expect(403)
      .end(function (directorySaveErr, directorySaveRes) {
        // Call the assertion callback
        done(directorySaveErr);
      });
  });

  it('should not be able to save an Directory if no name is provided', function (done) {
    // Invalidate name field
    directory.name = '';

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

        // Save a new Directory
        agent.post('/api/directories')
          .send(directory)
          .expect(400)
          .end(function (directorySaveErr, directorySaveRes) {
            // Set message assertion
            (directorySaveRes.body.message).should.match('Please fill Directory name');

            // Handle Directory save error
            done(directorySaveErr);
          });
      });
  });

  it('should be able to update an Directory if signed in', function (done) {
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

        // Save a new Directory
        agent.post('/api/directories')
          .send(directory)
          .expect(200)
          .end(function (directorySaveErr, directorySaveRes) {
            // Handle Directory save error
            if (directorySaveErr) {
              return done(directorySaveErr);
            }

            // Update Directory name
            directory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Directory
            agent.put('/api/directories/' + directorySaveRes.body._id)
              .send(directory)
              .expect(200)
              .end(function (directoryUpdateErr, directoryUpdateRes) {
                // Handle Directory update error
                if (directoryUpdateErr) {
                  return done(directoryUpdateErr);
                }

                // Set assertions
                (directoryUpdateRes.body._id).should.equal(directorySaveRes.body._id);
                (directoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Directories if not signed in', function (done) {
    // Create new Directory model instance
    var directoryObj = new Directory(directory);

    // Save the directory
    directoryObj.save(function () {
      // Request Directories
      request(app).get('/api/directories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Directory if not signed in', function (done) {
    // Create new Directory model instance
    var directoryObj = new Directory(directory);

    // Save the Directory
    directoryObj.save(function () {
      request(app).get('/api/directories/' + directoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', directory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Directory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/directories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Directory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Directory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Directory
    request(app).get('/api/directories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Directory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Directory if signed in', function (done) {
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

        // Save a new Directory
        agent.post('/api/directories')
          .send(directory)
          .expect(200)
          .end(function (directorySaveErr, directorySaveRes) {
            // Handle Directory save error
            if (directorySaveErr) {
              return done(directorySaveErr);
            }

            // Delete an existing Directory
            agent.delete('/api/directories/' + directorySaveRes.body._id)
              .send(directory)
              .expect(200)
              .end(function (directoryDeleteErr, directoryDeleteRes) {
                // Handle directory error error
                if (directoryDeleteErr) {
                  return done(directoryDeleteErr);
                }

                // Set assertions
                (directoryDeleteRes.body._id).should.equal(directorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Directory if not signed in', function (done) {
    // Set Directory user
    directory.user = user;

    // Create new Directory model instance
    var directoryObj = new Directory(directory);

    // Save the Directory
    directoryObj.save(function () {
      // Try deleting Directory
      request(app).delete('/api/directories/' + directoryObj._id)
        .expect(403)
        .end(function (directoryDeleteErr, directoryDeleteRes) {
          // Set message assertion
          (directoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Directory error error
          done(directoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Directory that has an orphaned user reference', function (done) {
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

          // Save a new Directory
          agent.post('/api/directories')
            .send(directory)
            .expect(200)
            .end(function (directorySaveErr, directorySaveRes) {
              // Handle Directory save error
              if (directorySaveErr) {
                return done(directorySaveErr);
              }

              // Set assertions on new Directory
              (directorySaveRes.body.name).should.equal(directory.name);
              should.exist(directorySaveRes.body.user);
              should.equal(directorySaveRes.body.user._id, orphanId);

              // force the Directory to have an orphaned user reference
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

                    // Get the Directory
                    agent.get('/api/directories/' + directorySaveRes.body._id)
                      .expect(200)
                      .end(function (directoryInfoErr, directoryInfoRes) {
                        // Handle Directory error
                        if (directoryInfoErr) {
                          return done(directoryInfoErr);
                        }

                        // Set assertions
                        (directoryInfoRes.body._id).should.equal(directorySaveRes.body._id);
                        (directoryInfoRes.body.name).should.equal(directory.name);
                        should.equal(directoryInfoRes.body.user, undefined);

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
      Directory.remove().exec(done);
    });
  });
});
