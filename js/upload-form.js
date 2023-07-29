import {isEscButton, isFocusedElement, showHideModalElement,
  checkArrayHasDuplicates, processEvents, checkFileType} from './functions.js';

import {setImageScale, incImageScale} from './image-scale.js';

import {initImageEffects, addSliderEventListener, removeSliderEventListener,
  changeEffect} from './image-effect.js';

import {showSuccessMessage, showErrorMessage} from './messages.js';

import {sendData} from './data.js';

// Массив допустимых расширений графических файлов для загрузки
const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];

// Хэштеги разделяются пробелами в списке
const HASHTAG_SEPARATOR = ' ';
// Максимальное количество хэштегов для одной фотографии
const HASHTAG_MAX_COUNT = 5;
// Регулярное выражение для проверки хэштега
const HASHTAG_REGEXP = /^#[a-zа-яё0-9]{1,19}$/i;

// Тексты сообщений об ошибках при проверке хэштегов
const HASTAG_TOO_MUCH_ERROR_MESSAGE =
  `Превышено количество хэш-тегов (максимум ${HASHTAG_MAX_COUNT})`;
const HASTAG_HAS_DUPLICATES_ERROR_MESSAGE = 'Хэш-теги повторяются';
const HASTAG_INCORRECT_ERROR_MESSAGE = 'Введён некорректный хэш-тег';

// Тексты на кнопке "Опубликовать"
const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Отправляю...'
};

// Количество процентов масштаба
// за один шаг увеличения / уменьшения изображения
const SCALE_PERCENT_PER_STEP = 25;

const fileFieldElement = document.querySelector('#upload-file');
const overlayElement = document.querySelector('.img-upload__overlay');
const formElement = document.querySelector('.img-upload__form');
const hashtagFieldElement = document.querySelector('.text__hashtags');
const commentFieldElement = document.querySelector('.text__description');
const closeButtonElement = document.querySelector('#upload-cancel');
const submitButtonElement = document.querySelector('.img-upload__submit');

// Кнопка увеличения размера изображения
const enlargeButtonElement = document.querySelector('.scale__control--bigger');
// Кнопка уменьшения размера изображения
const reduceButtonElement = document.querySelector('.scale__control--smaller');

// Описание элементов и их обработчиков событий в виде массива объектов.
// Добавляться и удаляться они будут при помощи специальной функции
// при показе и закрытии модального окна.
const events = [
  // Событие submit формы
  {element: formElement, type: 'submit', listener: onFormSubmit},
  // Щелчок по крестику для закрытия модального окна
  {element: closeButtonElement, type: 'click', listener: onCloseButtonClick},
  // Щелчок на кнопку увеличения масштаба
  {element: enlargeButtonElement, type: 'click', listener: onEnlargeButtonClick},
  // Щелчок на кнопку уменьшения масштаба
  {element: reduceButtonElement, type: 'click', listener: onReduceButtonClick},
  // Обработчик изменения в форме для того, чтобы поймать изменение эффекта
  {element: formElement, type: 'change', listener: onFormChange}
];

// Ссылка на объект Pristine для выполнения проверки ввода в форму
let pristine;

/*
 * Функция вывода модальной формы на экран
 */
const showModalOverlay = () => {
  // Вывод модальной формы
  showHideModalElement(overlayElement, true, onEscKeyDown);
  // Добавление необходимых обработчиков
  processEvents(events, true);
  // Добавление обработчика события для слайдера эффектов
  addSliderEventListener();
};

/*
 * Функция скрытия модальной формы
 */
const hideModalOverlay = () => {
  // Очистка элементов формы
  formElement.reset();
  // Сброс ошибок формы
  pristine.reset();
  // Сброс масштаба изображения
  setImageScale();
  // Сброс настроек эффектов
  changeEffect();
  // Скрытие модального окна с формой
  showHideModalElement(overlayElement, false, onEscKeyDown);
  // Удаление назначенных обработчиков
  processEvents(events, false);
  // Удаление обработчика события изменения слайдера
  removeSliderEventListener();
};

/*
 * Функция проверяет, находится ли фокус в одном из текстовых полей формы
 * (поле хэштегов и комментариев). Используется для обработки нажатия клавиши Esc.
 */
const checkTextFieldFocused = () =>
  isFocusedElement(hashtagFieldElement) || isFocusedElement(commentFieldElement);

/*
 * Функция блокирует / разблокирует кнопку "Отправить"
 */
const blockSubmitButton = (block, caption) => {
  submitButtonElement.disabled = block;
  submitButtonElement.textContent = caption;
};

/*
 * Вызывается в случае успешной отправки данных на сервер
 */
const sendDataSuccess = () => {
  hideModalOverlay();
  showSuccessMessage();
};

/*
 * Проверяет, относится ли файл с именем fileName к одному из заданных типов
 * графических файлов
 */
const isImageFile = (fileName) => checkFileType(fileName, IMAGE_FILE_TYPES);

/*
 * Обработчик события выбора файла
 */
function onFileInputChange() {
  // Получаем выбранный файл
  const file = fileFieldElement.files[0];
  // На всякий случай проверка, был ли действительно выбран графический файл
  // В противном случае выход из обработчика без показа формы
  // Какой смысл пытаться загружать в форму предпросмотра не графический файл
  if (!file || !isImageFile(file.name)) {
    return;
  }
  // Получаем картинку предпросмотра и помещаем в нее выбранный файл
  const photoElement = document.querySelector('.img-upload__preview img');
  photoElement.src = URL.createObjectURL(file);
  // Также получаем все миниатюры с эффектами и в цикле подставляем в них
  // выбранное изображение
  const effectsElements = document.querySelectorAll('.effects__preview');
  effectsElements.forEach((effect) => {
    effect.style.backgroundImage = `url('${photoElement.src}')`;
  });
  // Показ формы предпросмотра
  showModalOverlay();
}

/*
 * Обработчик события нажатия на кнопку "крестик" в форме
 */
function onCloseButtonClick() {
  hideModalOverlay();
}

/*
 * Обработчик события нажатия на клавишу Esc
 */
function onEscKeyDown(evt) {
  // Проверяется нажатие клавиши Esc
  // При этом окно закрывается только в том случае,
  // фокус не находится в одном из двух текстовых полей
  if (isEscButton(evt) && !checkTextFieldFocused()) {
    evt.preventDefault();
    hideModalOverlay();
  }
}

/*
 * Обработчик события submit формы редактирования изображения
 */
function onFormSubmit(evt) {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    blockSubmitButton(true, SubmitButtonText.SENDING);
    sendData(new FormData(evt.target))
      .then(sendDataSuccess)
      .catch(showErrorMessage)
      .finally(blockSubmitButton(false, SubmitButtonText.IDLE));
  }
}

/*
 * Обработчик нажания на кнопку увеличения масштаба
 */
function onEnlargeButtonClick() {
  incImageScale(SCALE_PERCENT_PER_STEP);
}

/*
 * Обработчик нажания на кнопку уменьшения масштаба
 */
function onReduceButtonClick() {
  incImageScale(-SCALE_PERCENT_PER_STEP);
}

/*
 * Обработчик события изменения в форме
 */
function onFormChange(evt) {
  // Отлавливаем изменение эффекта
  // и вызываем соответствующую функцию для настройки изображения
  if (evt.target.classList.contains('effects__radio')) {
    changeEffect(evt.target.value);
  }
}

/*
 * Функция преобразует строку с хэштегами в массив для удобства работы
 */
const getHashtagArrayFromStr = (hashtagStr) =>
  // Удаление концевых пробелов, выкидывание пустых значений
  hashtagStr.trim().split(HASHTAG_SEPARATOR).filter((str) => str.trim().length);

/*
 * Проверка количества введенных хэштегов
 */
const checkHashtagCount = (value) =>
  getHashtagArrayFromStr(value).length <= HASHTAG_MAX_COUNT;

/*
 * Функция проверяет наличие дубликатов среди хэштегов
 */
const checkHashtagDuplicates = (value) =>
  !checkArrayHasDuplicates(getHashtagArrayFromStr(value));

/*
 * Функция проверки одного хэштега на соответствие маске и допустимым символам
 */
const chechHashtagSymbols = (hashtag) => HASHTAG_REGEXP.test(hashtag);

/*
 * Функция проверки массива хэштегов на соответствие маске и допустимым символам
 */

const chechHashtagArray = (value) =>
  getHashtagArrayFromStr(value).every(chechHashtagSymbols);

/*
 * Для удобства настройка валидации формы вынесена в отдельную функцию
 */
const initFormValidation = () => {
  // Создание объекта pristine для проверки
  pristine = new Pristine(formElement, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
  });
  // Добавление проверки максимального количества хэштегов
  pristine.addValidator(
    hashtagFieldElement,
    checkHashtagCount,
    HASTAG_TOO_MUCH_ERROR_MESSAGE
  );
  // Добавление проверки дубликатов в хэштегах
  pristine.addValidator(
    hashtagFieldElement,
    checkHashtagDuplicates,
    HASTAG_HAS_DUPLICATES_ERROR_MESSAGE
  );
  // Добавление проверки хэштега на соответствие маске и используемых символов
  pristine.addValidator(
    hashtagFieldElement,
    chechHashtagArray,
    HASTAG_INCORRECT_ERROR_MESSAGE
  );
};

const initUploadForm = () => {
  fileFieldElement.addEventListener('change', onFileInputChange);
  // Настройка валидации для формы
  initFormValidation();
  // Инициализация масштабирования
  setImageScale();
  // Инициализация эффектов
  initImageEffects();
};

export {initUploadForm};
