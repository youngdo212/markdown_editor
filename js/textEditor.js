class TextEditor{
  constructor({textEditor}){
    this.$textEditor = textEditor;
    this.currentElem = null;
    this.currentLine = 0;
    this.bindShowContent = null;
    this.bindAddNewLine = null;

    this.$textEditor.addEventListener('click', ({target}) => {
      target = this.activateElem(target);
      this.setCurrentElem(target);
    })

    document.addEventListener('keydown', ({key}) => {
      if(!this.currentElem) return;
      if(key === 'Shift') return;      
      if(key === 'Enter'){
        this.bindAddNewLine(this.currentLine);
        this.appendElem();
        this.activateElem(this.currentElem);
        return;
      }
      this.type(key);
      this.bindShowContent({line: this.currentLine, textContent: this.currentElem.textContent});
    })
  }
  activateElem(target){
    Array.from(this.$textEditor.children).forEach(Elem => {
      Elem.classList.remove('active');
    })
    if(target.className === 'markdown') target = this.$textEditor.lastElementChild; // re: 위치에 따른 activeElem변화
    target.classList.add('active');
    
    return target;
  }
  type(key){
    if(key === 'Backspace'){
      if(!this.currentElem.textContent){
        this.deleteElem(this.currentElem);
        return
      }
      this.currentElem.textContent = this.currentElem.textContent.slice(0, this.currentElem.textContent.length-1);
    }
    else this.currentElem.textContent += key;
  }
  appendElem(){ // html template?
    if(!this.currentElem) return;
    const Elem = document.createElement('div');
    Elem.setAttribute("data-line", this.currentLine + 1);
    this.currentElem.insertAdjacentElement("afterend", Elem);
    this.setCurrentElem(Elem);
  }
  setCurrentElem(Elem){
    this.currentElem = Elem;
    this.currentLine = Number(Elem.dataset.line);
  }
  deleteElem(Elem){
    const nextCurrentElem = Elem.previousElementSibling;
    if(!nextCurrentElem) return;
    this.$textEditor.removeChild(Elem);
    this.setCurrentElem(nextCurrentElem);
    this.activateElem(this.currentElem);    
  }
}

export {TextEditor};