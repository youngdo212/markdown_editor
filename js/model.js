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
    const previousTagName = targetLine.tagName;

    targetLine.textContent = targetLine.textContent.slice(0, -1);
    this._setTagInfo(targetLine);

    // p -> ''
    if(previousTagName === 'P' && targetLine.tagName === '') this._PToEmpty({lineNumber: lineNumber, targetLine: targetLine});

    // h -> p
    else if(previousTagName === 'H1' && targetLine.tagName === 'P') this._H1ToP({lineNumber: lineNumber, targetLine: targetLine});

    else this._inputElemByLine(targetLine.parentLine || targetLine);
  }

  deleteLine(lineNumber){
    const targetLine = this._getLine(lineNumber);
    const previousLine = this._getLine(lineNumber-1);
    const nextLine = targetLine.nextLine;

    // 지울 라인이 없을 때
    if(!previousLine && !nextLine) return;

    const previousLineTagName = previousLine ? previousLine.tagName : previousLine;
    const nextLineTagName = nextLine ? nextLine.tagName : nextLine;

    // refactor
    if(!previousLine) this.firstLine = targetLine.nextLine;
    else previousLine.nextLine = targetLine.nextLine;

    this.lineSet.delete(targetLine);

    if(previousLineTagName === 'P' && nextLineTagName === 'P'){
      const parentLine = previousLine.parentLine || previousLine;
      this._changeParentLine({targetLine: nextLine, newParentLine: parentLine, oldParentLine: nextLine});

      this.bindRemoveElem(nextLine.elem);
      nextLine.elem = null;

      this._inputElemByLine(parentLine);
    }
  }

  _PToEmpty({lineNumber, targetLine}){
    const previousLine = this._getLine(lineNumber-1);
    const nextLine = targetLine.nextLine;

    const previousLineTagName = previousLine ? previousLine.tagName : previousLine;
    const nextLineTagName = nextLine ? nextLine.tagName : nextLine;

    if(previousLineTagName === 'P' && nextLineTagName === 'P'){
      const parentLine = targetLine.parentLine;      
      this._changeParentLine({targetLine: nextLine, newParentLine: nextLine, oldParentLine: parentLine});
      this._inputElemByLine(nextLine, parentLine);
      targetLine.parentLine = null;
      this._inputElemByLine(parentLine);      
    }

    else if(previousLineTagName !== 'P' && nextLineTagName === 'P'){
      this._changeParentLine({targetLine: nextLine, newParentLine: nextLine, oldParentLine: targetLine});
      this._inputElemByLine(nextLine, targetLine);
      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;
    }

    else if(previousLineTagName === 'P' && nextLineTagName !== 'P'){
      const parentLine = targetLine.parentLine;
      targetLine.parentLine = null;
      this._inputElemByLine(parentLine);
    }

    else if(previousLineTagName !== 'P' && nextLineTagName !== 'P'){
      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;
    }
  }

  _H1ToP({lineNumber, targetLine}){
    const previousLine = this._getLine(lineNumber-1);
    const nextLine = targetLine.nextLine;

    const previousLineTagName = previousLine ? previousLine.tagName : previousLine;
    const nextLineTagName = nextLine ? nextLine.tagName : nextLine;

    if(previousLineTagName === 'P' && nextLineTagName === 'P'){
      const parentLine = previousLine.parentLine || previousLine;
      targetLine.parentLine = parentLine;
      this._changeParentLine({targetLine: nextLine, newParentLine: parentLine, oldParentLine: nextLine});

      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;
      this.bindRemoveElem(nextLine.elem);
      nextLine.elem = null;

      this._inputElemByLine(parentLine);
    }

    else if(previousLineTagName === 'P' && nextLineTagName !== 'P'){
      const parentLine = previousLine.parentLine || previousLine;
      targetLine.parentLine = parentLine;

      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;

      this._inputElemByLine(parentLine);      
    }

    else if(previousLineTagName !== 'P' && nextLineTagName === 'P'){
      this._changeParentLine({targetLine: nextLine, newParentLine: targetLine, oldParentLine: nextLine});

      this.bindRemoveElem(nextLine.elem);
      nextLine.elem = null;

      this._inputElemByLine(targetLine);      
    }

    else if(previousLineTagName !== 'P' && nextLineTagName !== 'P'){
      this._inputElemByLine(targetLine);
    }
  }

  modifyLine({lineNumber, key}){
    const targetLine = this._getLine(lineNumber);
    const previousTagName = targetLine.tagName;

    this._appendChar(targetLine, key);
    this._setTagInfo(targetLine);

    // 공백 -> p태그
    if(previousTagName === '' && targetLine.tagName === 'P') this._modifyLineEmptyToP({lineNumber: lineNumber, targetLine: targetLine});

    else if(previousTagName === 'P' && targetLine.tagName === 'H') this._cutLine({lineNumber: lineNumber, targetLine: targetLine});

    else this._inputElemByLine(targetLine.parentLine || targetLine);
  }

  _appendChar(line, key){
    line.textContent += key;
  }

  _setTagInfo(line){
    const {tagName, innerHtml} = this.converter(line.textContent);

    line.tagName = tagName;
    line.innerHtml = innerHtml;
  }

  _modifyLineEmptyToP({lineNumber, targetLine}){

    // *** this._H1ToP와 매우 흡사
    const previousLine = this._getLine(lineNumber-1);
    const nextLine = targetLine.nextLine;

    const previousLineTagName = previousLine ? previousLine.tagName : previousLine;
    const nextLineTagName = nextLine ? nextLine.tagName : nextLine;

    if(previousLineTagName === 'P' && nextLineTagName === 'P'){
      const parentLine = previousLine.parentLine || previousLine;
      targetLine.parentLine = parentLine;
      this._changeParentLine({targetLine: nextLine, newParentLine: parentLine, oldParentLine: nextLine});

      // this._H1ToP
      /*
      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;
      */
      this.bindRemoveElem(nextLine.elem);
      nextLine.elem = null;

      this._inputElemByLine(parentLine);
    }

    else if(previousLineTagName === 'P' && nextLineTagName !== 'P'){
      const parentLine = previousLine.parentLine || previousLine;
      targetLine.parentLine = parentLine;

      // this._H1ToP
      /*
      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;
      */

      this._inputElemByLine(parentLine);      
    }

    else if(previousLineTagName !== 'P' && nextLineTagName === 'P'){
      this._changeParentLine({targetLine: nextLine, newParentLine: targetLine, oldParentLine: nextLine});

      this.bindRemoveElem(nextLine.elem);
      nextLine.elem = null;

      this._inputElemByLine(targetLine);      
    }

    else if(previousLineTagName !== 'P' && nextLineTagName !== 'P'){
      this._inputElemByLine(targetLine, previousLine); // this._H1ToP에서 previousLine 인자만 추가
    }
  }

  _cutLine({lineNumber, targetLine}){

    // *** this._PToEmpty와 매우 흡사
    const previousLine = this._getLine(lineNumber-1);
    const nextLine = targetLine.nextLine;

    const previousLineTagName = previousLine ? previousLine.tagName : previousLine;
    const nextLineTagName = nextLine ? nextLine.tagName : nextLine;

    if(previousLineTagName === 'P' && nextLineTagName === 'P'){
      const parentLine = targetLine.parentLine;      
      this._changeParentLine({targetLine: nextLine, newParentLine: nextLine, oldParentLine: parentLine});
      this._inputElemByLine(nextLine, parentLine);
      targetLine.parentLine = null;
      this._inputElemByLine(targetLine, parentLine); // _cutLine에만 추가된 요소
      this._inputElemByLine(parentLine);      
    }

    else if(previousLineTagName !== 'P' && nextLineTagName === 'P'){
      this._changeParentLine({targetLine: nextLine, newParentLine: nextLine, oldParentLine: targetLine});
      this._inputElemByLine(nextLine, targetLine);
      this._inputElemByLine(targetLine); // _cutLine에만 추가된 요소

      // this._PToEmpty
      /*
      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;
      */
    }

    else if(previousLineTagName === 'P' && nextLineTagName !== 'P'){
      const parentLine = targetLine.parentLine;
      targetLine.parentLine = null;
      this._inputElemByLine(targetLine, parentLine); // _cutLine에만 추가된 요소      
      this._inputElemByLine(parentLine);
    }

    else if(previousLineTagName !== 'P' && nextLineTagName !== 'P'){
      // this._PToEmpty
      /*      
      this.bindRemoveElem(targetLine.elem);
      targetLine.elem = null;
      */
     this._inputElemByLine(targetLine);
    }
  }

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
    if(lineNumber === 0) return null;

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
    let previousLine = this._getLine(lineNumber);
    
    let newLine = {tagName: '', textContent: '', innerHtml: '', nextLine: null, parentLine: null, elem: null};
    
    // // 위의 라인이 헤더일 때
    // if(/^H\d$/.test(previousLine.tagName)) newLine.parentLine = null; // refactor
    // // 위의 라인이 공백일 때
    // else if(!previousLine.tagName) newLine.parentLine = null;
    
    newLine.nextLine = previousLine.nextLine;
    previousLine.nextLine = newLine;
    
    this.lineSet.add(newLine);

    
    let nextLine = newLine.nextLine;
    let parentLine = previousLine.parentLine || previousLine;

    if(previousLine.tagName === 'P' && nextLine ? nextLine.tagName : nextLine === 'P'){
      this._changeParentLine({targetLine: nextLine, newParentLine: nextLine, oldParentLine: parentLine});
      this._inputElemByLine(nextLine, parentLine);
      this._inputElemByLine(parentLine);
    }
  }
}

export {Model};