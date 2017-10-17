const axios = require('axios');

const base_api = 'https://www.mocky.io/v2';

module.exports = {
  fetchData(cb, err) {
    axios.get(`${base_api}/59e698340f00000d01ee9756`)
      .then(response => {
        cb(response.data)
      })
      .catch(e => {
        err(e)
      });
  },
};

