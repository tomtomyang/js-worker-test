const { Headers, Request, Response, crypto, fetch } = require('./runtime');

const _ORIGIN = {}

function setupWorkerTest() {
  _ORIGIN.addEventListener = global.addEventListener;
  _ORIGIN.console = global.console;

  const addEventListenerMock = jest.fn();
  global.addEventListener = addEventListenerMock;
  global.console = { log: jest.fn() };

  // 补充 Runtime API
  global.Request = Request;
  global.Response = Response;
  global.Headers = Headers;
  global.crypto = crypto;
  global.fetch = fetch;

  return addEventListenerMock;
}

function clearWorkerTest() {
  jest.clearAllMocks();

  global.addEventListener = _ORIGIN.addEventListener;
  global.console = _ORIGIN.console;

  delete global.Request;
  delete global.Response;
  delete global.Headers;
  delete global.crypto;
  delete global.fetch;
}

function triggerFetchEvent(fetchEventHandler, url) {
  const mockFetchEvent = {
    request: new Request(url),
    respondWith: jest.fn((response) => Promise.resolve(response)),
  };

  // 触发 fetch 事件处理函数
  fetchEventHandler(mockFetchEvent);

  return mockFetchEvent;
}

module.exports = {
  setupWorkerTest,
  clearWorkerTest,
  triggerFetchEvent,
};