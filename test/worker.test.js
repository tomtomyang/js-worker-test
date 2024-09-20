// worker.test.js
const path = require('path');
const { setupWorkerTest, clearWorkerTest, triggerFetchEvent } = require('../src');

describe('worker test', () => {
  beforeAll(() => {
    setupWorkerTest(path.resolve(__dirname, './worker.js'));
  });

  afterAll(() => {
    clearWorkerTest();
  });

  it('respond with "Hello Worker!"', async () => {
    const response = await triggerFetchEvent('http://localhost:8000/');

    expect(console.log).toHaveBeenCalledWith('http://localhost:8000/');

    expect(response).toBeInstanceOf(Response);

    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toBe('Hello Worker!');
  });

  it('respond with "Hello Test!"', async () => {
    const response = await triggerFetchEvent('http://localhost:8000/test');

    expect(console.log).toHaveBeenCalledWith('http://localhost:8000/test');

    expect(response).toBeInstanceOf(Response);

    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toBe('Hello Test!');
  });
});