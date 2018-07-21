class Model{
  constructor({converter}){
    this.firstLine = {tagName: '', textContent: '', innerHtml: '', nextLine: null, parentLine: null, elem: null}
    this.lineSet = new Set([this.firstLine]);
    this.converter = converter;

    this.bindReplaceElem = null;
    this.bindInsertAdjacentElem = null;
    this.bindRemoveElem = null;
  }

  deleteChar(lineNumber){
    const targetLine = this._getLine(lineNumber);
    
    if(targetLine.textContent === '') this._deleteLine({lineNumber: lineNumber, targetLine: targetLine});

    else {
      const previousTagName = targetLine.tagName;

      targetLine.textContent = targetLine.textContent.slice(0, targetLine.textContent.length-1);
      this._setTagInfo(targetLine);

      // p -> ''
      if(previousTagName === 'P' && targetLine.tagName === '') this._PToEmpty(targetLine);

      // h -> p
      else if(previousTagName === 'H1' && targetLine.tagName === 'P') this._H1ToP({lineNumber: lineNumber, targetLine: targetLine});
    }
  }

  _PToEmpty(line){
    const nextLine = line.nextLine;
    const parentLine = line.parentLine;

    if(parentLine && nextLine.parentLine === parentLine){
      this._changeParentLine({targetLine: nextLine, newParentLine: nextLine, oldParentLine: parentLine});
      this._inputElemByLine(nextLine, parentLine);
      line.parentLine = null;
      this._inputElemByLine(parentLine);      
    }

    else if(!parentLine && nextLine.parentLine === line){
      this._changeParentLine({targetLine: nextLine, newParentLine: nextLine, oldParentLine: line});
      this._inputElemByLine(nextLine, line);
      this.bindRemoveElem(line.elem);
      line.elem = null;
    }

    else if(parentLine && nextLine.parentLine !== parentLine){
      line.parentLine = null;
      this._inputElemByLine(parentLine);
    }
  }

  _H1ToP({lineNumber, targetLine}){
    const previousLine = this._getLine(lineNumber-1); // lineNumber 가 0인경우
    const nextLine = targetLine.nextLine;

    if(previousLine.tagName === 'P' && nextLine.tagName === 'P'){
      const parentLine = previousLine.parentLine || previousLine;
      targetLine.parentLine = parentLine;
      this._changeParentLine({targetLine: nextLine, newParentLine: parentLine, oldParentLine: nextLine});

      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;
      this.bindRemoveElem(nextLine.elem);
      nextLine.elem = null;

      this._inputElemByLine(parentLine);
    }

    else if(previousLine.tagName === 'P' && nextLine.tagName !== 'P'){
      const parentLine = previousLine.parentLine || previousLine;
      targetLine.parentLine = parentLine;

      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;

      this._inputElemByLine(parentLine);      
    }

    else if(previousLine.tagName !== 'P' && nextLine.tagName === 'P'){
      this._changeParentLine({targetLine: nextLine, newParentLine: targetLine, oldParentLine: nextLine});

      this.bindRemoveElem(nextLine.elem);
      nextLine.elem = null;

      this._inputElemByLine(targetLine);      
    }
  }

  _deleteLine({lineNumber, targetLine}){
    const aboveLine = this._getLine(lineNumber-1); // lineNuber가 0인경우

    aboveLine.nextLine = targetLine.nextLine;
    this.lineSet.delete(targetLine);
  }

  modifyLine({lineNumber, key}){
    const targetLine = this._getLine(lineNumber);

    this._appendChar(targetLine, key);
    this._setTagInfo(targetLine);
    this._syncLine(targetLine);
  }

  _appendChar(line, key){
    line.textContent += key;
  }

  _setTagInfo(line){
    const {tagName, innerHtml} = this.converter(line.textContent);

    line.tagName = tagName;
    line.innerHtml = innerHtml;
  }

  _syncLine(line){
    if(line.tagName === 'P') this._inputElemByLine(line.parentLine || line);

    else if(line.tagName !== 'P') {
      let nextLine = line.nextLine;
      
      let parentLine = line.parentLine || line;

      if(nextLine && nextLine.parentLine === parentLine){
        this._changeParentLine({targetLine: nextLine, newParentLine: nextLine, oldParentLine: parentLine});
        this._inputElemByLine(nextLine, parentLine);
      }

      this._inputElemByLine(line, line.parentLine);
      
      line.parentLine = null;

      if(parentLine) this._inputElemByLine(parentLine);
    }
  }

  // _modifyParentLine(newParentLine, oldParentLine){
  //   newParentLine.parentLine = null;

  //   let line = newParentLine; // 이상하다. while문을 위한 코드
    
  //   while(line = line.nextLine){

  //     if(line.parentLine !== oldParentLine) return;

  //     line.parentLine = newParentLine;
  //   }
  // }

  _changeParentLine({targetLine, newParentLine, oldParentLine}){
    targetLine.parentLine = targetLine === newParentLine ? null : newParentLine;
    
    while(targetLine = targetLine.nextLine) {
      if(targetLine.parentLine !== oldParentLine) return;

      targetLine.parentLine = newParentLine;
    }
  }

  _inputElemByLine(targetLine, previousLine = null) {
    const elemInfo = this._collectElemInfo(targetLine);
    const newElem = this._makeElem(elemInfo);

    if(previousLine) this.bindInsertAdjacentElem(newElem, previousLine.elem);

    else this.bindReplaceElem(newElem, targetLine.elem);

    targetLine.elem = newElem;
  }

  _collectElemInfo(line){
    let parentLine = line;
    let tagName = parentLine.tagName;
    let innerHtml = parentLine.innerHtml;

    while(line = line.nextLine){
      if(line.parentLine !== parentLine) break;
      innerHtml += line.innerHtml;
    }

    return {tagName: tagName, innerHtml: innerHtml};
  }

  _getLine(lineNumber){
    let targetLine = this.firstLine;

    while(--lineNumber){
      targetLine = targetLine.nextLine;
    }

    return targetLine;
  }

  getText(lineNumber){
    let targetLine = this._getLine(lineNumber);
    let text = targetLine.textContent;

    return text;
  }

  _makeElem({tagName, innerHtml}){
    // 공백 문자열일 때
    if(!tagName) return null;

    let elem = document.createElement(tagName);
    elem.innerHTML = innerHtml;
    return elem
  }

  addNewLine(lineNumber){
    let aboveLine = this._getLine(lineNumber);
    let parentLine = aboveLine.parentLine || aboveLine;

    let newLine = {tagName: '', textContent: '', innerHtml: '', nextLine: null, parentLine: parentLine, elem: null};

    // 위의 라인이 헤더일 때
    if(/^H\d$/.test(aboveLine.tagName)) newLine.parentLine = null; // refactor
    // 위의 라인이 공백일 때
    else if(!aboveLine.tagName) newLine.parentLine = null;

    newLine.nextLine = aboveLine.nextLine;
    aboveLine.nextLine = newLine;

    this.lineSet.add(newLine);
  }
}

export {Model};