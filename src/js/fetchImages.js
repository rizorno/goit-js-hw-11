import axios from 'axios';

export default async function fetchImages(value, page) {
  const BASE_URL = 'https://pixabay.com/api/';

  //* Parameters
  //? key - твій унікальний ключ доступу до API (отримується при реєстрації).
  //? q - те, що буде вводити користувач (позначаємо як 'value');
  //? image_type - тип зображення (приймаємо: 'photo');
  //? orientation - орієнтація фотографії (приймаємо: 'horizontal');
  //? safesearch - фільтр за віком (приймаємо; 'true').
  //   Pagination (Пагінація):
  //? page (default = 1, min = 3, max=200) : результати пошуку будуть розбиті на сторінки (позначаємо як 'page');
  //? per_page (default = 20) : кількість результатів на сторінці (приймаємо: '40').

  const BASE_KEY = '32692148-893493904108f813cf446c93e';
  const params = new URLSearchParams({
    key: BASE_KEY,
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  });
  // Alternative and more difficult
  // const params = `key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}
