"use babel";

import { arrayOfSize } from "../lib/helpers";

/**
 * @param {HTMLElement} element
 * @param {String} name
 * @returns {Boolean} indicating whether the command `name` is present on `element`
 */
export function hasCommand(element, name) {
  return atom.commands
    .findCommands({ target: element })
    .some(cmd => cmd.name === name);
}

/**
 * runs `fn` `num` times
 * @param {Integer} num
 * @param {Function} fn
 */
export const doTimes = (num, fn) => arrayOfSize(num).forEach(fn);
