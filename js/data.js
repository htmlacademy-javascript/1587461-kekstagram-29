// URL-сервера для получения / отправки данных
const BASE_URL = 'https://29.javascript.pages.academy/kekstagram';

// Для получения к URL сервера добавляется '/data',
// при отправке ничего не добавляется
const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

// Методы работы с сервером
const Method = {
  GET: 'GET',
  POST: 'POST',
};

// Тексты сообщений об ошибке загрузки / отправки
const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};

/*
 * Общая функция получения / отправки данных.
 * Код взят из материалов разбора учебного проекта.
 * Уж больно круто здесь все написано.
 */
const load = (route, errorText, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}${route}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);
    });

/*
 * Функция получения данных
 */
const getData = () => load(Route.GET_DATA, ErrorText.GET_DATA);

/*
 * Функция отправки данных
 */
const sendData = (body) => load(Route.SEND_DATA, ErrorText.SEND_DATA, Method.POST, body);

export {getData, sendData};
