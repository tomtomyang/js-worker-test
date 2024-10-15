// worker.test.js
const path = require('path');
const { setupWorkerTest, clearWorkerTest, triggerFetchEvent } = require('../src');

describe('worker test', () => {
  beforeAll(() => {
    setupWorkerTest(path.resolve(__dirname, './stream.js'));
  });

  afterAll(() => {
    clearWorkerTest();
  });

  it('respond with "<div>First segment</div><div>Second segment</div>"', async () => {
    const response = await triggerFetchEvent('http://localhost:8000/');

    expect(response).toBeInstanceOf(Response);

    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toBe('<div>First segment</div><div>Second segment</div>');
  });
});