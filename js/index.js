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

class Controller{
  constructor({textEditor, markup, converter}){
    this.textEditor = textEditor;
    this.markup = markup;
    this.converter = converter;

    this.textEditor.bindAddNewLine = this.addNewLine.bind(this)
    this.textEditor.bindShowContent = this.showContent.bind(this)
  }
  addNewLine(){
    this.markup.addNewElem();
  }
  showContent(text){
    let elem = this.converter(text);
    this.markup.render(elem);
  }
}


const textEditor = new TextEditor();
const markup = new Markup();
const controller = new Controller({
  textEditor: textEditor,
  markup: markup,
  converter: converter
})