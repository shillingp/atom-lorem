"use babel";

import { DEFAULT_WRAP_WIDTH } from "./words";

/**
 * @param {Integer} value
 * @return {Boolean} is value a number and finite
 */
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

/**
 * @param {Integer} size
 * @return {Array} empty array of length size
 */
function arrayOfSize(size) {
  return Array.apply(null, { length: size });
}

/**
 * @param {Array} arr
 * @return {*} random element of arr
 */
function randNth(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * From http://james.padolsey.com/javascript/wordwrap-for-javascript/
 * @param {String} str
 * @param {Integer} [width = DEFAULT_WRAP_WIDTH]
 * @param {String} [brk = "\n"]
 * @param {Boolean} [cut = false]
 * @return {String} str wrapped when it exceeds width using brk string
 */
function wordWrap(str, width = DEFAULT_WRAP_WIDTH, brk = "\n", cut = false) {
  if (!str) return false;

  let regex = ".{1," +
    width +
    "}(\\s|$)" +
    (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)");

  return str.match(new RegExp(regex, "g")).join(brk);
}

/**
 * Add an atom warning notification
 * @param {String} error
 * @return {Null}
 */
function errorMessage(error) {
  let notifs = atom.workspace.notificationManager;
  notifs.addWarning("Lorem Error:", {
    detail: error
  });
  return null;
}

/**
 * logs a table to the console to display the configuration
 * @param {Object} conf
 */
function displayConfigTable(conf) {
  table = Object.keys(conf).map(key => {
    return { name: key, value: conf[key] };
  });
  console.table(table);
}

export {
  isNumber,
  arrayOfSize,
  randNth,
  wordWrap,
  errorMessage,
  displayConfigTable
};
