"use babel";

import { DEFAULT_WRAP_WIDTH } from "./words";

/**
 * @param {Integer} size
 * @returns {Array} empty array of length size
 */
export function arrayOfSize(size) {
  return Array.apply(null, Array(size));
}

/**
 * @param {Array} arr
 * @returns {*} random element of arr
 */
export function randNth(arr) {
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
export function wordWrap(
  str,
  width = DEFAULT_WRAP_WIDTH,
  brk = "\n",
  cut = false
) {
  if (!str) return false;

  const regex = `.{1,${width}}(\\s|$)` +
    (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)");

  return str.match(new RegExp(regex, "g")).join(brk);
}

/**
 * Create an atom warning notification
 * @param {String} error
 * @returns {Null}
 */
export function errorMsg(error) {
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
export function displayConfigTable(conf) {
  // Only log the table if in devMode and not in specMode
  if (atom.inDevMode() && !atom.inSpecMode()) {
    table = Object.keys(conf).map(key => {
      return { "Config Option": key, "Config Value": conf[key] };
    });
    console.table(table);
  }
}
