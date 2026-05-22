const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

(async () => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('test_video.webm'));
    form.append('userId', 'test_user_node');
    form.append('domain', 'Frontend');

    const res = await axios.post('http://localhost:5011/api/mock-interview-feedback/upload', form, {
      headers: form.getHeaders(),
      timeout: 30000
    });
    console.log('Status:', res.status);
    console.log('Data:', res.data);
  } catch (e) {
    if (e.response) {
      console.error('Response error:', e.response.status, e.response.data);
    } else {
      console.error('Request error:', e.message);
      console.error(e.stack);
    }
  }
})();
