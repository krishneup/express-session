const mongoose = require('mongoose');
import { createClient } from 'redis';



const client = createClient();

client.connect();


const exec = mongoose.Query.prototype.exec;



    mongoose.Query.prototype.cache = function (options:any ={}) {
        this.useCache = true;
        this.hashKey = JSON.stringify(options.key || 'default');
        // this.hashKey = options.key || '';
    
        return this;
    }
    
    mongoose.Query.prototype.exec = async function () {
    
        if(!this.useCache) {
            return await exec.apply(this, arguments);
        }
    
        const key:string = JSON.stringify(Object.assign({},this.getQuery(), {
            collection:this.mongooseCollection.name
        }))
        
        const cacheValue = await client.hGet(this.hashKey, key)
    
    
        if(cacheValue) {
            console.log('cache value sent')
            return JSON.parse(cacheValue)
        }
    
    
        // console.log(key)
        console.log('no data found in redis')
    
    
        const result = await exec.apply(this, arguments);
    
        client.hSet(this.hashKey, key, JSON.stringify(result))
    
        return result;
    }



// for connection with express-session
const session = require("express-session")
let RedisStore = require("connect-redis")(session)

// redis@v4
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)


const sessionStore = new RedisStore({ client: redisClient });

const sessionData = {
    //secret: process.env.SECRET,
    secret: 'some secret',
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 100000,
        httpOnly: false
    }
  }

module.exports = {
    sessionStore,
    sessionData
    
}