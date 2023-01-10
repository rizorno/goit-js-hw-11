import './sass/index.scss';

import fetchImages from './js/fetchImages';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const { searchForm, submitBtn, gallery, loadMoreBtn, endCollectionText } = {
  searchForm: document.querySelector('.search-form'),
  submitBtn: document.querySelector('.search-form__button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endCollectionText: document.querySelector('.end-collection-text'),
};

// Create 'label' for Pagination
searchForm.insertAdjacentHTML(
  'beforeend',
  "<label class='pagination'>Pagination by:</label >"
);
const labelPagination = document.querySelector('.pagination');

// Create button 'Load more'
labelPagination.insertAdjacentHTML(
  'beforeend',
  "<div class='box-pagination'><button type='button' class='btn-load-more'>Load more</button></div>"
);
const paginationBtn = document.querySelector('.btn-load-more');
paginationBtn.disabled = true;

// Create button 'Scroll'
paginationBtn.insertAdjacentHTML(
  'afterend',
  "<button type='button' class='btn-scroll'>Scroll</button>"
);
const paginationScroll = document.querySelector('.btn-scroll');
paginationScroll.classList.toggle('js-bg');

// Function for creating Card template
function cardTemplate({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
<div class='photo-card'>
   <a href='${largeImageURL}'>
      <img src='${webformatURL}' alt='${tags}' loading='lazy' />
   </a>
   <div class='info'>
      <p class='info-item'>
         <b>Likes</b>
         ${likes}
      </p>
      <p class='info-item'>
         <b>Views</b>
         ${views}
      </p>
      <p class='info-item'>
         <b>Comments</b>
         ${comments}
      </p>
      <p class='info-item'>
         <b>Downloads</b>
         ${downloads}
      </p>
   </div>
</div>
`;
}

// Function of creating Card
function renderCardImage(arr) {
  let markup = arr.map(element => cardTemplate(element)).join('');
  console.log(markup);
  gallery.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

// Add Event Listener on button 'Search'
searchForm.addEventListener('submit', onSubmitSearchForm);

// Function of server response processing
async function onSubmitSearchForm(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value;
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40 && paginationBtn.disabled) {
    loadMoreBtn.classList.remove('is-hidden');
  } else {
    loadMoreBtn.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      renderCardImage(response.hits);
      lightbox.refresh();
      endCollectionText.classList.add('is-hidden');

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }
    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.classList.add('is-hidden');
      endCollectionText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

// Add Event Listener on button 'Load more'
paginationBtn.addEventListener('click', onPaginBtn);

async function onPaginBtn(e) {
  paginationBtn.disabled = true;
  paginationScroll.disabled = false;

  paginationBtn.classList.toggle('js-bg');
  paginationScroll.classList.toggle('js-bg');

  document.removeEventListener('scroll', onScrollDocument);

  const response = await fetchImages(searchQuery, currentPage);
  if (searchQuery === '') {
    loadMoreBtn.classList.add('is-hidden');
  } else if (currentHits !== response.totalHits) {
    loadMoreBtn.classList.remove('is-hidden');
  } else if (currentHits === response.totalHits && currentHits > 40) {
    loadMoreBtn.classList.add('is-hidden');
    endCollectionText.classList.remove('is-hidden');
  } else {
    endCollectionText.classList.add('is-hidden');
  }
}

// Add Event Listener on button 'Scroll'
paginationScroll.addEventListener('click', onPaginScroll);

async function onPaginScroll(e) {
  paginationBtn.disabled = false;
  paginationScroll.disabled = true;
  paginationBtn.classList.toggle('js-bg');
  paginationScroll.classList.toggle('js-bg');
  loadMoreBtn.classList.add('is-hidden');
  document.addEventListener('scroll', onScrollDocument);
}

//* Solution #1 : Button 'Load more'

// Add Event Listener on button 'Load more'
loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {
  currentPage += 1; // Alternative currentPage++
  const response = await fetchImages(searchQuery, currentPage);
  renderCardImage(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endCollectionText.classList.remove('is-hidden');
  }
}

//* Solution #2 : Infinite scroll

// Create Event for scroll
let isActiveQuery = false;
let onScrollDocument = e => {
  const { clientHeight, scrollHeight, scrollTop } = e.target.documentElement;
  const currentScrollTop = scrollHeight - scrollTop - clientHeight;
  if (currentScrollTop < 600 && !isActiveQuery) {
    isActiveQuery = true;
    loadNextPage();
  }
};

// Add Event Listener on scroll // if we use only solution #2
// document.addEventListener('scroll', onScrollDocument);

async function loadNextPage() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  renderCardImage(response.hits);
  isActiveQuery = false;
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    endCollectionText.classList.remove('is-hidden');
  }
}
