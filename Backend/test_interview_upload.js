import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function run() {
  const form = new FormData();
  form.append('userId', 'test_user_123');
  form.append('domain', 'Frontend');
  form.append('questions', JSON.stringify(['What is let vs const?', 'Explain CSS box model']));
  form.append('transcripts', JSON.stringify([
    "Let is block-scoped and can be reassigned. Const cannot be reassigned.",
    "The box model includes content, padding, border, margin."
  ]));
  // create a tiny dummy file
  const tmp = 'dummy_video.webm';
  fs.writeFileSync(tmp, 'DUMMY');
  form.append('file', fs.createReadStream(tmp), {
    filename: 'test_interview.webm',
    contentType: 'video/webm'
  });

  try {
    const res = await axios.post('http://localhost:5011/api/mock-interview-feedback/upload', form, {
      headers: form.getHeaders(),
      timeout: 15000
    });
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
    if (e.response) console.error('Response data:', e.response.data);
  } finally {
    try { fs.unlinkSync(tmp); } catch (e) {}
  }
}

run();
