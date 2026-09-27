require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'dummy_data.json');
const audioDirectory = path.join(__dirname, 'public/audio');

if (!fs.existsSync(audioDirectory)) {
  fs.mkdirSync(audioDirectory, { recursive: true });
}

app.post('/api/generate-audio', async (req, res) => {
  const { student_id } = req.body;
  
  const db = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const student = db.find(s => s.student_id === student_id);
  
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const fileName = `${student_id}.mp3`;
  const filePath = path.join(audioDirectory, fileName);

  // CACHE CHECK: If the MP3 already exists on your computer, read it and send the data directly
  if (fs.existsSync(filePath)) {
    const buffer = fs.readFileSync(filePath);
    return res.json({ audioBase64: buffer.toString('base64') });
  }

  try {
    const voiceId = "pNInz6obpgDQGcFmaJgB"; 
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: student.story,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail?.message || "ElevenLabs API rejected the request.");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Save the file to disk for future requests
    fs.writeFileSync(filePath, buffer);

    // Send the raw audio data directly to React
    res.json({ audioBase64: buffer.toString('base64') });
  } catch (error) {
    console.error("Backend Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});