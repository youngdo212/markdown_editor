function converter(text){
  const {tagName, textContent} = makeElemInfo(text);
  return makeElement(tagName, textContent);
}

function makeElemInfo(text){
  if(isHeader(text)) return {tagName: 'h1', textContent: text.slice(2)};
  return {tagName: 'p', textContent: text};
}

function isHeader(text){
  return /^# /.test(text);
}

function makeElement(tagName, textContent){
  const elem = document.createElement(tagName);
  const textNode = document.createTextNode(textContent);
  
  elem.appendChild(textNode);
  
  return elem;
}

export {converter}