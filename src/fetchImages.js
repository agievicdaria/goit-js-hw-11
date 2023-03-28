import axios from 'axios';

const API_KEY = '34753335-3933287afdbc470ab56c125bb';
const URL = 'https://pixabay.com/api/';

export const fetchImages = async (trimmedValue, pageNumber) => {
    return await axios
      .get(
        `${URL}?key=${API_KEY}&q=${trimmedValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`
      )
      .then(({ data }) => data);
  }