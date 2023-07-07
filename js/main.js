// Количество генерируемых описаний для фотографий
const PHOTO_COUNT = 25;

// Диапазон количества лайков (от и до)
const LIKE_COUNT_FROM = 15;
const LIKE_COUNT_TO = 200;

// Диапазон количества комментариев (от и до)
const COMMENT_COUNT_FROM = 0;
const COMMENT_COUNT_TO = 30;

// Количество доступных аватаров
const AVATAR_COUNT = 6;

// Массив подписей фотографий
const PHOTO_DESCRIPTIONS = [
  'Пляж',
  'Дорога на пляж',
  'Рай',
  'Красотка',
  'Ужин',
  'Суперкрут',
  'Клубничка',
  'Охладиться',
  'Самолет',
  'Обувница',
  'Дорога',
  'Автоауди',
  'Завтрак',
  'Котярол',
  'Унтайки',
  'Небо',
  'Хор',
  'Роритет',
  'Супертапки',
  'Пальмы',
  'Вкусноужин',
  'Закат',
  'Крабик',
  'Концерт',
  'Заехал'
];

// Массив ников авторов комментариев
const AUTHOR_NAMES = [
  'Mari',
  'Andre93foto',
  'Zaxar20',
  'Ani',
  'Marik',
  'Dok96',
  'Ninarus',
  'Malik85',
  'Leps',
  'Zefir',
  'Aprel',
  'Hoffer',
  'Ikra2001',
  'Oftal',
  'Raftin',
  'Kirkor',
  'Kruiz80',
  'Solntsev',
  'Rezid56',
  'Igra',
  'Avtordok',
  'Polezor',
  'Fotodok',
  'Sila',
  'Liga',
  'Miraz',
  'Evgenii15',
  'Petia',
  'More',
  'Zver96'
];

/*
 * Массив, необходимый для генерации текста сообщений комментариев.
 * В ТЗ предлагается просто выбирать одно или два случайных предложения.
 * Но в таком случае может получится бессмысленная ерунда. Поэтому немного
 * модицифировали подход. Дополнительно к тексту добавили доп. информацию и
 * реализовали все это как объекты. В поле needDependent указывается, обязательно
 * нужно дополнительное предложение или нет. А массив dependent хранит индексы возможных
 * дополнительных предложений, чтобы они хоть как то сочетались по смыслу.
 */
const MESSAGES = [
  {
    message: 'Всё отлично!',
    needDependent: false,
    dependent: []
  },
  {
    message: 'В целом всё неплохо. Но не всё.',
    needDependent: true,
    dependent: [2, 5]
  },
  {
    message: 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    needDependent: false,
    dependent: [3, 4, 5]
  },
  {
    message: 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    needDependent: false,
    dependent: [2, 4, 5]
  },
  {
    message: 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    needDependent: false,
    dependent: [2, 3, 5]
  },
  {
    message: 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
    needDependent: false,
    dependent: [2, 3, 4]
  }
];

/*
 * Функция возвращает случайное положительное целое число
 * в диапазоне между числами value1 и value2
 */
const getRandomPositiveInt = (value1, value2) => {
  // Значения параметров берутся по модулю
  value1 = Math.abs(value1);
  value2 = Math.abs(value2);
  // Определяется минимальное значение из двух параметров
  // Заодно выполняется округление (если значение параметра не целое число)
  const minValue = Math.ceil(Math.min(value1, value2));
  // Определяется длина диапазона для поиска случайного целого числа
  // Это разница между максимальным и минимальным значением, плюс 1
  const interval = Math.floor(Math.max(value1, value2)) - minValue + 1;
  // Выполняется поиск случайного значения в диапазоне и его округление
  return Math.floor(interval * Math.random() + minValue);
};

/*
 * Частный случай предыдущей функции, возвращает случайное булево значение
 */

const getRandomBoolean = () => (getRandomPositiveInt(0, 1) === 1);

/*
 * Функция возвращает случайный индекс массива arr
 */
const getRandomArrayIndex = (arr) => getRandomPositiveInt(0, arr.length - 1);

/*
 * Функция возвращает массив из последовательных целых чисел
 * в диапазоне от параметра from до параметра to.
 * Функция нужна, чтобы потом можно было перемешать значения в случайном порядке и получить
 * массив неповторяющихся перемешанных целых чисел
 */
const getIntNumberArray = (from, to) => {
  const result = [];
  // Здесь все просто, в массив в цикле последовательно добавляются целые числа
  for (let i = from; i <= to; i++) {
    result.push(i);
  }
  return result;
};

/*
 * Функция возвращает массив из целых чисел в диапазоне от параметра from до параметра to
 * в случайном порядке. Используется для того, чтобы перемешивать фотографии,
 * авторов комментариев и т.д.
 */
const getRandomIntNumberArray = (from, to) => {
  // Сначала получаем последовательный масств целых чисел
  const source = getIntNumberArray(from, to);
  const result = [];
  // Далее в цикле выбираем элементы со случайными индексами
  // и переносим их в новый массив. Таким образом они и перемешиваются
  while (source.length > 0) {
    // Выбор случайного индекса
    const randomIndex = getRandomArrayIndex(source);
    // Добавление его в новый массив
    result.push(source[randomIndex]);
    // Удаление из старого массива
    source.splice(randomIndex, 1);
  }
  return result;
};

/*
 * Функция возвращает массив авторов комментариев.
 * Ники авторов заданы в массиве AUTHORS, а также для каждого
 * автора подставляется ссылка на его аватар. В результате автор представляет собой
 * объект с двумя полями: ник и ссылка на аватар. Массив генерится один раз в самом начале
 * и дальше используется при генерации всех комментариев. Это сделано для того, чтобы у каждого
 * ника гарантированно был один и тот же аватар во всех комментариях. Можно было бы генерить
 * случайные аватары при создании каждого комментария, но тогда получится, что одни и те же
 * ники в разных комментариях будут с разными аватарами, а так не бывает.
 */
const getAuthorsArray = () => {
  const authorsArray = [];
  for (let i = 0; i < AUTHOR_NAMES.length; i++) {
    const avatarId = getRandomPositiveInt(1, AVATAR_COUNT);
    const author = {
      name: AUTHOR_NAMES[i],
      avatar: `img/avatar-${avatarId}.svg`,
    };
    authorsArray.push(author);
  }
  return authorsArray;
};

/*
 * Функция возвращает случайный текст комментария к фотографии.
 * За основу берется массив объектов MESSAGES, в котором хранятся
 * как сами комментарии, так и их возможные взаимосвязи.
 */
const getCommentMessage = () => {
  // Выбор первого случайного индекса комментария
  let messageIndex = getRandomArrayIndex(MESSAGES);
  // Объект сообщения по случайному индексу
  const message = MESSAGES[messageIndex];
  // Текст сообщения случайного объекта сразу помещается в результат
  let result = message.message;
  // Далее требуется определить, нужно ли второе предложение в комментарии.
  // Есть варианты, где второе предложение необходимо по смыслу.
  // В противном случае выбирается случайное логическое значение (добавлять / не добавлять)
  // Также смотрим на массив возможных комбинаций предложений.
  // Выбираются только те, которые сочетаются.
  const needSecondMessage = message.needDependent ||
      (message.dependent.length > 0 && getRandomBoolean());
  if (needSecondMessage) {
    messageIndex = getRandomArrayIndex(message.dependent);
    messageIndex = message.dependent[messageIndex];
    result = result.concat(' ', MESSAGES[messageIndex].message);
  }
  return result;
};

/*
 * Функция создает объект - комментарий к фотографии.
 * В качестве параметров передается его идентификатор и
 * объект с информацией об авторе (ник и аватар)
 */
const getComment = (commentId, author) => {
  const comment = {
    id: commentId,
    avatar: author.avatar,
    message: getCommentMessage(),
    name: author.name,
  };
  return comment;
};

/*
 * У фотографии может быть от 0 до 30 комментариев.
 * Они хранятся в массиве объектов. Функция заполняет и возвращает такой массив.
 * commentId - индекс первого комментария из массива,
 * commentCount - количество комментариев у фотографии, которое должно быть в массиве
 * authors - исходный массив авторов
 */
const getCommentsArray = (commentId, commentCount, authors) => {
  const comments = [];
  // Получение массива перемешанных целых чисел для выбора случайных авторов комментариев
  const authorIds = getRandomIntNumberArray(0, authors.length - 1);
  // В цикле в массив добавляется нужное количество комментариев
  for (let i = 0; i < commentCount; i++) {
    // Выбор автора из массива на основе случайного индекса
    const author = authors[authorIds[i]];
    // Создание и добавление нового комментария в массив
    comments.push(getComment(commentId + i, author));
  }
  return comments;
};

/*
 * Функция создает объект - фотографию.
 * В качестве параметров передаются:
 *   photoId - идентификатор данной фотографии
 *   imgId - цифра из имени файла с фотографией, а также это индекс массива с подписью
 *   commentId - начальный идентификатор комментариев (чтобы были уникальными для всех фото)
 *   commentCount - необходимое количество комментариев у этой фото
 *   authors - полный исходный массив авторов комментариев
 */
const createPhoto = (photoId, imgId, commentId, commentCount, authors) => {
  // Тут все просто - создается нужный объект с заполнением его полей
  const photo = {
    id: photoId,
    url: `photos/${imgId}.jpg`,
    description: PHOTO_DESCRIPTIONS[imgId - 1],
    likes: getRandomPositiveInt(LIKE_COUNT_FROM, LIKE_COUNT_TO),
    comments: getCommentsArray(commentId, commentCount, authors)
  };
  return photo;
};

/*
 * Основная функция, выполняющая непосредственно генерацию массива
 * случайно последовательности фотографий с описаниями.
 * Необязательный параметр photoCount позволяет задать количество
 * элементов в массиве. По умолчанию это значение из ТЗ,
 * заданное константой PHOTO_COUNT.
 */
const createPhotosArray = (photoCount = PHOTO_COUNT) => {
  const photos = [];
  // Перемешанный массив индексов фотографий, чтобы они каждый раз были в случайном порядке
  const images = getRandomIntNumberArray(1, photoCount);
  // Массив авторов комментариев с аватарами
  const authors = getAuthorsArray();
  // Инициализация идентификатора первого комментария
  let commentId = 1;
  // В цикле заполнение массива фотографий
  for (let i = 0; i < photoCount; i++) {
    // Генерация случайного количества комментариев для этой фотографии
    const commentCount = getRandomPositiveInt(COMMENT_COUNT_FROM, COMMENT_COUNT_TO);
    photos.push(createPhoto(i + 1, images[i], commentId, commentCount, authors));
    // Увеличение идентификатора комментария на количество добавленных для этой фото,
    // чтобы их идентификаторы были уникальны на всем множестве фотографий
    commentId += commentCount;
  }
  return photos;
};

const similarPhotos = createPhotosArray();
console.log(similarPhotos);
