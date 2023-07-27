import {getData} from './data.js';
import {showAlert} from './messages.js';
import {showPictures} from './pictures.js';
import {showBigPicture} from './big-pictures.js';
import {initUploadForm} from './upload-form.js';

// Загрузка фотографий с сервера и их отрисовка.
getData()
  .then((photos) => showPictures(photos, showBigPicture))
  .catch(
    (err) => {
      showAlert(err.message);
    }
  );

// Инициализация формы загрузки изображений:
// - добавление обработчика события изменения файла в текстовом поле
// - настройка библиотеки pristine для проверки формы
initUploadForm();
