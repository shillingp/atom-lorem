"use babel";

import { DEFAULT_CONFIG as config } from "./config-manager";

/**
 * @param {Number} [size = 0]
 * @param {*} [fn = undefined]
 * @returns {Array} will return an array of length `size` if `fn` is not defined the array will contain empty values. If `fn` is a function each value will be mapped by `fn` else if `fn` is not a function the value of `fn` will be used to fill the returned array.
 */
export function sizedArray(size = 0, fn = undefined) {
  const arr = Array.apply(null, Array(size));
  return fn !== undefined
    ? typeof fn === "function" ? arr.map(fn) : arr.fill(fn)
    : arr;
}

/**
 * @param {Array} arr
 * @returns {*} random element of `arr`
 */
export function randNth(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * From http://james.padolsey.com/javascript/wordwrap-for-javascript/
 * @param {String} str
 * @param {Number} [width = config.wrapWidth]
 * @returns {String} `str` wrapped when it exceeds `width` using `brk` string
 */
export function wordWrap(str, width = config.wrapWidth) {
  if (!str) return false;
  const regex = `.{1,${width}}(\\s|$)|\\S+?(\\s|$)`;
  return str.match(new RegExp(regex, "g")).join("\n");
}

/**
 * Create an atom warning notification
 * @param {String} error
 * @returns {Null}
 */
export function errorMsg(error) {
  const notifs = atom.workspace.notificationManager;
  notifs.addWarning("Lorem Error:", {
    detail: error,
  });
  return null;
}

/**
 * logs a table to the console to display the configuration
 * @param {Object} conf
 */
export function displayConfigTable(conf) {
  // Only log the table if in devMode and not in specMode
  if (atom.inDevMode() && !atom.inSpecMode()) {
    const table = Object.keys(conf).map(key => {
      return { "Config Option": key, "Config Value": conf[key] };
    });
    console.table(table);
  }
}

/**
 * compose a list of functions on an initial value
 * @param {...Function} fns
 * @param {*} initial
 * @return {*} returns the result of threading initial through fns
 */
export const compose = (...fns) => initial =>
  fns.reduce((res, fn) => fn(res), initial);

/**
 * @param {String} sentence
 * @returns {String} sentence with capital letter and period
 */
export const sentenceSyntax = sentence =>
  sentence.replace(/\b\w/, s => s.toUpperCase()) + ". ";
