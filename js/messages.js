import {isEscButton, processEvents} from './functions.js';

// Константа определяет время отображения собщения
// об ошибке в верхней части экрана в милисекундах
const ALERT_SHOW_TIME = 5000;

// Сообщение об успешной работе
const successMessageElement = document.querySelector('#success')
  .content.querySelector('.success');

// Сообщение об ошибке
const errorMessageElement = document.querySelector('#error')
  .content.querySelector('.error');

// Тело документа для вывода сообщений
const bodyElement = document.querySelector('body');

// Кнопка в окне успешного сообщения
const successMessageButtonElement = successMessageElement
  .querySelector('.success__button');

// Кнопка в окне c ошибкой
const errorMessageButtonElement = errorMessageElement
  .querySelector('.error__button');

// Описание элементов и их обработчиков событий в виде массива объектов
const events = [
  {element: bodyElement, type: 'keydown', listener: onEscDown},
  {element: bodyElement, type: 'click', listener: onBodyClick}
];

/*
 * Функция выводит в верхней части страницы сообщение об ошибке
 */
const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  bodyElement.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

/*
 * Общая функция для вывода сообщения
 */
const showMessage = (messageElement, buttonElement) => {
  bodyElement.append(messageElement);
  processEvents(events, true);
  buttonElement.addEventListener('click', onButtonClick);
};

/*
 * Вывод успешного сообщения
 */
const showSuccessMessage = () =>
  showMessage(successMessageElement, successMessageButtonElement);

/*
 * Вывод сообщения об ошибке
 */
const showErrorMessage = () =>
  showMessage(errorMessageElement, errorMessageButtonElement);

/*
 * Скрытие выведенного сообщения
 */
const hideMessage = () => {
  const messageElement =
    document.querySelector('.success') || document.querySelector('.error');
  messageElement.remove();
  processEvents(events, false);
  successMessageButtonElement.removeEventListener('click', onButtonClick);
  errorMessageButtonElement.removeEventListener('click', onButtonClick);
};

/*
 * Обработчик нажатия на кнопку в сообщение - закрытие сообщения
 */
function onButtonClick() {
  hideMessage();
}

/*
 * Обработчик щелчка по телу документа для закрытия окна сообщения
 */
function onBodyClick(evt) {
  if (!evt.target.closest('.success__inner') &&
    !evt.target.closest('.error__inner')) {
    hideMessage();
  }
}

/*
 * Обработчик нажания эскейпа в сообщенит для закрытия
 */
function onEscDown(evt) {
  if (isEscButton(evt)) {
    evt.preventDefault();
    evt.stopPropagation();
    hideMessage();
  }
}

export {showAlert, showSuccessMessage, showErrorMessage};
