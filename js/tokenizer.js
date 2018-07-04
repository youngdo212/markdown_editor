/*
param {string} text
returns {Array}
*/
function tokenizer(text){
  const tokens = text.split('<br>');
  return tokens.map(token=>token.trim());
}

export {tokenizer}