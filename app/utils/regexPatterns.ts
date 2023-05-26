export const patterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-z0-9·-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g,
  username: /^[a-zA-Z0-9]{3,20}$/,
  phone: /^\+502 \d{4}-\d{4}$/,
  noSpecialCharacters: /^$|^[a-zA-Z\u00C0-\u017F| \'\`\´\¨\"]+$/,
  noSpeialCharactersWithNumbers: /^$|^[a-zA-Z0-9\u00C0-\u017F| \ \.\'\`\´\¨]+$/,
  genericField: /^$|^[a-zA-Z0-9\u00C0-\u017F|  \r \n \.\-\_\#\&\/\'\"]+$/,
  onlyLetters: /^[a-zA-Z\d]+$/,
  onlyLettersAndNumbers: /^[a-zA-Z0-9]+$/,
  onlyNumbers: /^[0-9]+$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[¡!¿?@#$%^&*=+/\\|()\-\_`´~<>,.:;'"\[\]\{\} ])[A-Za-z\d¡!¿?@#$%^&*=+/\\|()\-\_`´~<>,.:;'"\[\]\{\} ]{8,}$/g,
}
