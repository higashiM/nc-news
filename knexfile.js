const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
	client: 'pg',
	migrations: {
		directory: './db/migrations'
	},
	seeds: {
		directory: './db/seeds'
	}
};

const customConfig = {
	development: {
		connection: {
			database: 'nc_news',
			username: 'g',
			password: 'myPassword'
		}
	},
	test: {
		connection: {
			database: 'nc_news_test',
			username: 'g',
			password: 'myPassword'
		}
	}
};

module.exports = { ...customConfig[ENV], ...baseConfig };
