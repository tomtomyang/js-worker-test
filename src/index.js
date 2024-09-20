const path = require('path');
const { Headers, Request, Response, crypto, fetch } = require('./runtime');

// const _ORIGIN = {}

function setupWorkerTest(worker) {
  if (!worker) {
    throw new Error('worker is required');
  }

  global.origin = global;

  const addEventListenerMock = jest.fn();
  global.addEventListener = addEventListenerMock;

  global.console = { log: jest.fn() };

  // 补充 Runtime API
  global.Request = Request;
  global.Response = Response;
  global.Headers = Headers;
  global.crypto = crypto;
  global.fetch = fetch;

  require(worker);

  const fetchEventHandler = addEventListenerMock.mock.calls[0][1];
  global.fetchEventHandler = fetchEventHandler;
}

function clearWorkerTest() {
  jest.clearAllMocks();

  global = global.origin;
}

async function triggerFetchEvent(url) {
  const fetchEventMock = {
    request: new Request(url),
    respondWith: jest.fn((response) => Promise.resolve(response)),
  };

  // 触发 fetch 事件处理函数
  await global.fetchEventHandler(fetchEventMock);
  await new Promise(process.nextTick);

  global.fetchEvent = fetchEventMock;

  return fetchEventMock.respondWith.mock.calls[0][0];
}

module.exports = {
  setupWorkerTest,
  clearWorkerTest,
  triggerFetchEvent,
};