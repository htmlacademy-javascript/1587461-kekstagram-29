// База десятичной системы счисления
// Указывается вторым необязательным параметром
// при преобразовании строки в число
const DECIMAL_BASE = 10;

/*
 * Функция преобразует строку в целое число в десятичной системе считсления.
 * Использовать стандартную функцию parseInt неудобно из-за второго параметра,
 * который задает систему счисления. Так как преобразование используется в
 * нескольких модулях и всегда в десятичную систему, то показалось логичным
 * сделать такую функцию для повторного использования только с одним параметром
 */
export const parseDecimalInt = (str) => parseInt(str, DECIMAL_BASE);

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
    const currentChar = parseDecimalInt(str.at(i));
    if (!Number.isNaN(currentChar)) {
      result += str.at(i);
    }
  }
  // В заключении строка из цифр преобразуется в целое число
  return parseDecimalInt(result);
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
 * Небольшая сервисная функция, которая устанавливает два значения свойств
 * для переданного в качестве параметра imgElement объекта - изображения.
 * Значения свойств передаются через параметры src и alt.
 * Такой код встречается в проекте несколько раз в разных модулях,
 * поэтому был вынесен в отдельную функцию
 */
export const setImgProps = (imgElement, src, alt) => {
  imgElement.src = src;
  imgElement.alt = alt;
};

/*
 * Функция проверяет, что была нажата клавиша Escape на основе переданного события
 */
export const isEscButton = (evt) => evt.key === 'Escape';

/*
 * Функция выполняет отображение / скрытие dom-элемента, переданного
 * через аргумент element, в зависимости от значения параметра visible
 */
export const showHideObject = (element, visible) => {
  if (visible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
};

/*
 * Функция модально показывает / скрывает dom-элемент, передаваемый через
 * параметр element. Видимость определяется булевым параметром visible.
 * Через параметр onKeyDown передается ссылка на обработчик события
 * нажатия клавиш. Используется для показа большой фотографии, формы
 * изображения.
 */
export const showHideModalElement = (element, visible, onKeyDown) => {
  const bodyElement = document.querySelector('body');
  // Собственно отображение / скрытие элемента
  showHideObject(element, visible);
  // Помимо этого еще необходимо добавлять / удалять класс modal-open тегу body страницы
  // Это нужно для того, чтобы страница позади не прокручивалась при скроле
  // Наконец, устанавливается / удаляется обработчик события нажатия на клавишу
  if (visible) {
    bodyElement.classList.add('modal-open');
    document.addEventListener('keydown', onKeyDown);

  } else {
    bodyElement.classList.remove('modal-open');
    document.removeEventListener('keydown', onKeyDown);
  }
};

/*
 * Функция определяет, находится ли фокус на переданном через параметр элементе
 */
export const isFocusedElement = (element) => document.activeElement === element;

/*
 * Функция выполняет проверку наличия дубликатов в массиве values.
 * Если дубликаты найдены, то возвращается значение true.
 * Второй необязательный параметр позволяет выбрать: учитывать регистр или нет
 */
export const checkArrayHasDuplicates = (values, caseSensitive = false) => {
  let checkValues = values;
  // Если поиск дубликатов выполняется без учета регистра,
  // то все элементы массива приводятся к одному регистру (нижнему)
  if (!caseSensitive) {
    checkValues = checkValues.map((value) => value.toLowerCase());
  }
  // Проще всего получить только уникальные элементы массива,
  // если преобразовать его во множество.
  // Размер множества - количество уникальных элементов
  const distinctCount = new Set(checkValues).size;
  // Если количество уникальных элементов меньше общего количества,
  // значит есть дубликаты
  return distinctCount < checkValues.length;
};

/*
 * Функция выполняет установку / удаление обработчиков событий.
 * Параметр add определяет, что именно нужно делать. Если true -
 * обработчики добавляются, в противном случае удаляются.
 * Элементы, типы событий и ссылки на функции передаются в виде
 * массива объектов. Из-за обработчиков для каждого модального элемента,
 * которвые необходимо постоянно добавлять и удалять, такое решение
 * показалось привлекательным. Оно гарантирует, что один раз описываются
 * события и просто вызывается функция. Ничего не потеряется и не будет
 * утечек памяти.
 */
export const processEvents = (events, add) => {
  events.forEach(({element, type, listener}) => {
    if (add) {
      element.addEventListener(type, listener);
    } else {
      element.removeEventListener(type, listener);
    }
  });
};

/*
 * Функция для устранения "дребезга" при перерисовке фотографий
 * Функция взята из интернета и доработана
 * Источник - https://www.freecodecamp.org/news/javascript-debounce-example
 */
export function debounce(callback, timeoutDelay = 500) {
  // Используем замыкания, чтобы id таймаута у нас навсегда приклеился
  // к возвращаемой функции с setTimeout, тогда мы его сможем перезаписывать
  let timeoutId;

  return (...rest) => {
    // Перед каждым новым вызовом удаляем предыдущий таймаут,
    // чтобы они не накапливались
    clearTimeout(timeoutId);

    // Затем устанавливаем новый таймаут с вызовом колбэка на ту же задержку
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);

    // Таким образом цикл «поставить таймаут - удалить таймаут» будет выполняться,
    // пока действие совершается чаще, чем переданная задержка timeoutDelay
  };
}
