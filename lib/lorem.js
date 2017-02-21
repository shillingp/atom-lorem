'use babel';

// import LoremView from './lorem-view';
import LoremIpsum from "./lorem-ipsum";
import LoremGen from "./lorem-generator";
import { CompositeDisposable } from 'atom';


export default {
  subscriptions: null,
  loremGen: null,

  LoremIpsum: null,

  activate(state) {
    this.loremGen = new LoremGen();

    this.LoremIpsum = new LoremIpsum();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    // this.subscriptions.add(atom.commands.add("atom-workspace", {
    //   "lorem:catch-command": () => this.runLorem()
    // }));
    this.subscriptions.add(atom.commands.add("atom-workspace", {
      "lorem:catch-command": () => this.handleLorem()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {},

  runLorem() {
    var editor = atom.workspace.getActiveTextEditor();
    console.log("lorem\n\n")
    this.loremGen = new LoremGen(editor);
    this.loremGen.checkCommand(editor);
  },

  getLoremCommand(editor) {
    const { row, column } = editor.getCursorBufferPosition(),
          line            = editor.lineTextForBufferRow(row);

    let start   = column,
        end     = column,
        command = "";

    while (start > 0 && (/\S/).test(line.charAt(start - 1))) {
      --start;
    }

    command = editor.getTextInBufferRange([[row, start], [row, end]]);

    if (command.match(/lorem/)) {
      command = command.substring(command.match(/lorem/).index);
    }

    return (command.split("_")[0] === "lorem") ? command : "";
  },

  handleLorem() {
    const editor = atom.workspace.getActiveTextEditor();

    let command = this.getLoremCommand(editor),
        text    = this.LoremIpsum.parseCommand(command),
        end     = editor.getCursorBufferPosition(),
        start   = [end.row, (end.column - command.length)]
    console.log(text)
    // editor.setTextInBufferRange([start, end], text)

    // TODO: fix line indentation
  }
};
