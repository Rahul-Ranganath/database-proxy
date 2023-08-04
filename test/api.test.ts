import { expect } from 'chai';
import 'mocha';
const request = require('supertest');
import app from '../index'; // Assuming your entry file is named 'index.ts'

describe('API Endpoints', () => {
  let createdUserId: number;

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Test User', email: 'test_user@gmail.com', age: 25 });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    createdUserId = res.body.id;
  });

  it('should get user by ID', async () => {
    const res = await request(app)
      .get(`/users/${createdUserId}`);
    
    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(createdUserId);
  });

  it('should update user by ID', async () => {
    const updatedName = 'Updated Test User';
    const res = await request(app)
      .post(`/users/${createdUserId}`)
      .send({ name: updatedName });

    expect(res.status).to.equal(200);

    // Check if the user data is updated
    const getUserRes = await request(app)
      .get(`/users/${createdUserId}`);
    
    expect(getUserRes.status).to.equal(200);
    expect(getUserRes.body.name).to.equal(updatedName);
  });

  it('should delete user by ID', async () => {
    const res = await request(app)
      .delete(`/users/${createdUserId}`);

    expect(res.status).to.equal(204);

    // Verify that the user is deleted
    const getUserRes = await request(app)
      .get(`/users/${createdUserId}`);
    
    expect(getUserRes.status).to.equal(404);
  });

});
