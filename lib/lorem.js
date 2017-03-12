"use babel";

import { CompositeDisposable } from "atom";
import LoremIpsum from "./lorem-ipsum";
import { SPLIT_REG_EXP } from "./config-manager";

export default {
  subscriptions: null,

  LoremIpsum: null,

  config: {
    defaults: {
      title: "Defaults command arguments",
      description: "",
      type: "object",
      order: 1,
      properties: {
        unitType: {
          title: "Default type of items",
          type: "string",
          default: "Paragraph",
          enum: [
            "Paragraph",
            "Sentence",
            "Word",
            "Link",
            "Ordered List",
            "Unordered List",
          ],
          order: 1,
        },
        unitCount: {
          title: "Default number of items",
          type: "integer",
          default: 1,
          minimum: 1,
          maximum: 20,
          order: 2,
        },
        unitSize: {
          title: "Default length of items",
          type: "string",
          default: "Medium",
          enum: ["Any", "Short", "Medium", "Long", "Very Long"],
          order: 3,
        },
        isWrapped: {
          title: "Is lorem text wrapped by default?",
          type: "boolean",
          default: true,
          order: 4,
        },
        wrapWidth: {
          title: "Wrap width if enabled",
          type: "integer",
          default: 80,
          minimum: 20,
          order: 5,
        },
        isHTML: {
          title: "Is the lorem text wrapped in `<p>` tags?",
          type: "boolean",
          default: false,
          order: 6,
        },
        showHelp: {
          title: "Should help be shown if no arguments are specified",
          type: "boolean",
          default: false,
          order: 7,
        },
      },
    },
    commands: {
      title: "Command parameters",
      description: "Hello World",
      type: "object",
      order: 2,
      properties: {
        splitRegExp: {
          type: "array",
          default: ["_", "-"],
          // items: {
          //   type: "string",
          // },
        },
      },
    },
  },

  activate(state) {
    this.LoremIpsum = new LoremIpsum();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "lorem:catch-command": () => this.handleLorem(),
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  /**
   * @param {TextEditor} editor
   * @param {Point} cursor
   * @return {String} command string to the left of the cursor
   */
  getLoremCommand(editor, cursor) {
    const { row, column } = cursor;
    const line = editor.lineTextForBufferRow(row);

    let start = column, end = column, command = "";

    while (start > 0 && /\S/.test(line.charAt(start - 1))) {
      start--;
    }

    command = editor.getTextInBufferRange([[row, start], [row, end]]);

    if (command.match(/lorem/)) {
      let index = command.match(/lorem/).index;
      command = command.slice(index);
    }

    return command.split(SPLIT_REG_EXP)[0] === "lorem" ? command : "";
  },

  /**
   * Returns a new marker layer with markers at cursor positions
   * @param {TextEditor} editor
   * @return {DisplayMarkerLayer}
   */
  createCursorLayer(editor) {
    const layer = editor.addMarkerLayer();

    editor
      .getCursorBufferPositions()
      .sort((a, b) => a.row > b.row)
      .map(cursor => layer.markBufferPosition(cursor));

    return layer;
  },

  /**
   * Parse each command for every cursor and insert it at repective cursor
   */
  handleLorem() {
    const editor = atom.workspace.getActiveTextEditor();
    const layer = this.createCursorLayer(editor);
    const markers = layer.getMarkers();

    editor.transact(() => {
      markers.forEach(marker => {
        let cursor = marker.getStartBufferPosition(),
          command = this.getLoremCommand(editor, cursor),
          text = this.LoremIpsum.parseCommand(command),
          start = [cursor.row, cursor.column - command.length],
          isComment = editor.isBufferRowCommented(cursor.row);

        if (!text) return;

        editor.setSelectedBufferRange([start, cursor]);
        editor.insertText(text, { select: true });
        editor.autoIndentSelectedRows();

        if (isComment) {
          editor.languageMode.toggleLineCommentForBufferRow(cursor.row);
          editor.toggleLineCommentsInSelection();
        }
      });
    });

    layer.destroy();
  },
};
