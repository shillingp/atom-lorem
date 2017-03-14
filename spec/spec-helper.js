"use babel";

/**
 * @param {HTMLElement} element
 * @param {String} name
 * @returns {Boolean} indicating whether the command `name` is present on `element`
 */
export function hasCommand(element, name) {
  return !!atom.commands
    .findCommands({ target: element })
    .filter(cmd => cmd.name === name)[0];
}

/**
 * @param {Integer} num
 * @param {Function} fn
 */
export const doTimes = (num, fn) =>
  [...Array(num + 1).keys()].slice(1).forEach(fn);
