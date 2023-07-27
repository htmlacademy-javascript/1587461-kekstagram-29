import {parseDecimalInt} from './functions.js';

// Минимальный масштаб
const SCALE_MIN_VALUE = 25;
// Максимальный масштаб
const SCALE_MAX_VALUE = 100;
// Исходное значение масштаба
const SCALE_INIT_VALUE = 100;

// Элемент формы, в котором отображается текущее значение масштаба
const scaleInputElement = document.querySelector('.scale__control--value');
// Картинка, для которой меняется масштаб
const scaleImageElement = document.querySelector('.img-upload__preview img');

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

// Увеличение / уменьшение масштаба на количество шагов step
const incImageScale = (step) => {
  let newScale = getImageScale() + step;
  if (step > 0 && newScale > SCALE_MAX_VALUE) {
    newScale = SCALE_MAX_VALUE;
  } else if (step < 0 && newScale < SCALE_MIN_VALUE) {
    newScale = SCALE_MIN_VALUE;
  }
  setImageScale(newScale);
};

export {setImageScale, incImageScale};
