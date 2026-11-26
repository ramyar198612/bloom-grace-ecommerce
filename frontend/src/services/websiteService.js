
import api from './api';

const getWebsiteContent = async () => {
  const response = await api.get('/website/');
  return response.data;
};

export default getWebsiteContent;
