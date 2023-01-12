import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const BASE_KEY = '32692148-893493904108f813cf446c93e';

export class ImagesAPI {
  async fetchImages(value, page) {
    // Parameters
    //? key - твій унікальний ключ доступу до API (отримується при реєстрації).
    //? q - те, що буде вводити користувач (позначаємо як 'value');
    //? image_type - тип зображення (приймаємо: 'photo');
    //? orientation - орієнтація фотографії (приймаємо: 'horizontal');
    //? safesearch - фільтр за віком (приймаємо; 'true').
    //   Pagination (Пагінація):
    //? page (default = 1, min = 3, max=200) : результати пошуку будуть розбиті на сторінки (позначаємо як 'page');
    //? per_page (default = 20) : кількість результатів на сторінці (приймаємо: '40').

    //* Solution #1
    //  const params = new URLSearchParams({
    //    key: BASE_KEY,
    //    q: value,
    //    image_type: 'photo',
    //    orientation: 'horizontal',
    //    safesearch: true,
    //    per_page: 40,
    //    page, // page: page
    //  });
    //   const response = await axios.get(`${BASE_URL}?${params}`);

    //* Solution #2
    const config = {
      params: {
        key: BASE_KEY,
        q: value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page, // page: page
      },
    };
    const response = await axios.get(`${BASE_URL}`, config);
    console.log(config);

    return response.data;
  }
}
