const redis = {
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	db: process.env.REDIS_DB,
	password: process.env.REDIS_PASSWORD,
	keyPrefix: process.env.REDIS_KEYPREFIX
}

const pg = {
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DATABASE
}

module.exports = {
    redis,
    pg
}
