import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const constants = {
  PER_PAGE: 12,
  API_KEY: '30167952-193c03fd6f2705e99f5e35c58',
};

const fetchImageGallery = async (searchValue = '', page = 1) => {
  const response = await axios.get('', {
    params: {
      key: constants.API_KEY,
      q: searchValue,
      image_type: 'photo',
      orientation: 'horizontal',
      per_page: constants.PER_PAGE,
      page: page,
    },
  });

  return response.data;
};
export default fetchImageGallery;
