// class Markup{
//   constructor(){
//     this.$markup = document.querySelector(".markup");
//     this.parentNode = this.$markup;
//     this.currentNode = this.parentNode.firstChild;
//     this.lastLine = 1;
//   }

//   setCurrentNode(node){
//     this.currentNode = node;
//     this.parentNode = node.parentNode;
//   }

//   input({line, node}){
//     if(line - this.lastLine > 1) this.addNewElem(node);
    
//     else if(this.isNewLine(line)) this.addNewNode(node);
    
//     else this.replace(node);

//     this.lastLine = line;
//   }
  
//   replace(node) { // 리팩토링
//     // this.currentNode가 textNode, node가 p
//     if(this.currentNode.nodeType === 3 && node.tagName === 'P'){
//       node = node.firstChild;
//       this.parentNode.replaceChild(node, this.currentNode);
//     }

//     // this.currentNode가 textNode, node !== p: 태그로 바뀜
//     else if(this.currentNode.nodeType === 3 && node.tagName !== 'P'){
//       this.parentNode.removeChild(this.currentNode);
//       this.$markup.appendChild(node);
//     }

//     // this.cuttentNode가 Elem, node가 !== p 
//     else if(this.currentNode.nodeType === 1){
//       this.parentNode.replaceChild(node, this.currentNode);
//     }

//     // this.currnetNode가 Elem, node가 p : delete로 다시 p가 됨
//     // else if(this.currentNode.nodeType === 1 && node.tagName === 'P'){
//     //   node = node.firstChild;
//     //   this.currentNode.previousSibling.appendChild(node);
//     //   this.parentNode.removeChild(this.currentNode);
//     // }

//     this.setCurrentNode(node);    
//   }

//   isNewLine(line){
//     return line > this.lastLine;
//   }

//   addNewNode(node){
//     if(node.tagName === 'P' && this.currentNode.tagName !== 'H1') this.addTextNode(node.firstChild);

//     else this.addNewElem(node);
//   }
  
//   addTextNode(textNode){
//     if(this.currentNode.nodeType === 1) this.setCurrentNode(this.currentNode.firstChild);

//     this.parentNode.appendChild(textNode);
    
//     this.setCurrentNode(textNode);
//   }

//   addNewElem(elem) {
//     this.$markup.appendChild(elem);
//     this.setCurrentNode(elem);
//   }
// }


class Markdown{
  constructor(){
    this.$markdown = document.querySelector(".markdown");
  }
  getText(){
    return this.$markdown.innerHTML;
  }
}

export {Markup, Markdown};

class Markup{
  constructor({markup}){
    this.$markup = markup;
  }

  replaceElem(newElem, oldElem){
    // 맨 처음 상태
    if(!oldElem) this.$markup.appendChild(newElem);

    else this.$markup.replaceChild(newElem, oldElem);
  }

  insertAdjacentElem(newElem, nextElem){
    // 공백 문자열일 때
    if(!newElem) return;

    nextElem.insertAdjacentElement('beforebegin', newElem);
  }

  removeElem(elem){
    this.$markup.removeChild(elem);
  }
}