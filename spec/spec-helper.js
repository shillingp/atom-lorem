"use babel";

// const dotimes = (num, fn) => [...Array(num + 1).keys()].slice(1).forEach(fn);

/**
 * @param {HTMLElement} element
 * @param {String} name
 * @returns {Boolean} indicating whether the command is present on `element`
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
export const dotimes = (num, fn) =>
  [...Array(num + 1).keys()].slice(1).forEach(fn);
