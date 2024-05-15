const redisDB = require("redis");
const redisClient = redisDB.createClient();
redisClient.connect();
redisClient.on("connect", () => console.log("connect to redis"));
redisClient.on("ready", () => console.log("connected to redis & ready"));
redisClient.on("error", (error) => console.log("redisError : ", error.message));
redisClient.on("end", () => console.log("disconnected from redis..."));

module.exports = redisClient;
