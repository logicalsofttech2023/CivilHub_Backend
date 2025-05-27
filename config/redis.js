const redis = require("redis");

const redisClient = redis.createClient({
	host: "192.168.1.16",
	port: 5000,
});

redisClient.on("connect", () => {
	console.log("Connected to Redis...");
});

redisClient.on("error", (err) => {
	console.error("Redis Error:", err);
});

module.exports = redisClient;
