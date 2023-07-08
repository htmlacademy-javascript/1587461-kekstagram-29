import {createPhotos} from './data.js';

/*
 * Функция на основе шаблона #picture создает и возвращает DOM-элемент, соответствующей фотографии
 */
const createPictureElement = () => {
  const template = document.querySelector('#picture').content.querySelector('.picture');
  return template.cloneNode(true);
};

/*
 * Функция на основе данных создает и заполняет DOM-элементы фотографий.
 * В качестве результата возвращается DocumentFragment
 */
const createPicturesFragment = () => {
  const fragment = document.createDocumentFragment();
  const photos = createPhotos();
  photos.forEach(({url, description, likes, comments}) => {
    const element = createPictureElement();
    element.querySelector('.picture__img').src = url;
    element.querySelector('.picture__img').alt = description;
    element.querySelector('.picture__likes').textContent = likes;
    element.querySelector('.picture__comments').textContent = comments.length;
    fragment.appendChild(element);
  });
  return fragment;
};

/*
 * Функция отображает фотографии на странице
 */
const showPictures = () => {
  const container = document.querySelector('.pictures');
  container.appendChild(createPicturesFragment());
};

export {showPictures};

