/*
param {Array} tokens
returns {Array}
*/
function lexer(tokens){
  return tokens.map(token => insertTag(token));
}

function insertTag(token){
  // line tag
  token = insertHeaderTag(token);
  token = insertListTag(token);

  // inline tag
  token = insertBoldTag(token);

  return token;
}

function insertHeaderTag(token){
  return token.replace(/^\# /, '<h1>');
}

function insertListTag(token){
  return token.replace(/^\* /, '<ul><li>');
}

function insertBoldTag(token){
  return token.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

export {lexer}