const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);

async function createValidUser() {
  return await request
    .post('/api/users')
    .send({
      username: 'kenneth',
      email: 'kenneth@biz.com',
      password: 'partario',
    })
    .set('Accept', 'application/json');
}

module.exports = {createValidUser};
