import axios from 'axios';

// Function to search images by the name

export default async function fetchImages(value, page) {
  const url = 'https://pixabay.com/api/';

  //* Parameters
  //? key - твій унікальний ключ доступу до API (отримується при реєстрації).
  //? q - те, що буде вводити користувач (позначаємо як 'value');
  //? image_type - тип зображення (приймаємо: 'photo');
  //? orientation - орієнтація фотографії (приймаємо: 'horizontal');
  //? safesearch - фільтр за віком (приймаємо; 'true').
  //   Pagination (Пагінація):
  //? page (default = 1, min = 3, max=200) : результати пошуку будуть розбиті на сторінки (позначаємо як 'page');
  //? per_page (default = 20) : кількість результатів на сторінці (приймаємо: '40').

  const key = '32692148-893493904108f813cf446c93e';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${url}${filter}`).then(response => response.data);
}
