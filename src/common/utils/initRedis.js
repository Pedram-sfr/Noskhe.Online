const redisDB = require("redis");
const redisClient = redisDB.createClient({url: 'redis://:eUtsGIHZaOTt2wnM9PKma2R7@hotaka.liara.cloud:34585/0'});
redisClient.connect();
redisClient.on("connect", () => console.log("connect to redis"));
redisClient.on("ready", () => console.log("connected to redis & ready"));
redisClient.on("error", (error) => console.log("redisError : ", error.message));
redisClient.on("end", () => console.log("disconnected from redis..."));

module.exports = redisClient;
