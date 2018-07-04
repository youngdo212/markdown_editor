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

class Controller{}
class Button{}
class Converter{}