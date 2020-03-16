process.env.NODE_ENV = 'test';

const { topicData, articleData, commentData, userData } = require('../data/index.js');

exports.seed = function(knex) {
	return knex.migrate.rollback().then(() => {
		return knex.migrate.latest().then(() => {
			const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

			const topicsInsertions = knex('topics').insert(topicData);
			const usersInsertions = knex('users').insert(userData);

			return Promise.all([ topicsInsertions, usersInsertions ])
				.then(() => {
					return knex('articles').insert(formatDates(articleData)).returning('*');
				})
				.then((articleRows) => {
					const articleRef = makeRefObj(articleRows, 'title', 'article_id');
					console.log(articleRef);
					const formattedComments = formatComments(commentData, articleRef);
					console.log(formattedComments);
					return knex('comments').insert(formattedComments).returning('*').then(console.log);
				});
		});
	});
};
