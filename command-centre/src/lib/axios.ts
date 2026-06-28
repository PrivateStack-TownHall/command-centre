import axios from "axios";

const createApiClient = (baseURL: string) => {
  return axios.create({
    baseURL,

    headers: {
      "Content-Type": "application/json",
    },

    timeout: 10000,
  });
};

export default createApiClient;
