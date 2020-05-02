const state = {};
let isWorking = false;

function add(time, data) {
  if (!state[time]) {
    state[time] = [data];
  } else {
    state[time].push(data);
  }

  if (!isWorking) runWorker();

  // unsubscribe
  return () => {
    if (!state[time]) return;
    const index = state[time].indexOf(data);

    state[time].splice(index, 1);
    if (state[time].length === 0) delete state[time];
  };
}

// API:
const at = (time, cb) => add(time, { cb });
const after = (ms, cb) => add(Date.now() + ms, { cb });
const every = (ms, cb) =>
  add(Date.now() + ms, {
    cb: () => {
      cb();
      every(ms, cb);
    },
  });
const tick = cb =>
  add(Date.now(), {
    cb: () => {
      cb();
      every(1, cb);
    },
  });
const nextTick = cb => at(Date.now() + 1, cb);

// Create timers store
function create() {
  const store = new Map();

  return {
    after(ms, cb) {
      const clear = store.get(cb);
      if (clear) clear();
      store.set(cb, after(ms, cb));
    },
    clear(cb) {
      if (cb) {
        store.get(cb)();
        return;
      }

      store.forEach(clear => clear());
    }
  }
}

function worker() {
  const now = Date.now();

  Object.keys(state).some(time => {
    if (parseInt(time, 10) > now) return;

    // flush all callbacks, registered at current time
    state[time].forEach(({ cb }) => {
      try {
        cb();
      } catch (e) {} // eslint-disable-line
    });

    delete state[time];
  });

  isWorking = Object.keys(state).length > 0;
  if (isWorking) runWorker();
}

function runWorker() {
  window.requestAnimationFrame(worker);
}

export {
  create,
  at,
  after,
  every,
  tick,
  nextTick,
};
