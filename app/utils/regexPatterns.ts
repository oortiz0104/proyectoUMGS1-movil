export const patterns = {
  pin: /^[a-zA-Z0-9]{6}$/,
  email: /[a-zA-Z0-9._%+-]+@[a-z0-9·-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g,
  username: /^[a-zA-Z0-9]{3,20}$/,
  identity: /^[0-9 \-]{15}$/i,
  rtn: /^[0-9]{14}$/i,
  phone: /^\+504 \d{4}-\d{4}$/,
  noSpecialCharacters: /^$|^[a-zA-Z\u00C0-\u017F| \ \'\`\´\¨]+$/,
  noSpeialCharactersWithNumbers: /^$|^[a-zA-Z0-9\u00C0-\u017F| \ \.\'\`\´\¨]+$/,
  genericField: /^$|^[a-zA-Z0-9\u00C0-\u017F|  \r \n \.\,\(\)\\-\_\¡\!\¿\?\'\`\´\¨\#\$\%\&\*\/\:\;\'\"]+$/,
  onlyLetters: /^[a-zA-Z\d]+$/,
}
