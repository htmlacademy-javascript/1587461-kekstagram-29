import {showHideObject} from './functions.js';

// Массив объектов - параметров эффектов
const IMAGE_EFFECTS = [
  {name: 'none', style: '', minValue: 0, maxValue: 100, step: 1, unit: ''},
  {name: 'chrome', style: 'grayscale', minValue: 0, maxValue: 1, step: 0.1, unit: ''},
  {name: 'sepia', style: 'sepia', minValue: 0, maxValue: 1, step: 0.1, unit: ''},
  {name: 'marvin', style: 'invert', minValue: 0, maxValue: 100, step: 1, unit: '%'},
  {name: 'phobos', style: 'blur', minValue: 0, maxValue: 3, step: 0.1, unit: 'px'},
  {name: 'heat', style: 'brightness', minValue: 1, maxValue: 3, step: 0.1, unit: ''}
];

// Название эффекта когда эффект на самом деле отсутствует
const NONE_EFFECT_NAME = 'none';
// Название эффекта по умолчанию (при открытии формы)
// Не факт, что отсутствие эффекта будет значением по умолчанию,
// поэтому созданы две отдельные константы
const INIT_EFFECT_NAME = NONE_EFFECT_NAME;

// div для слайдера
const sliderElement = document.querySelector('.effect-level__slider');
// Элемент, в котором хранится значение слайдера
const effectLevelElement = document.querySelector('.effect-level__value');
// Ссылка на кортинку, к которой применяется эффект
const effectImageElement = document.querySelector('.img-upload__preview img');

// Сюда сохраняется ссылка на текущий выбранный эффект
let currentEffect;

/*
 * Функция возвращает объект с эффектом из массива по названию
 */
const getEffectByName = (effectName) =>
  IMAGE_EFFECTS.find((effect) => effect.name === effectName);

/*
 * Добавляет обработчик события для изменения слайдера
 * Вызывается при отображении модальной формы
 */
const addSliderEventListener = () =>
  sliderElement.noUiSlider.on('update', onSliderUpdate);

/*
 * Удаление обработчика события слайдера, чтобы не было утечек памяти
 */
const removeSliderEventListener = () => sliderElement.noUiSlider.off();

/*
 * Сброс настроек эффектов,
 * используется когда выбирается отсутствие эффекта
 */
const resetEffect = () => {
  effectImageElement.style.filter = 'none';
  effectImageElement.className = '';
  effectLevelElement.value = '';
  // Если эффект отсутствует, то слайдер скрывается
  showHideObject(sliderElement.parentNode, false);
};

/*
 * Применение настроек эффекта к изображению
 * в случае если что то выбрано
 */
const setSliderValue = () => {
  const sliderValue = sliderElement.noUiSlider.get();
  effectImageElement.style.filter =
    `${currentEffect.style}(${sliderValue}${currentEffect.unit})`;
  effectImageElement.className = '';
  effectImageElement.classList.add(`effects__preview--${currentEffect.name}`);
  effectLevelElement.value = sliderValue;
};

/*
 * Функция возвращает объект с параметрами для слайдера
 * на основе выбранного эффекта
 */
const getSliderProps = () => {
  const props = {
    range: {
      min: currentEffect.minValue,
      max: currentEffect.maxValue,
    },
    step: currentEffect.step,
    start: currentEffect.maxValue,
  };
  return props;
};

/*
 * Изменение эффекта на эффект, название которого передается через параметр
 */
const changeEffect = (newEffectName = INIT_EFFECT_NAME) => {
  const previousEffectName = currentEffect.name;
  currentEffect = getEffectByName(newEffectName);
  if (newEffectName === NONE_EFFECT_NAME) {
    // Сброс настроек если отсутствует эффект
    resetEffect();
  } else {
    // В случае, если есть эффект, то выполняется обновление настроек слайдера
    sliderElement.noUiSlider.updateOptions(getSliderProps());
    // Применение эффекта к картинке
    setSliderValue();
    // Слайдер отображается только в том случае,
    // если до этого не было эффекта, а теперь есть
    if (previousEffectName === NONE_EFFECT_NAME) {
      showHideObject(sliderElement.parentNode, true);
    }
  }
};

/*
 * Инициализация работы с эффектами, выполняется один раз в самом начале.
 * В качестве параметра передается изображение, к которому применяются эффекты
 */
const initImageEffects = () => {
  currentEffect = getEffectByName(NONE_EFFECT_NAME);
  // Подготовка настроек слайдера
  const initSliderProps = getSliderProps();
  initSliderProps.connect = 'lower';
  // Создание слайдера
  noUiSlider.create(sliderElement, initSliderProps);
  // Запуск функции для выполнения необходимых настроек
  changeEffect();
};

/*
 * Обработчик события изменения значения слайдера
 */
function onSliderUpdate() {
  setSliderValue();
}

export {initImageEffects, addSliderEventListener, removeSliderEventListener,
  changeEffect};
