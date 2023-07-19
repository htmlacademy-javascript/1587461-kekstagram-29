import {setImgProps, isEscButton} from './functions.js';

// Константа задает количество комментариев,
// выводимых при показе окна / одном нажатии на кнопку (не более чем)
const COMMENTS_PER_OUTPUT = 5;

// Окно для отображения большой фотографии
const bigPicture = document.querySelector('.big-picture');
// Иконка "крестик" закрытия окна
const closeButton = document.querySelector('.big-picture__cancel');
// Комментарии вставляются в блок .social__comments.
const pictureComments = document.querySelector('.social__comments');
// Блок загрузки новых комментариев .comments-loader
const commentsLoader = document.querySelector('.comments-loader');

// Переменная под функцию, которая доабвляет комментарии под фотография
// Ссылка на функцию записывается в переменную при открытии
let processComments;

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
 * Функция выводит нужный текст в счетчик комментариев исходя
 * из параметров (visible - количество показанных комментариев, total - общее)
 */
const setCounterText = (visible, total) => {
  // Блок счётчика комментариев .social__comment-count
  const commentsCounter = document.querySelector('.social__comment-count');
  commentsCounter.innerHTML =
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
  pictureComments.append(commentFragment);
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
      showHideObject(commentsLoader, false);
    }
  };
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
  // Очистка имеющегося списка комментариев под фотографией
  pictureComments.innerHTML = '';
  // Отображение / скрытие кнопки публикации следующей порции комментариев
  // В момент инициализации показывать эту кнопку имеет смысл только в том случае,
  // если количество комментариев в массиве больше одной выводимой порции.
  // В противном случае кнопка не будет ражиматься ни разу и ее можно не показывать
  showHideObject(commentsLoader, comments.length > COMMENTS_PER_OUTPUT);
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
  // Для отображения окна у элемента .big-picture удаляется класс hidden
  showHideObject(bigPicture, true);
  // После открытия окна тегу <body> необходимо добавить класс modal-open,
  // чтобы контейнер с фотографиями позади не прокручивался при скролле.
  setShowModal();
  // Запуск отдельной функции для заполнения окна изображения данными
  processBigPicture(pictureData);
  // Обработчик закрытия окна по кнопке Esc
  document.addEventListener('keydown', onEscKeyDown);
};

/*
 * Функция скрывает окно с полноразмерным изображением
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
 * Обработчик события нажатия на кнопку публикации следующей порции комментариев
 */
const onCommentsLoaderClick = () => {
  processComments();
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

// Добавление обработчика для закрытия окна
closeButton.addEventListener('click', onCloseButtonClick);
// Добавление обработчика для отображения дополнительной порции комментариев
commentsLoader.addEventListener('click', onCommentsLoaderClick);

export {showBigPicture};
