import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
var lightbox = new SimpleLightbox('.gallery a');

import { fetchImages } from './fetchImages.js';

const inputRef = document.body.querySelector('input[type="text"]');
const formRef = document.body.querySelector('.search-form');
const galleryRef = document.body.querySelector('.gallery');
const btnLoadMoreRef = document.body.querySelector('.load-more');

let pageNumber = 1;

btnLoadMoreRef.style.display = 'none';

formRef.addEventListener('submit', e => {
  e.preventDefault();
  btnLoadMoreRef.style.display = 'none';
  clearGallery();
  searchAndRenderImages();
});

const searchAndRenderImages = async () => {
  const trimmedValue = inputRef.value.trim();
  const images = await fetchImages(trimmedValue, pageNumber);
  if (images.hits.length > 0) {
    renderImages(images.hits);
    lightbox.refresh();
    Notify.success(`Hooray! We found ${images.totalHits} images.`);
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

function renderImages(images) {
    const markup = images
      .map(image => {
        return `<div class="photo-card">
    <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="341" height="230"/></a>
    <div class="info">
      <p class="info-item">
        <b class="info-name">Likes</b>
        <span class="info-descr">${image.likes}</span>
      </p>
      <p class="info-item">
        <b class="info-name">Views</b>
        <span class="info-descr">${image.views}</span>
      </p>
      <p class="info-item">
        <b class="info-name">Comments</b>
        <span class="info-descr">${image.comments}</span>
      </p>
      <p class="info-item">
        <b class="info-name">Downloads</b>
        <span class="info-descr">${image.downloads}</span>
      </p>
    </div>
    </div>`;
      })
      .join('');

    galleryRef.insertAdjacentHTML('beforeend', markup);

    btnLoadMoreRef.style.display = 'block';

    console.log(pageNumber);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
}

function clearGallery() {
  pageNumber = 1;
  galleryRef.innerHTML = '';
}

btnLoadMoreRef.addEventListener('click', e => {
  e.preventDefault();
  onLoadMore()
})

async function onLoadMore() {
  pageNumber += 1;
  const trimmedValue = inputRef.value.trim();
  const images = await fetchImages(trimmedValue, pageNumber);
  renderImages(images.hits);
  lightbox.refresh();

  const imagesValue = document.body.querySelectorAll('.photo-card');
  if(images.totalHits === imagesValue.length) {
    btnLoadMoreRef.style.display = 'none';
    Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}
