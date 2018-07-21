class TextEditor{
  constructor({textEditor}){
    this.$textEditor = textEditor;
    this.$currentLine = null;
    this._addAllEventListener();
  }
  
  _addAllEventListener(){
    this.$textEditor.addEventListener('click', ({target}) => {
      if(target === this.$textEditor) target = this.$textEditor.lastElementChild;

      this._activateLine(target);
    })

    document.addEventListener('click', ({target}) => {
      if(this.$textEditor.contains(target)) return;
      this._deactivateLines();
    })
  }

  bindPressAnyKey(handler){
    document.addEventListener('keydown', ({key}) => {
      if(!this.$currentLine) return;
      if(key === 'Shift') return;
      if(key === 'Enter') return;
      if(key === 'Backspace') return;

      const currentLineNumber = this._getLineNumber(this.$currentLine);
      
      handler({lineNumber: currentLineNumber, key: key});
    });
  }

  bindPressEnterKey(handler){
    document.addEventListener('keydown', ({key}) => {
      if(!this.$currentLine) return;
      if(key !== 'Enter') return;

      const currentLineNumber = this._getLineNumber(this.$currentLine);

      handler(currentLineNumber);
    })
  }

  bindPressDeleteKey(handler){
    document.addEventListener('keydown', ({key}) => {
      if(!this.$currentLine) return;
      if(key !== 'Backspace') return;
      
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

  addLine(){
    const line = document.createElement('div');

    this.$currentLine.insertAdjacentElement("afterend", line);

    this._activateLine(line)
  }

  _activateLine(line){
    this._deactivateLines();
    
    line.classList.add('active');

    this.$currentLine = line;
  }

  _deactivateLines(){
    Array.from(this.$textEditor.children).forEach(line => {
      line.classList.remove('active');
    })

    this.$currentLine = null;
  }

  deleteLine(){
    if(this.$textEditor.children.length === 1) return;

    const nextCurrentLine = this.$currentLine.previousElementSibling || this.$currentLine.nextElementSibling;
    this.$textEditor.removeChild(this.$currentLine);

    this._activateLine(nextCurrentLine);
  }
}

export {TextEditor};