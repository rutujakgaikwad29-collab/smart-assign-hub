import cp from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';

const originalExec = cp.exec;

cp.exec = (cmd, options, callback) => {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  if (cmd === 'net use') {
    if (callback) {
      queueMicrotask(() => callback(new Error('skipped net use'), '', ''));
    }

    return {
      kill() {},
      stdout: { on() {}, once() {} },
      stderr: { on() {}, once() {} },
    };
  }

  return originalExec(cmd, options, callback);
};

syncBuiltinESMExports();

await import('./node_modules/vite/bin/vite.js');
