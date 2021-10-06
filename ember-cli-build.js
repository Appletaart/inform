'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: [
        'node_modules/@appuniversum/appuniversum',
        'node_modules/@appuniversum/ember-appuniversum/app/styles'
      ]
    }/* ,
    fingerprint: {
      prepend: 'https://applepanithi.com/'
    } */
  });

  app.import('bower_components/d3/d3.js');
  app.import('bower_components/d3/topojson.v3.min.js');
  app.import('vendor/shims/d3.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
