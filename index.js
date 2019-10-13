//const defaultStorage = require("@node-red/runtime/lib/storage/localfilesystem");



const Storage = function()
{
    this.module = null;
    this.settings = null;

    this.with = function(m)
    {
        this.module = require(m);
        return this;
    }

    this.init = function(settings, _)
    {
        if (!this.module) {
            throw "Cannot use node-red-storage-hooks without giving it an underlying storage plugin.\nUse the 'with' function to make it use another storage plugin. For example:\nstorageModule: require('node-red-storage-hooks').with('a-custom-storage-plugin')";
        }

        this.settings = settings;
    }   

    this.get = function(name)
    {
        var self = this;
        return new Promise((resolve, reject) => {
            self.funcOrNot("pre_get", arguments)
                .then((result) => {
                    return self.funcOrNot("pre_" + name, result);
                })
                .then((result) => {
                    console.log(self.module, self.module[name]);
                    return self.module[name](result);
                })
                .then((result) => {
                    return self.funcOrNot("post_" + name, result);
                })
                .then((result) => {
                    return self.funcOrNot("post_get", result);
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                })
        });

    }
    
    this.getFlows = function()
    {
        return this.get("getFlows");
    }
    
    this.saveFlows = function(flows)
    {

    }

    this.getCredentials = function()
    {

        return this.get("getCredentials");
    }

    this.saveCredentials = function(credentials) 
    {

    }

    this.getSettings = function()
    {

        return this.get("getSettings");
    }

    this.saveSettings = function(settings)
    {

    }

    this.getSessions = function()
    {

        return this.get("getSessions");
    }

    this.saveSessions = function(sessions)
    {

    }

    this.getLibraryEntry = function(type, name)
    {
        return this.get("getSessions", type, name);
    }

    this.saveLibraryEntry = function(type, name, meta, body)
    {

    }

    this.funcOrNot = function(name, args)
    {
        console.log("funcOrNot", arguments);
        const settings = this.settings;
        return new Promise((resolve, reject) => {
            if (settings[name]) {
                settings[name](args)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
            else 
            {
                resolve();
            }
        });
    }
}

module.exports = new Storage();