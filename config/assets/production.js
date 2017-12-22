'use strict';

module.exports = {
  //client: {
  //  lib: {
  //    css: [
  //      'public/lib/bootstrap/dist/css/bootstrap.css',
  //      'public/lib/bootstrap/dist/css/bootstrap-theme.css',
  //      'public/lib/angular-google-places-autocomplete/dist/autocomplete.min.css',
  //      'public/lib/angular-bootstrap-datetimepicker/src/css/datetimepicker.css',
  //      'public/lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css'
  //    ],
  //    js: [
  //      'public/lib/jquery/dist/jquery.min.js',
  //      'public/lib/bootstrap/dist/js/bootstrap.min.js',
  //      'public/lib/angular/angular.js',
  //      'public/lib/angular-resource/angular-resource.js',
  //      'public/lib/angular-animate/angular-animate.js',
  //      'public/lib/angular-messages/angular-messages.js',
  //      'public/lib/angular-ui-router/release/angular-ui-router.js',
  //      'public/lib/angular-ui-utils/ui-utils.js',
  //      'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
  //      'public/lib/angular-file-upload/angular-file-upload.js',
  //      'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
  //      'public/lib/angular-simple-logger/dist/angular-simple-logger.min.js',
  //      'public/lib/angular-google-maps/dist/angular-google-maps.min.js',
  //      'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCAcuRqPsIdiVo8c5iSx9NXu61hbn9yXQo',
  //      'public/lib/angular-google-places-autocomplete/dist/autocomplete.min.js',
  //      'public/lib/lodash/dist/lodash.min.js',
  //      'public/lib/bootstrap-checkbox/dist/js/bootstrap-checkbox.min.js',
  //      'public/lib/moment/min/moment.min.js',
  //      'public/lib/angular-touch/angular-touch.min.js',
  //      'public/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
  //      'public/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js',
  //      'public/lib/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js'
  //    ],
  //    tests: ['public/lib/angular-mocks/angular-mocks.js']
  //  },
  //  css: [
  //    'modules/*/client/css/*.css'
  //  ],
  //  less: [
  //    'modules/*/client/less/*.less'
  //  ],
  //  sass: [
  //    'modules/*/client/scss/*.scss'
  //  ],
  //  js: [
  //    'modules/core/client/app/config.js',
  //    'modules/core/client/app/init.js',
  //    'modules/*/client/*.js',
  //    'modules/*/client/**/*.js'
  //  ],
  //  img: [
  //    'modules/**/*/img/**/*.jpg',
  //    'modules/**/*/img/**/*.png',
  //    'modules/**/*/img/**/*.gif',
  //    'modules/**/*/img/**/*.svg'
  //  ],
  //  views: ['modules/*/client/views/**/*.html'],
  //  templates: ['build/templates.js']
  //},
  //server: {
  //  gruntConfig: ['gruntfile.js'],
  //  gulpConfig: ['gulpfile.js'],
  //  allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
  //  models: 'modules/*/server/models/**/*.js',
  //  routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
  //  sockets: 'modules/*/server/sockets/**/*.js',
  //  config: ['modules/*/server/config/*.js'],
  //  policies: 'modules/*/server/policies/*.js',
  //  views: ['modules/*/server/views/*.html']
  //},
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-google-places-autocomplete/dist/autocomplete.min.css',
        'public/lib/angular-bootstrap-datetimepicker/src/css/datetimepicker.css',
        'public/lib/angularjs-slider/dist/rzslider.min.css',
        'public/lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
        'public/lib/intl-tel-input/build/css/intlTelInput.css',
        'public/lib/slick-carousel/slick/slick.css'
      ],
      livejs:['https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCAcuRqPsIdiVo8c5iSx9NXu61hbn9yXQo'],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-simple-logger/dist/angular-simple-logger.min.js',
        'public/lib/angular-google-maps/dist/angular-google-maps.min.js',
        'public/lib/angular-google-places-autocomplete/dist/autocomplete.min.js',
        'public/lib/lodash/dist/lodash.min.js',
        'public/lib/bootstrap-checkbox/dist/js/bootstrap-checkbox.min.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/angular-google-chart/ng-google-chart.min.js',
        'public/lib/angular-smart-table/dist/smart-table.min.js',
        'public/lib/angular-touch/angular-touch.min.js',
        'public/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
        'public/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js',
        'public/lib/angularjs-slider/dist/rzslider.min.js',
        'public/lib/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
        'public/lib/angular-country-picker/country-picker.min.js',
        'public/lib/intl-tel-input/build/js/intlTelInput.min.js',
        'public/lib/angular-http-loader/app/package/js/angular-http-loader.js',
        'public/lib/slick-carousel/slick/slick.min.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js',
    libjs: ['public/dist/applibs.min.js'],
    views: ['modules/*/client/views/**/*.html'],
    server: {
      gruntConfig: ['gruntfile.js'],
      gulpConfig: ['gulpfile.js'],
      allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
      models: 'modules/*/server/models/**/*.js',
      routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
      sockets: 'modules/*/server/sockets/**/*.js',
      config: ['modules/*/server/config/*.js'],
      policies: 'modules/*/server/policies/*.js',
      views: ['modules/*/server/views/*.html']
    }
  }
};
