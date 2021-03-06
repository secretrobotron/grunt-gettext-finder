/*
 * grunt-gettext-finder
 * https://github.com/alicoding/grunt-gettext-finder
 *
 * Copyright (c) 2014 Ali Al Dallal
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {
  var _ = require('lodash');
  var path = require('path');

  grunt.registerMultiTask('gettext_finder', 'gettext finder', function () {
    var options = this.options();
    var localeJSON = {};
    var files = grunt.file.expand({
            filter: function (filePath) {
              return path.basename(filePath)[0] !== '_';
            }
          }, options.pathToJSON);
    var keys = [];

    files.forEach(function(f, i) {
      localeJSON = _.merge(localeJSON, grunt.file.readJSON(f));
    });
    localeJSON = _.keys(localeJSON);

    this.filesSrc.forEach(function (f) {
      if (grunt.file.exists(f)) {
        var content = grunt.file.read(f);
        var re = content.replace(/gettext\(["']([^)]+)["']\)/g, function(wholeMatch, key) {
          keys.push(key);
          return wholeMatch;
        });
      }
    });

    var compare = _.difference(localeJSON, keys);
    var diff = _.difference(compare, options.ignoreKeys);

    if (!diff.length) {
      grunt.log.ok("No unused key names found in JSON provided.\n");
    } else {
      grunt.log.warn("Found unused key names in JSON provided.\n",
        "Please consider removing them or add to the ignoreKeys.\n list:", diff);
    }
  });
};