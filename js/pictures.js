import {setImgProps} from './functions.js';

/*
 * Функция на основе шаблона #picture создает и возвращает DOM-элемент, соответствующей фотографии
 */
const createPictureElement = () => {
  const pictureTemplate = document.querySelector('#picture')
    .content.querySelector('.picture');
  return pictureTemplate.cloneNode(true);
};

/*
 * Функция устанавливает значения свойст для созданной фотографии pictureElement
 */
const processPicture = (pictureElement, {url, description, likes, comments}) => {
  // Свойства самого изображения (источник и alt-текст)
  setImgProps(pictureElement.querySelector('.picture__img'), url, description);
  // Количество лайков
  pictureElement.querySelector('.picture__likes').textContent = likes;
  // Количество комментариев
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
};

/*
 * Функция на основе данных создает DOM-элемент фотографии.
 */
const createPicture = (photo, showBigPicture) => {
  const pictureElement = createPictureElement();
  processPicture(pictureElement, photo);
  pictureElement.addEventListener('click', () => {
    showBigPicture(photo);
  });
  return pictureElement;
};

/*
 * Функция отображает фотографии на странице.
 * Через параметр photos передается массив данных о фотографиях,
 * параметр showBigPicture - ссылка на функцию, вызываемую при клике на миниатюре.
 */
const showPictures = (photos, showBigPicture) => {
  const pictureContainer = document.querySelector('.pictures');
  const pictureFragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    pictureFragment.append(createPicture(photo, showBigPicture));
  });
  pictureContainer.appendChild(pictureFragment);
};

export {showPictures};
