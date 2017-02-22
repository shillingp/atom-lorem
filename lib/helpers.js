"use babel";

import { DEFAULT_WRAP_WIDTH } from "./words";

function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

function arrayOfSize(size) {
  return Array.apply(null, { length: size });
}

function randNth(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// From http://james.padolsey.com/javascript/wordwrap-for-javascript/
function wordWrap(str, width = DEFAULT_WRAP_WIDTH, brk = "\n", cut = false) {
  if (!str) return false;

  let regex = ".{1," +
    width +
    "}(\\s|$)" +
    (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)");

  return str.match(new RegExp(regex, "g")).join(brk);
}

function errorMessage(error) {
  let notifs = atom.workspace.notificationManager;
  notifs.addWarning(error)
  return "";
}


export { isNumber, arrayOfSize, randNth, wordWrap, errorMessage };
