import {parseDecimalInt} from './functions.js';

// Количество процентов масштаба
// за один шаг увеличения / уменьшения изображения
const SCALE_PERCENT_PER_STEP = 25;
// Минимальный масштаб
const SCALE_MIN_VALUE = 25;
// Максимальный масштаб
const SCALE_MAX_VALUE = 100;
// Исходное значение масштаба
const SCALE_INIT_VALUE = 100;

// Элемент формы, в котором отображается текущее значение масштаба
const scaleInputElement = document.querySelector('.scale__control--value');

// Переменная под изображение, к которому будет применяться изменение масштаба
// Ссылка будет передана при инициализации масштаба из модуля формы
// Можно конечно вполне было найти изображение через querySelector, но такой вариант
// показался более логичным. Каждый элемент ищеться только в одном модуле.
// Потому что, если в верстке потом поменяется класс, то придется искать его по всем
// модулям. А так будет достаточно поменять только в одном месте, в модуле формы.
let scaleImageElement;

/*
 * Функция возвращает текущее значение масштаба изображения
 */
const getImageScale = () => parseDecimalInt(scaleInputElement.value);

/*
 * Функция устанавливает переданное значение масштаба в %
 */
const setImageScale = (newScale = SCALE_INIT_VALUE) => {
  scaleImageElement.style.transform = `scale(${newScale / 100})`;
  scaleInputElement.value = `${newScale}%`;
};

/*
 * Инициализация масштаба, в качестве параметра передается
 * ссылка на изображение, для которого меняется масштаб
 */
const initImageScale = (imageElement) => {
  scaleImageElement = imageElement;
  // Установка масштаба по умолчанию
  setImageScale();
};

// Увеличение / уменьшение масштаба на количество шагов step
const incImageScale = (step) => {
  let newScale = getImageScale() + step * SCALE_PERCENT_PER_STEP;
  if (step > 0 && newScale > SCALE_MAX_VALUE) {
    newScale = SCALE_MAX_VALUE;
  } else if (step < 0 && newScale < SCALE_MIN_VALUE) {
    newScale = SCALE_MIN_VALUE;
  }
  setImageScale(newScale);
};

export {initImageScale, setImageScale, incImageScale};
