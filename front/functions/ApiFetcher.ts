import axios from 'axios';

const ApiFetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((response) => response.data);

export default ApiFetcher;
