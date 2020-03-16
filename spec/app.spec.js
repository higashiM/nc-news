const client = require('../db/connection');
const app = require('../server/app');
const request = require('supertest');
const { expect } = require('chai');
const chaiSorted = require('chai-sorted');
const chai = require('chai');

chai.use(chaiSorted);

after(() => {
	client.destroy();
});

beforeEach(() => {
	client.seed.run;
});

describe('/api', () => {
	describe('/articles', () => {
		it('GET response ', () => {
			return request(app).get('/api/articles').expect(200).then((res) => {});
		});
	});
});
