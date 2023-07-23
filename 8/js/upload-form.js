import {isEscButton, isFocusedElement, showHideModalElement,
  checkArrayHasDuplicates} from './functions.js';

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

const overlayElement = document.querySelector('.img-upload__overlay');
const formElement = document.querySelector('.img-upload__form');
const hashtagFieldElement = document.querySelector('.text__hashtags');
const commentFieldElement = document.querySelector('.text__description');
const closeButtonElement = document.querySelector('#upload-cancel');

// Ссылка на объект Pristine для выполнения проверки ввода в форму
let pristine;

/*
 * Функция вывода модальной формы на экран
 */
const showModalOverlay = () => {
  // Вывод модальной формы
  showHideModalElement(overlayElement, true, onEscKeyDown);
  // Добавление необходимых обработчиков на submit формы
  formElement.addEventListener('submit', onFormSubmit);
  // и нажатие "крестика" закрытия
  closeButtonElement.addEventListener('click', onCloseButtonClick);
};

/*
 * Функция скрытия модальной формы
 */
const hideModalOverlay = () => {
  // Очистка элементов формы
  formElement.reset();
  // Сброс ошибок формы
  pristine.reset();
  // Скрытие модального окна с формой
  showHideModalElement(overlayElement, false, onEscKeyDown);
  // Удаление назначенных обработчиков
  formElement.removeEventListener('submit', onFormSubmit);
  closeButtonElement.removeEventListener('click', onCloseButtonClick);
};

/*
 * Функция проверяет, находится ли фокус в одном из текстовых полей формы
 * (поле хэштегов и комментариев). Используется для обработки нажатия клавиши Esc.
 */
const checkTextFieldFocused = () =>
  isFocusedElement(hashtagFieldElement) || isFocusedElement(commentFieldElement);

/*
 * Обработчик события выбора файла
 */
function onFileInputChange() {
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
  if (!pristine.validate()) {
    evt.preventDefault();
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
  // Установка обработчика на изменение поля с именем файла
  const fileFieldElement = document.querySelector('#upload-file');
  fileFieldElement.addEventListener('change', onFileInputChange);
  // Настройка валидации для формы
  initFormValidation();
};

export {initUploadForm};
