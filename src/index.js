const { Headers, Request, Response, crypto, fetch, URL } = require('./runtime');
const { isPath, isUrl, isFunction, isRequest } = require('./util');

function setupWorkerTest(worker) {
  if (!isPath(worker)) {
    throw new Error('worker format is not valid');
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
  global.URL = URL;

  require(worker);

  const fetchEventHandler = addEventListenerMock.mock.calls[0][1];
  global.fetchEventHandler = fetchEventHandler;
}

function clearWorkerTest() {
  jest.clearAllMocks();

  global = global.origin;
}

async function triggerFetchEvent(request) {
  if (!isUrl(request) && !isRequest(request)) {
    throw new Error('request format is not valid');
  }

  if (!isFunction(global.fetchEventHandler)) {
    throw new Error('fetchEventHandler is not defined');
  }

  const fetchEventMock = {
    passThroughOnException: jest.fn(),
    waitUntil: jest.fn(() => Promise.resolve()),
    respondWith: jest.fn((response) => Promise.resolve(response)),
  };

  if (isUrl(request)) {
    fetchEventMock.request = new Request(request);
  } else {
    fetchEventMock.request = request;
  }

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