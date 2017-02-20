'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'modules/core/client/css/cerulean/theme/bootstrap.css',
        'modules/core/client/css/cerulean/theme/usebootstrap.css',
        'modules/core/client/css/cerulean/theme/bootstrap.min.css',
        'modules/core/client/css/core.css',
        'modules/core/client/css/gathering.css',
        'public/lib/bootstrap/dist/css/bootstrap.css'
      ],
      js: [
        'modules/core/client/css/cerulean/bootstrap/bootstrap.min.js',
        'modules/core/client/css/cerulean/bootstrap/html5shiv.js',
        'modules/core/client/css/cerulean/bootstrap/respond.min.js',
        'modules/core/client/css/cerulean/bootstrap/usebootstrap.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js'
      ],
      less: [
        'modules/core/client/css/cerulean/theme/usebootstrap.less',
        'modules/core/client/css/cerulean/theme/variables.less'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
