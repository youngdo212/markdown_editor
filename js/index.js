/*
class Controller{
  constructor({button, markdown, markup, transpiler})
  showContent(){
    const text = this.markdown.getText();
    const html = this.transpiler.convert(text);
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
class Transpiler{
  constructor({parser, interpreter})
  convert(text){
    const ast = this.parser.run(text);
    const html = this.interpreter.run(ast);
    return html
  }
}
class Parser{
  run(text)
}
class Interpreter{
  run(ast)
}
*/
import {Markup, Markdown} from "./view.js";
import {Parser} from "./parser.js";
import {Interpreter} from "./interpreter.js";

class Controller{}
class Button{}
class Transpiler{}