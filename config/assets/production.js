'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'modules/core/client/css/cerulean/theme/bootstrap.min.css',
        'modules/core/client/css/core.css',
        'modules/core/client/css/gathering.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',        
        'modules/core/client/css/cerulean/theme/bootstrap.css',
        'modules/core/client/css/cerulean/theme/usebootstrap.css',
        'modules/core/client/css/cerulean/theme/bootstrap.min.css',

      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js'
      ]
    },
    css: 'modules/*/client/css/*.css',
  }
};
