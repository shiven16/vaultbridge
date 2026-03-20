import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from './app.js';

describe('App Integration Tests', () => {
  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /unknown-route should return 404', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
  });

  it('GET /drive/files should return 401 Unauthorized when missing token', async () => {
    const res = await request(app).get('/drive/files');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/authorization/i);
  });
});
