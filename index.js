'use strict';
var fs = require('fs');
var minify = require('html-minifier').minify;
var isThere = require('is-there');
var _ = require('lodash');

function KotoriWebpackPlugin(options) {
  // Default options
  this.options = _.extend({
    htmlFilePath: './index.html',
    scriptTagRegx: /<script\s+src=(["'])(.+?)bundle\.js\1/i,
    scriptTagReplacement: '<script src=$1$2' + '{$$placeholder}' + '?' + '{$$hash}' + '$1',
    styleTagRegx: /<link\s+rel="stylesheet"\s+href=(["'])(.+?)bundle\.css\1/i,
    styleTagReplacement: '<link rel="stylesheet" href=$1$2' + '{$$placeholder}' + '?' + '{$$hash}' + '$1',
    minifyOpt: {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true
    }
  }, options);

  if (!isThere(this.options.htmlFilePath)) {
    throw new Error('htmlFilePath: ' + this.options.htmlFilePath + ' is not existed');
  }

  if (!this.options.scriptTagRegx instanceof RegExp) {
    throw new Error('scriptTagRegx: ' + this.options.scriptTagRegx + 'is not a RegExp Object');
  }

  if (!this.options.styleTagRegx instanceof RegExp) {
    throw new Error('styleTagRegx: ' + this.options.styleTagRegx + 'is not a RegExp Object');
  }
}


KotoriWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;

  compiler.plugin('done', function(stats) {
    stats = stats.toJson();
    if (!stats.errors.length) {
      var html = fs.readFileSync(self.options.htmlFilePath, 'utf8');

      if (typeof stats.assetsByChunkName.main === 'string') {
        self.options.scriptTagReplacement = self.options.scriptTagReplacement.replace('{$$placeholder}', stats.assetsByChunkName.main);
        self.options.scriptTagReplacement = self.options.scriptTagReplacement.replace('{$$hash}', stats.hash);

        html = html.replace(
          self.options.scriptTagRegx,
          self.options.scriptTagReplacement);
      } else if (typeof stats.assetsByChunkName.main === 'undefined') {
        throw new Error('stats.assetsByChunkName.main is undefined');
      } else {
        self.options.scriptTagReplacement = self.options.scriptTagReplacement.replace('{$$placeholder}', stats.assetsByChunkName.main[0]);
        self.options.scriptTagReplacement = self.options.scriptTagReplacement.replace('{$$hash}', stats.hash);
        self.options.styleTagReplacement = self.options.styleTagReplacement.replace('{$$placeholder}', stats.assetsByChunkName.main[1]);
        self.options.styleTagReplacement = self.options.styleTagReplacement.replace('{$$hash}', stats.hash);

        html = html.replace(
          self.options.scriptTagRegx,
          self.options.scriptTagReplacement);

        html = html.replace(
          self.options.styleTagRegx,
          self.options.styleTagReplacement);
      }

      html = minify(html, self.options.minifyOpt);

      fs.writeFileSync(self.options.htmlFilePath, html);
    }
  });
};

module.exports = KotoriWebpackPlugin;