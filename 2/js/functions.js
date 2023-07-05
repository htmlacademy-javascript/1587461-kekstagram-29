// База десятичной системы счисления
// Указывается вторым необязательным параметром
// при преобразовании строки в число
const DECIMAL_BASE = 10;

/*
 * Функция проверяет длину строки str.
 * Если длина меньше или равна значению maxLength, возвращается true.
 * В противном случае возвращается false.
 */
const checkStringLength = (str, maxLength) => str.length <= maxLength;

// Проверка работы функции checkStringLength
// Cтрока короче 20 символов
// console.log(checkStringLength('проверяемая строка', 20)); // true
// Длина строки ровно 18 символов
// console.log(checkStringLength('проверяемая строка', 18)); // true
// Строка длиннее 10 символов
// console.log(checkStringLength('проверяемая строка', 10)); // false

/*
 * Функция проверяет, является ли строка str палиндроном.
 * При проверке не учитывается регистр символов, удаляются пробелы.
 */
const isPalindrome = (str) => {
  // По умолчанию считаем, что строка - полиндром
  let result = true;
  // Удаляем из строки пробелы, приводим к верхнему регистру
  const preparedStr = str.replaceAll(' ', '').toUpperCase();
  // Для удобства индекс последнего символа строки помещается в переменную,
  // чтобы не считать каждый раз
  const lastCharIndex = preparedStr.length - 1;
  // На самом деле требуется сверить первую половину строки со второй половиной
  // в обратном порядке. Поэтому число итераций цикла будет равно половине длины строки
  const halfStrLength = preparedStr.length / 2;
  // В цикле сравниваем первый символ с последний, второй с предпоследним и т.д.
  for (let i = 0; i <= halfStrLength; i++) {
    result = preparedStr.at(i) === preparedStr.at(lastCharIndex - i);
    // После первого несовпадения нет смысла делать дальнейшую проверку,
    // строка уже не будет палиндромом, можно прекращать цикл
    if (!result) {
      break;
    }
  }
  return result;
};

// Проверка работы функции isPalindrome
// Строка является палиндромом
// console.log(isPalindrome('топот')); // true
// Несмотря на разный регистр, тоже палиндром
// console.log(isPalindrome('ДовОд')); // true
// Это не палиндром
// console.log(isPalindrome('Кекс')); // false
// Это палиндром
// console.log(isPalindrome('Лёша на полке клопа нашёл ')); // true

/*
 * Функция извлекает цифры из строки str и возвращает их в виде целого числа
 */
const extractDigitsFromStr = (str) => {
  // По умолчанию результат - пустая строка
  let result = '';
  // На случай если было передано число, оно преобразуется в строку
  str = str.toString();
  // В цикле разбирается каждый символ строка
  for (let i = 0; i < str.length; i++) {
    const currentChar = parseInt(str.at(i), DECIMAL_BASE);
    if (!Number.isNaN(currentChar)) {
      result += str.at(i);
    }
  }
  // В заключении строка из цифр преобразуется в целое число
  return parseInt(result, DECIMAL_BASE);
};

// Проверка работы функции extractDigitsFromStr
//console.log(extractDigitsFromStr('2023 год')); // 2023
//console.log(extractDigitsFromStr('ECMAScript 2022')); // 2022
//console.log(extractDigitsFromStr('1 кефир, 0.5 батона')); // 105
//console.log(extractDigitsFromStr('агент 007')); // 7
//console.log(extractDigitsFromStr('а я томат')); // NaN
//console.log(extractDigitsFromStr(2023)); // 2023
//console.log(extractDigitsFromStr(-1)); // 1
//console.log(extractDigitsFromStr(1.5)); // 15
