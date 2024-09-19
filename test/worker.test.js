// worker.test.js
const { setupWorkerTest, clearWorkerTest, triggerFetchEvent } = require('../src');

describe('worker test', () => {
  let addEventListenerMock;

  beforeAll(() => {
    addEventListenerMock = setupWorkerTest();

    require('./worker.js');
  });

  afterAll(() => {
    clearWorkerTest();
  });

  it('respond with "Hello Worker!"', async () => {
    const fetchEventHandler = addEventListenerMock.mock.calls[0][1];
    const mockFetchEvent = triggerFetchEvent(fetchEventHandler, 'http://localhost:8000/');

    await new Promise(process.nextTick);

    // 检查 console 输出是否正确
    expect(console.log).toHaveBeenCalledWith('http://localhost:8000/');

    // 检查 respondWith 行为是否正确
    expect(mockFetchEvent.respondWith).toHaveBeenCalledWith(expect.any(Response));

    const response = mockFetchEvent.respondWith.mock.calls[0][0];
    const text = await response.text();
    expect(text).toBe('Hello Worker!');
  });

  it('respond with "Hello Test!"', async () => {
    const fetchEventHandler = addEventListenerMock.mock.calls[0][1];
    const mockFetchEvent = triggerFetchEvent(fetchEventHandler, 'http://localhost:8000/test');

    await new Promise(process.nextTick);

    // 检查 console 输出是否正确
    expect(console.log).toHaveBeenCalledWith('http://localhost:8000/test');

    // 检查 respondWith 行为是否正确
    expect(mockFetchEvent.respondWith).toHaveBeenCalledWith(expect.any(Response));

    const response = mockFetchEvent.respondWith.mock.calls[0][0];
    const text = await response.text();
    expect(text).toBe('Hello Test!');
  });
});