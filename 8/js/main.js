import {createPhotos} from './data.js';
import {showPictures} from './pictures.js';
import {showBigPicture} from './big-pictures.js';
import {initUploadForm} from './upload-form.js';

// Запуск функции отрисовки миниатюр фотографий.
// В качестве параметров передается массив данных о фотографиях
// и ссылка на функцию, запускаемую при щелчке по миниатюре.
// Массив фотографий возвращает функция createPhotos из модуля data.
// По щелчку на миниатюре будет запускаться функция showBigPicture
// из модуля big-pictures. Таким образом взаимодействие между
// модулями реализовано через точку входа main.
// Модули data, pictures и big-pictures ничего не знают друг о друге.
showPictures(createPhotos(), showBigPicture);

// Инициализация формы загрузки изображений:
// - добавление обработчика события изменения файла в текстовом поле
// - настройка библиотеки pristine для проверки формы
initUploadForm();
