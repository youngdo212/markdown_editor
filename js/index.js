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
import {Markup, Markdown} from "./view.js";
import {tokenizer} from "./tokenizer.js";
import {lexer} from "./lexer.js";
import {parser} from "./parser.js";

class Controller{
  constructor({button, markdown, markup, converter}){
    this.button = button;
    this.markdown = markdown;
    this.markup = markup;
    this.converter = converter;
    this.button.bindShowContent(this.showContent.bind(this));
  }
  showContent(){
    const text = this.markdown.getText();
    const html = this.converter.run(text);
    this.markup.setHtml(html);
  }
}

class Button{
  constructor(){
    this.$button = document.querySelector('.button');
  }
  bindShowContent(handler){
    this.$button.addEventListener('click', () => {
      handler();
    })
  }
}

class Converter{
  constructor({tokenizer, lexer, parser}){
    this.parser = pipe(tokenizer, lexer, parser);
  }
  run(text){
    const html = this.parser(text);
    return html;
  }
}

const pipe = (...fns) => (value) => fns.reduce((value, fn) => fn(value), value);

const button = new Button();
const markdown = new Markdown();
const markup = new Markup();
const converter = new Converter({tokenizer, lexer, parser});
const controller = new Controller({
  button: button,
  markdown: markdown,
  markup: markup,
  converter: converter
})