const WorkerRuntime = require('./runtime');
const { isPath, isUrl, isFunction, isRequest } = require('./helper/util');

function setupWorkerTest(worker) {
  if (!isPath(worker)) {
    throw new Error('worker format is not valid');
  }

  global.origin = global;

  const addEventListenerMock = jest.fn();
  global.addEventListener = addEventListenerMock;

  const consoleMock = { log: jest.fn() };
  global.console = consoleMock;

  Object.assign(global, WorkerRuntime);

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