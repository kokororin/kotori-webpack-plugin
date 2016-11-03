# ことり Webpack Plugin :baby_chick:

[![npm version](https://img.shields.io/npm/v/kotori-webpack-plugin.svg)](https://www.npmjs.com/package/kotori-webpack-plugin)
[![David](https://david-dm.org/kokororin/kotori-webpack-plugin.svg)](https://david-dm.org/kokororin/kotori-webpack-plugin)

Installation
------------
```bash
npm install --save-dev kotori-webpack-plugin
```

Basic Usage
-----------
```javascript
var KotoriWebpackPlugin = require('kotori-webpack-plugin');
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'index_bundle.js'
  },
  plugins: [new KotoriWebpackPlugin()]
};
```

Configuration
-------------
You can pass a hash of configuration options to `KotoriWebpackPlugin`.  
See it in `index.js`.