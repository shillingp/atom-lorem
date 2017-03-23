"use babel";

import { DEFAULT_WRAP_WIDTH } from "./words";

/**
 * @param {Integer} value
 * @returns {Boolean} is value a number and finite
 */
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

/**
 * @param {Integer} size
 * @returns {Array} empty array of length size
 */
function arrayOfSize(size) {
  return Array.apply(null, { length: size });
}

/**
 * @param {Array} arr
 * @returns {*} random element of arr
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
 * @returns {String} str wrapped when it exceeds width using brk string
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
 * Create an atom warning notification
 * @param {String} error
 * @returns {Null}
 */
function errorMsg(error) {
  let notifs = atom.workspace.notificationManager;
  notifs.addWarning("Lorem Error:", {
    detail: error,
  });
  return null;
}

/**
 * logs a table to the console to display the configuration
 * @param {Object} conf
 */
function displayConfigTable(conf) {
  // Only log the table if in devMode and not in specMode
  if (atom.inDevMode() && !atom.inSpecMode()) {
    table = Object.keys(conf).map(key => {
      return { "Config Option": key, "Config Value": conf[key] };
    });
    console.table(table);
  }
}

export {
  isNumber,
  arrayOfSize,
  randNth,
  wordWrap,
  errorMsg,
  displayConfigTable,
};
