class TextEditor{
  constructor({textEditor}){
    this.$textEditor = textEditor;
    this.$currentElem = null;
    this.addAllEventListener();
  }
  
  // markup 클릭했을 시 deactive 기능 추가해야 함
  addAllEventListener(){
    this.$textEditor.addEventListener('click', ({target}) => {
      if(target === this.$textEditor) target = this.$textEditor.lastElementChild;
      this._activateElem(target);
    })
  }

  bindShowContent(handler){
    document.addEventListener('keydown', ({key}) => {
      if(!this.$currentElem) return;
      if(key === 'Shift') return;
      if(key === 'Enter') return;

      const currentLine = this._getLine(this.$currentElem);
      
      handler({line: currentLine, key: key});
    });
  }

  bindAddNewLine(handler){
    document.addEventListener('keydown', ({key}) => {
      if(!this.$currentElem) return;
      if(key !== 'Enter') return;

      const currentLine = this._getLine(this.$currentElem);      

      handler(currentLine);
    })
  }

  render(text){
    this.$currentElem.textContent = text;
  }
  
  _getLine(elem){
    let line = 1;

    while(elem = elem.previousElementSibling){
      line++;
    }

    return line;
  }

  appendElem(){
    const Elem = document.createElement('div');

    this.$currentElem.insertAdjacentElement("afterend", Elem);

    this._activateElem(Elem)
  }

  _activateElem(elem){
    Array.from(this.$textEditor.children).forEach(elem => {
      elem.classList.remove('active');
    })
    
    elem.classList.add('active');

    this.$currentElem = elem;
  }

  // _pressKey(key){
  //   if(key === 'Backspace'){
  //     if(!this.$currentElem.textContent){
  //       this.deleteElem(this.$currentElem);
  //       return
  //     }
  //     this.$currentElem.textContent = this.$currentElem.textContent.slice(0, this.$currentElem.textContent.length-1);
  //   }
  //   else this.$currentElem.textContent += key;
  //   this.$currentElem.textContent += key;
  // }
  
  deleteElem(Elem){
    const nextCurrentElem = Elem.previousElementSibling;
    if(!nextCurrentElem) return;
    this.$textEditor.removeChild(Elem);
    this._setCurrentElem(nextCurrentElem);
    this._activateElem(this.$currentElem);    
  }
}

export {TextEditor};