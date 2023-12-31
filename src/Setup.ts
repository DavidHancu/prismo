process.env.NODE_ENV = process.env.NODE_ENV ?? "development";

import path from "path";
import { fileURLToPath } from "url";
// Call this function in a another function to find out the file from
// which that function was called from. (Inspects the v8 stack trace)
//
// Inspired by http://stackoverflow.com/questions/13227489

function getCallerFile(position = 2) {
    if (position >= Error.stackTraceLimit) {
      throw new TypeError('getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' + position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`');
    }
  
    const oldPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack)  => stack;
    const stack = new Error().stack;
    Error.prepareStackTrace = oldPrepareStackTrace;
  
  
    if (stack !== null && typeof stack === 'object') {
      // stack[0] holds this file
      // stack[1] holds where this function was called
      // stack[2] holds the file we're interested in
      return stack[position] ? (stack[position] as any).getFileName() : undefined;
    }
};

function getFileNameFromUrl(url: string): string {
    return path.basename(fileURLToPath(url));
}

function getFileName(): string {
    const url = getCallerFile();
    return getFileNameFromUrl(url);
}


Object.defineProperty(globalThis, '__filename', {
    get: getFileName,
});