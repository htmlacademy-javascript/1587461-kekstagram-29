import {debounce} from './functions.js';

// Время задержки для устранения "дребезгов"
const RERENDER_DELAY = 500;
// Количество фотографий, отображаемых при выборе случайного фильтра
const RANDOM_PICTURES_COUNT = 10;

// Типы фильтров
const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

// Кнопки фильтрации
const filterElement = document.querySelector('.img-filters');

// Выбранный фильтр
let currentFilter = '';

// Ссылка на исходный массив фотографий, который фильтруется
// Появляется в функции инициализации фильтра
let photos;

// Функция случайной сортировки элементов массива
const sortRandom = () => Math.random() - 0.5;

// Функция сортировки фотографий по убыванию количества комментариев
const sortDiscussed = (photo1, photo2) =>
  photo2.comments.length - photo1.comments.length;

/*
 * Фильтрация массива фотографий в соответствии с выбранным фильтром
 */
const filterPhotos = () => {
  // Создание копии массива фотографий, чтобы не испортить исходный
  let filteredPhotos = photos.slice();
  // Если рандомный фильтр
  if (currentFilter === Filter.RANDOM) {
    filteredPhotos = filteredPhotos.sort(sortRandom).slice(0, RANDOM_PICTURES_COUNT);
  } else if (currentFilter === Filter.DISCUSSED) {
    // Если сортировка по популярности (количеству комментариев)
    filteredPhotos = filteredPhotos.sort(sortDiscussed);
  }
  return filteredPhotos;
};

/*
 * Инициализация фильтра
 */
const initFilter = (loadedPhotos) => {
  filterElement.classList.remove('img-filters--inactive');
  photos = loadedPhotos;
  currentFilter = Filter.DEFAULT;
};

/*
 * Проверка щелчка по кнопкам выбора фильтра
 */
const isFilterClicked = (evt) =>
  evt.target.classList.contains('img-filters__button');

/*
 * Установка обработчика клика по кнопкам фильтрации
 */
const setOnFilterClick = (showPictures, onPictureClick) => {
  const debouncedShowPictures = debounce(showPictures, RERENDER_DELAY);
  filterElement.addEventListener('click', (evt) => {
    const clickedButton = evt.target;
    if (!isFilterClicked(evt) || (clickedButton.id === currentFilter)) {
      return;
    }
    filterElement.querySelector('.img-filters__button--active')
      .classList.remove('img-filters__button--active');
    clickedButton.classList.add('img-filters__button--active');
    currentFilter = clickedButton.id;
    debouncedShowPictures(filterPhotos(), onPictureClick);
  });
};

export {initFilter, setOnFilterClick, filterPhotos};
