import {setImgProps, isEscButton} from './functions.js';

// Окно для отображения большой фотографии
const bigPicture = document.querySelector('.big-picture');

/*
 * Небольшая сервисная функция, выполняющая отображение / скрытие
 * объекта obj, в зависимости от значения параметра visible
 */
const showHideObject = (obj, visible) => {
  if (visible) {
    obj.classList.remove('hidden');
  } else {
    obj.classList.add('hidden');
  }
};

/*
 * Функция добавляет / удаляет класс modal-open тегу body страницы.
 * Используется для того, чтобы контейнер с фотографиями позади не прокручивался при скролле.
 */
const setShowModal = (modal = true) => {
  // Тег body страницы
  const body = document.querySelector('body');
  if (modal) {
    body.classList.add('modal-open');
  } else {
    body.classList.remove('modal-open');
  }
};

/*
 * Функция показывает (добавляет) сгенерированный список комментариев
 * commentsFragment в окне просмотра фотографии
 */
const showCommentsFragment = (commentsFragment) => {
  // Комментарии должны вставляться в блок .social__comments.
  const pictureComments = document.querySelector('.social__comments');
  // На случай, если там уже был какой то текст комментариев, надо почистить содержимое
  pictureComments.innerHTML = '';
  // Добавление нужного списка комментариев
  pictureComments.append(commentsFragment);
};

/*
 * Функция создает комментарий по информации (аватар, имя автора, текст)
 */
const getComment = ({avatar, name, message}) => {
  const commentHTML = `
    <img
        class="social__picture"
        src=${avatar}
        alt="${name}"
        width="35" height="35">
    <p class="social__text">${message}</p>
              `;
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = commentHTML;
  return commentElement;
};

/*
 * Функция заполняет список комментариев под фотографией.
 * Комментарии передаются в виде массива объектов через параметр comments.
 */
const processComments = (comments) => {
  // Сначала создается фрагмент для списка комментариев
  const commentFragment = document.createDocumentFragment();
  // В цикле генерятся комментарии и добавляются во фрагмент
  comments.forEach((comment) => {
    commentFragment.append(getComment(comment));
  });
  // И в конце вызывается отдельная функция, которая добавляет
  // сгенерированный фрагмент комментариев в нужное место на странице
  showCommentsFragment(commentFragment);
};

/*
 * Заполнение окна просмотра данными о конкретной фотографии реализовано
 * в отдельной функции. Данные о фотографии передаются через параметр pictureData
 */
const processBigPicture = ({url, description, likes, comments}) => {
  // Для удобства в переменную записываем ссылку на само изображение
  const bigImage = bigPicture.querySelector('.big-picture__img img');
  // Установка свойств изображения
  //Адрес изображения url подставляется как src изображения внутри блока .big-picture__img
  // Описание description добавляется в alt
  setImgProps(bigImage, url, description);
  // Количество лайков likes подставляется как текстовое содержание элемента .likes-count.
  bigPicture.querySelector('.likes-count').textContent = likes;
  // Описание фотографии description вставляется строкой в блок .social__caption
  bigPicture.querySelector('.social__caption').textContent = description;
  // Заполнение комментариев под фотографией
  processComments(comments);
};

/*
 * Функция выполняет отрисовку окна с полноразмерным изображением.
 * Предназначена для вызова по клику на миниатюре фотографии.
 * В качестве параметра pictureData передается объект с необходимой информацией
 * об отображаемом изображении
 */
const showBigPicture = (pictureData) => {
  // Для отображения окна у элемента .big-picture удаляется класс hidden
  showHideObject(bigPicture, true);
  // После открытия окна тегу <body> необходимо добавить класс modal-open,
  // чтобы контейнер с фотографиями позади не прокручивался при скролле.
  setShowModal();
  // После открытия окна необходимо скрыть блоки счётчика комментариев .social__comment-count
  showHideObject(document.querySelector('.social__comment-count'), false);
  // а также блок загрузки новых комментариев .comments-loader
  showHideObject(document.querySelector('.comments-loader'), false);
  // Запуск отдельной функции для заполнения окна изображения данными
  processBigPicture(pictureData);
  // Обработчик закрытия окна по кнопке Esc
  document.addEventListener('keydown', onEscKeyDown);
};

/*
 * Функция скрывает окна с полноразмерным изображением
 */
const hideBigPicture = () => {
  // Для скрытия окна у элементу .big-picture добавляется класс hidden
  showHideObject(bigPicture, false);
  // У тега <body> нужно удалить класс modal-open,
  setShowModal(false);
  // Обработчик закрытия окна по кнопке Esc больше не нужен
  document.removeEventListener('keydown', onEscKeyDown);
};

/*
 * Обработчик события нажатия на кнопку "крестик" в окне просмотра фотографии
 */
const onCloseButtonClick = () => {
  // Тут все просто - закрытие окна
  // Отдельная функция создана исключительно для эстетики кода
  hideBigPicture();
};

/*
 * Обработчик нажатия клавиши Esc для закрытия окна просмотра фотогарфии.
 * Здесь нельзя использовать стрелку, можно только декларацию,
 * так как функция используется выше по коду. В противном случае будет ошибка.
 */
function onEscKeyDown(evt) {
  if (isEscButton(evt)) {
    evt.preventDefault();
    hideBigPicture();
  }
}

/*
 * Все действия, которые необходимо выполнить один раз для окна просмотра
 * вынесены в отдельную функцию, которая будет запущена в конце модуля.
 * Типа такая инициализация. Пока туда попало только навешивание обработчика на
 * кнопку - крестик. Со временем возможно что то еще добавится.
 */
const initBigPicture = () => {
  // Иконка "крестик" закрытия окна
  const closeButton = document.querySelector('.big-picture__cancel');
  // Добавление обработчик для закрытия окна
  closeButton.addEventListener('click', onCloseButtonClick);
};

// Инициализация модуля
initBigPicture();

export {showBigPicture};
