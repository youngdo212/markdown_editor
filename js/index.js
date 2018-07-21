/*
class Controller{
  constructor({button, markdown, markup, converter})
  showContent(){
    const text = this.markdown.getText();
    const html = this.converter.run(text);
    this.markup.setHtml(html);
  }
}
class Button{
  bindShowContent(handler)
}
class Markdown{
  getText()
}
class Markup{
  setHtml(html)
}
class Converter{
  constructor({tokenizer, lexer, parser}){
    this.parser = pipe(tokenizer, lexer, parser);
  }
  run(text){
    const html = this.parser(text);
    return html
  }
}
// modules
index.js {Controller, Button, Converter}
view.js {Markdown, Markup}
tokenizer.js {tokenizer}
lexer.js {lexer}
parser.js {parser}
*/
import {Markup} from "./view.js";
import {TextEditor} from "./textEditor.js";
import {converter} from "./converter.js";
import {Model} from "./model.js";

// class Controller{
//   constructor({textEditor, markup, converter}){
//     this.textEditor = textEditor;
//     this.markup = markup;
//     this.converter = converter;

//     this.textEditor.bindShowContent = this.showContent.bind(this)
//   }
//   showContent({line, text}){
//     let node = this.converter(text);
//     this.markup.input({line: line, node: node});
//   }
// }

class Controller{
  constructor({textEditor, model, markup}){
    this.textEditor = textEditor;
    this.model = model;
    this.markup = markup;

    this.model.bindReplaceElem = this.replaceElem.bind(this);
    this.model.bindInsertAdjacentElem = this.insertAdjacentElem.bind(this);
    this.model.bindRemoveElem = this.removeElem.bind(this);
    this.textEditor.bindPressAnyKey(this.showContent.bind(this));
    this.textEditor.bindPressEnterKey(this.addNewLine.bind(this));
    this.textEditor.bindPressDeleteKey(this.delete.bind(this));
  }

  replaceElem(newElem, oldElem){
    this.markup.replaceElem(newElem, oldElem);
  }

  insertAdjacentElem(newElem, previousElem){
    this.markup.insertAdjacentElem(newElem, previousElem);
  }

  removeElem(elem){
    this.markup.removeElem(elem);
  }

  showContent({lineNumber, key}){
    this.model.modifyLine({lineNumber, key});

    const textContent = this.model.getText(lineNumber);

    this.textEditor.render(textContent);
  }

  addNewLine(lineNumber){
    this.model.addNewLine(lineNumber);
    this.textEditor.addLine();
  }

  delete(lineNumber){ // naming
    this.model.deleteChar(lineNumber);

    const textContent = this.model.getText(lineNumber);

    this.textEditor.render(textContent);
  }
}

const textEditor = new TextEditor({
  textEditor: document.querySelector(".markdown")
});

const markup = new Markup({
  markup: document.querySelector('.markup')
});

const model = new Model({
  converter: converter
})

const controller = new Controller({
  textEditor: textEditor,
  markup: markup,
  model: model
})

