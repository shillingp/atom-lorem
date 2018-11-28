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

/**
 * @param {String} grammarExt
 * @return {Grammar} the grammar for 'grammarExt'
 */
export const getGrammar = grammarExt =>
  atom.grammars.grammarForScopeName("source" + grammarExt);

/**
 * @param {String} path
 * @param {Object} newProps
 * @returns {Boolean}
 */
export const updateConfig = (path, newProps) =>
  atom.config.set(path, { ...atom.config.get(path), ...newProps });
