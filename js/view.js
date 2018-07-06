class Markup{
  constructor(){
    this.$markup = document.querySelector(".markup");
  }
  addNewElem(){
    let newElem = document.createElement("p");
    this.$markup.appendChild(newElem);
  }
  render(element){
    this.$markup.replaceChild(element, this.$markup.lastElementChild);
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