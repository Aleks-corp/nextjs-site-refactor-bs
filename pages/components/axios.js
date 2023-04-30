import axios from 'axios';

import constants from './constants';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const { PER_PAGE, API_KEY } = constants;

const fetchImageGallery = async (searchValue = '', page = 1) => {
  const response = await axios.get('', {
    params: {
      key: API_KEY,
      q: searchValue,
      image_type: 'photo',
      orientation: 'horizontal',
      per_page: PER_PAGE,
      page: page,
    },
  });

  return response.data;
};
export default fetchImageGallery;
