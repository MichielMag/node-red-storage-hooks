# node-red-storage-hooks
Hook into Node-Red's storage API from your settings.js

# What is it?
A storage plugin for Node-Red for when you want to hook into any of it's storage functions without writing an entire module yourself.

# Why?
As an example: when you have a read-only filesystem you could use this to make your filesystem writable as a pre-hook and read-only again as a post-hook.

# How to use?
Install using `npm install node-red-storage-hooks` from your node-red folder. Then edit your settings file and add `storageModule: require("node-red-storage-hooks")`. By default it uses the default localStorage plugin built in Node-RED. To use another storage plugin use: `storageModule: require("node-red-storage-hooks").with('a-custom-storage-plugin')`

## API Hooks
Each of the API methods described by Node-RED has a hook, these can be found at https://nodered.org/docs/api/storage/methods/. Look there if you want to find out the function parameters. There's also a general pre-write hook, a post-write hook, a pre-read hook and a post-read hook. These are called outside of the specific hooks (for example: 1: pre-write, 2: pre-saveFlows, 3: actual save, 4: post-saveFlows, 5: post-write)

To hook into a function you can use `pre_<function-name>: function(...parameters) { console.log('I'm in a pre-hook!'); }`.
Your hooks should return a promise that resolves the object you want to pass into the original localStorage plugin.

## Examples
```javascript
const fs = require('fs');

const settings = {
  storageModule: require("node-red-storage-hooks"),
  pre_saveFlows: (flows) => {
    return new Promise((resolve, reject) => {
      fs.writeFile('/home/foo/bar.json', JSON.stringify(flows), (err) => {
        if (err) { reject(err); }
        else { resolve(flows); }
      });
    });
  }
};
```

This example would write your flows to some file in you home folder before actually telling Node-RED to save it.
