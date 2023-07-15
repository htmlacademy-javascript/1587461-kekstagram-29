// База десятичной системы счисления
// Указывается вторым необязательным параметром
// при преобразовании строки в число
const DECIMAL_BASE = 10;

/*
 * Функция проверяет длину строки str.
 * Если длина меньше или равна значению maxLength, возвращается true.
 * В противном случае возвращается false.
 */
export const checkStringLength = (str, maxLength) => str.length <= maxLength;

/*
 * Функция проверяет, является ли строка str палиндроном.
 * При проверке не учитывается регистр символов, удаляются пробелы.
 */
export const isPalindrome = (str) => {
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

/*
 * Функция извлекает цифры из строки str и возвращает их в виде целого числа
 */
export const extractDigitsFromStr = (str) => {
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

/*
 * Функция возвращает случайное положительное целое число
 * в диапазоне между числами value1 и value2
 */
export const getRandomPositiveInt = (value1, value2) => {
  // Значения параметров берутся по модулю
  value1 = Math.abs(value1);
  value2 = Math.abs(value2);
  // Определяется минимальное значение из двух параметров
  // Заодно выполняется округление (если значение параметра не целое число)
  const minValue = Math.ceil(Math.min(value1, value2));
  // Определяется длина диапазона для поиска случайного целого числа
  // Это разница между максимальным и минимальным значением, плюс 1
  const interval = Math.floor(Math.max(value1, value2)) - minValue + 1;
  // Выполняется поиск случайного значения в диапазоне и его округление
  return Math.floor(interval * Math.random() + minValue);
};

/*
 * Частный случай предыдущей функции, возвращает случайное булево значение
 */

export const getRandomBoolean = () => (getRandomPositiveInt(0, 1) === 1);

/*
 * Функция возвращает случайный индекс массива arr
 */
export const getRandomArrayIndex = (arr) => getRandomPositiveInt(0, arr.length - 1);

/*
 * Функция возвращает массив из последовательных целых чисел
 * в диапазоне от параметра from до параметра to.
 * Функция нужна, чтобы потом можно было перемешать значения в случайном порядке и получить
 * массив неповторяющихся перемешанных целых чисел
 */
const getIntNumberArray = (from, to) => {
  const result = [];
  // Здесь все просто, в массив в цикле последовательно добавляются целые числа
  for (let i = from; i <= to; i++) {
    result.push(i);
  }
  return result;
};

/*
 * Функция возвращает массив из целых чисел в диапазоне от параметра from до параметра to
 * в случайном порядке. Используется для того, чтобы перемешивать фотографии,
 * авторов комментариев и т.д.
 */
export const getRandomIntNumberArray = (from, to) => {
  // Сначала получаем последовательный масств целых чисел
  const source = getIntNumberArray(from, to);
  const result = [];
  // Далее в цикле выбираем элементы со случайными индексами
  // и переносим их в новый массив. Таким образом они и перемешиваются
  while (source.length > 0) {
    // Выбор случайного индекса
    const randomIndex = getRandomArrayIndex(source);
    // Добавление его в новый массив
    result.push(source[randomIndex]);
    // Удаление из старого массива
    source.splice(randomIndex, 1);
  }
  return result;
};

/*
 * Небольшая сервисная функция, которая устанавливает два значения свойств
 * для переданного в качестве параметра img объекта - изображения.
 * Значения свойств передаются через параметры src и alt.
 * Такой код встречается в проекте несколько раз в разных модулях,
 * поэтому был вынесен в отдельную функцию
 */
export const setImgProps = (img, src, alt) => {
  img.src = src;
  img.alt = alt;
};

/*
 * Функция проверяет, что была нажата клавиша Escape на основе переданного события
 */
export const isEscButton = (evt) => evt.key === 'Escape';
