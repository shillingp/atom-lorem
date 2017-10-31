"use babel";

import { sizedArray } from "../lib/helpers";

/**
 * @param {HTMLElement} element
 * @param {String} name
 * @returns {Boolean} indicating whether the command `name` is present on `element`
 */
export const hasCommand = (element, name) =>
  atom.commands
    .findCommands({ target: element })
    .some(cmd => cmd.name === name);

/**
 * runs `fn` `num` times
 * @param {Number} num
 * @param {Function} fn
 */
export const doTimes = (num, fn) => sizedArray(num).forEach(fn);
