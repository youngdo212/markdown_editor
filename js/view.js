class Markup{
  constructor(){
    this.$markup = document.querySelector(".markup");
  }
  setHtml(html){
    this.$markup.innerHTML = html;
  }
}
class Markdown{
  constructor(){
    this.$markdown = document.querySelector(".markdown");
  }
  getText(){
    return this.$markdown.innerHTML;
  }
}

export {Markup, Markdown};