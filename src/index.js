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

formRef.addEventListener('submit', e => {
  e.preventDefault();
  clearGallery();
  const trimmedValue = inputRef.value.trim();
  fetchImages(trimmedValue, pageNumber).then(data => {
    if (data.hits.length > 0) {
      renderImages(data.hits);
      onInfinityScroll();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      lightbox.refresh();
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });
});

function renderImages(images) {
  if (images.length > 0) {
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

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } else {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function clearGallery() {
  pageNumber = 1;
  galleryRef.innerHTML = '';
}

function onInfinityScroll() {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        pageNumber += 1;
        const trimmedValue = inputRef.value.trim();
        fetchImages(trimmedValue, pageNumber).then(data => {
          renderImages(data.hits);
        });
      }
    }
  });

  observer.observe(btnLoadMoreRef);
}