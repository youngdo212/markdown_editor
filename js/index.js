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
    this.textEditor.bindShowContent(this.showContent.bind(this));
    this.textEditor.bindAddNewLine(this.addNewLine.bind(this));
  }

  replaceElem(newElem, oldElem){
    this.markup.replaceElem(newElem, oldElem);
  }

  insertAdjacentElem(newElem, previousElem){
    this.markup.insertAdjacentElem(newElem, previousElem);
  }

  showContent({line, key}){
    this.model.set({line, key});

    const textContent = this.model.getText(line);

    this.textEditor.render(textContent);
  }

  addNewLine(line){
    this.model.addNewLine(line);
    this.textEditor.appendElem();
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

