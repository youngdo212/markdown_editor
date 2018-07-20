class TextEditor{
  constructor({textEditor}){
    this.$textEditor = textEditor;
    this.$currentLine = null;
    this._addAllEventListener();
  }
  
  // markup 클릭했을 시 deactive 기능 추가해야 함
  _addAllEventListener(){
    this.$textEditor.addEventListener('click', ({target}) => {
      if(target === this.$textEditor) target = this.$textEditor.lastElementChild;
      this._activateLine(target);
    })
  }

  bindShowContent(handler){
    document.addEventListener('keydown', ({key}) => {
      if(!this.$currentLine) return;
      if(key === 'Shift') return;
      if(key === 'Enter') return;

      const currentLineNumber = this._getLineNumber(this.$currentLine);
      
      handler({lineNumber: currentLineNumber, key: key});
    });
  }

  bindAddNewLine(handler){
    document.addEventListener('keydown', ({key}) => {
      if(!this.$currentLine) return;
      if(key !== 'Enter') return;

      const currentLineNumber = this._getLineNumber(this.$currentLine);      

      handler(currentLineNumber);
    })
  }

  render(text){
    this.$currentLine.textContent = text;
  }
  
  _getLineNumber(line){
    let lineNumber = 1;

    while(line = line.previousElementSibling){
      lineNumber++;
    }

    return lineNumber;
  }

  appendLine(){
    const line = document.createElement('div');

    this.$currentLine.insertAdjacentElement("afterend", line);

    this._activateLine(line)
  }

  _activateLine(line){
    Array.from(this.$textEditor.children).forEach(line => {
      line.classList.remove('active');
    })
    
    line.classList.add('active');

    this.$currentLine = line;
  }

  // _pressKey(key){
  //   if(key === 'Backspace'){
  //     if(!this.$currentLine.textContent){
  //       this.deleteElem(this.$currentLine);
  //       return
  //     }
  //     this.$currentLine.textContent = this.$currentLine.textContent.slice(0, this.$currentLine.textContent.length-1);
  //   }
  //   else this.$currentLine.textContent += key;
  //   this.$currentLine.textContent += key;
  // }
  
  deleteElem(Elem){
    const nextCurrentLine = Elem.previousElementSibling;
    if(!nextCurrentLine) return;
    this.$textEditor.removeChild(Elem);
    this._setCurrentLine(nextCurrentLine);
    this._activateElem(this.$currentLine);    
  }
}

export {TextEditor};