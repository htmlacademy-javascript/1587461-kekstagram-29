import {setImgProps, isEscButton, showHideObject,
  showHideModalElement, processEvents} from './functions.js';

// Константа задает количество комментариев,
// выводимых при показе окна / одном нажатии на кнопку (не более чем)
const COMMENTS_PER_OUTPUT = 5;

// Окно для отображения большой фотографии
const bigPictureElement = document.querySelector('.big-picture');
// Иконка "крестик" закрытия окна
const closeButtonElement = document.querySelector('.big-picture__cancel');
// Комментарии вставляются в блок .social__comments.
const commentsListElement = document.querySelector('.social__comments');
// Блок загрузки новых комментариев .comments-loader
const commentsLoaderElement = document.querySelector('.comments-loader');

// Описание элементов и их обработчиков событий в виде массива объектов.
// Добавляться и удаляться они будут при помощи специальной функции
// при показе и закрытии модального окна.
const events = [
  // Обработчик закрытия окна по крестику
  {element: closeButtonElement, type: 'click', listener: onCloseButtonClick},
  // Обработчик для отображения дополнительной порции комментариев
  {element: commentsLoaderElement, type: 'click', listener: onCommentsLoaderClick},
];

// Переменная под шаблон для комментария
// для его дальнейшего размножения и добавления в список
let commentTemplateElement;

// Переменная под функцию, которая добавляет комментарии под фотография
// Ссылка на функцию записывается в переменную при открытии
let processComments;

/*
 * Функция создает комментарий по информации (аватар, имя автора, текст)
 */
const getComment = ({avatar, name, message}) => {
  const commentElement = commentTemplateElement.cloneNode(true);
  const avatarElement = commentElement.querySelector('.social__picture');
  setImgProps(avatarElement, avatar, name);
  commentElement.querySelector('.social__text').textContent = message;
  return commentElement;
};

/*
 * Функция выводит нужный текст в счетчик комментариев исходя
 * из параметров (visible - количество показанных комментариев, total - общее)
 */
const setCounterText = (visible, total) => {
  // Блок счётчика комментариев .social__comment-count
  const commentsCounterElement = document.querySelector('.social__comment-count');
  commentsCounterElement.innerHTML =
    `${visible} из <span class="comments-count">${total}</span>`;
};

/*
 * Функция добавляет переданный массив комментариев под фотографию.
 * Возвращает количество добавленных комментариев (размер массива)
 */
const appendComments = (comments) => {
  // Сначала создается фрагмент для списка комментариев
  const commentFragment = document.createDocumentFragment();
  // В цикле генерятся комментарии и добавляются во фрагмент
  comments.forEach((comment) => {
    commentFragment.append(getComment(comment));
  });
  // сгенерированный фрагмент комментариев добавляется в нужное место на странице
  commentsListElement.append(commentFragment);
  return comments.length;
};

/*
 * Инициализация вывода комментариев, тут используется замыкание,
 * возвращается функция, которая потом и будет выводить порции комментариев
 */
const initComments = (comments) => {
  // Количество уже выведенных комментариев
  let visibleCommentsCount = 0;
  // Копия исходного массива комментариев в новый
  // В нем будут хранится только те комменты, которые пока не выведены
  const hiddenComments = comments.slice();

  return function() {
    // Вывод очередной порции комментариев, она вырезается из массива и публикуется,
    // Счетчик показанных комментариев увеличивается на фактическое количество опубликованных
    visibleCommentsCount += appendComments(hiddenComments.splice(0, COMMENTS_PER_OUTPUT));
    // Обновление счетчика комментариев
    setCounterText(visibleCommentsCount, comments.length);
    // Если все комментарии выведены, то кнопка публикации скрывается
    if (visibleCommentsCount === comments.length) {
      showHideObject(commentsLoaderElement, false);
    }
  };
};

/*
 * Заполнение окна просмотра данными о конкретной фотографии реализовано
 * в отдельной функции. Данные о фотографии передаются через параметр pictureData
 */
const processBigPicture = ({url, description, likes, comments}) => {
  // Для удобства в переменную записываем ссылку на само изображение
  const bigImageElement =
    bigPictureElement.querySelector('.big-picture__img img');
  // Установка свойств изображения
  //Адрес изображения url подставляется как src изображения внутри блока .big-picture__img
  // Описание description добавляется в alt
  setImgProps(bigImageElement, url, description);
  // Количество лайков likes подставляется как текстовое содержание элемента .likes-count.
  bigPictureElement.querySelector('.likes-count').textContent = likes;
  // Описание фотографии description вставляется строкой в блок .social__caption
  bigPictureElement.querySelector('.social__caption').textContent = description;
  // Ищем и записываем в переменную первый из имеющихся комментариев в списке
  // Далее он будет использоваться как шаблон для размножения на реальный комментарии
  commentTemplateElement = document.querySelector('.social__comment');
  // Очистка имеющегося списка комментариев под фотографией
  commentsListElement.innerHTML = '';
  // Отображение / скрытие кнопки публикации следующей порции комментариев
  // В момент инициализации показывать эту кнопку имеет смысл только в том случае,
  // если количество комментариев в массиве больше одной выводимой порции.
  // В противном случае кнопка не будет ражиматься ни разу и ее можно не показывать
  showHideObject(commentsLoaderElement, comments.length > COMMENTS_PER_OUTPUT);
  // В переменную помещается ссылка на функцию добавления комментариев
  processComments = initComments(comments);
  if (comments.length > 0) {
    // Если в массиве есть хоть один комментарий, то выводим первую порцию
    processComments();
  } else {
    // В противном случае обнуляем счетчик
    setCounterText(0, 0);
  }
};

/*
 * Функция выполняет отрисовку окна с полноразмерным изображением.
 * Предназначена для вызова по клику на миниатюре фотографии.
 * В качестве параметра pictureData передается объект с необходимой информацией
 * об отображаемом изображении
 */
const showBigPicture = (pictureData) => {
  // Отображение модального окна
  showHideModalElement(bigPictureElement, true, onEscKeyDown);
  // Запуск отдельной функции для заполнения окна изображения данными
  processBigPicture(pictureData);
  // Добавление необходимых обработчиков событий на элементы формы
  processEvents(events, true);
};

/*
 * Функция скрывает окно с полноразмерным изображением
 */
const hideBigPicture = () => {
  showHideModalElement(bigPictureElement, false, onEscKeyDown);
  // Удаление обработчиков при закрытии окна
  processEvents(events, false);
};

/*
 * Обработчик события нажатия на кнопку "крестик" в окне просмотра фотографии
 */
function onCloseButtonClick() {
  hideBigPicture();
}

/*
 * Обработчик события нажатия на кнопку публикации следующей порции комментариев
 */
function onCommentsLoaderClick() {
  processComments();
}

/*
 * Обработчик нажатия клавиши Esc для закрытия окна просмотра фотогарфии.
 */
function onEscKeyDown(evt) {
  if (isEscButton(evt)) {
    evt.preventDefault();
    hideBigPicture();
  }
}

export {showBigPicture};
