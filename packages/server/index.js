const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const videos = [
  {
    uid: 'c56858c0-67df-4c1f-a930-156b47a9b088',
    title: 'Elephants Dream',
    description: 'The first Blender Open Movie from 2006',
    fullPath: 'assets/Elephants-Dream.mp4',
    captionPath: 'assets/Elephants-Dream.vtt',
    previewPath: 'assets/Elephants-Dream-preview.jpg',
  },
  {
    uid: 'c56858c0-67df-4c1f-a930-156b47a9b099',
    title: 'For Bigger Joyrides',
    description:
      'Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for the times that call for bigger joyrides.',
    fullPath: 'assets/ForBiggerMeltdowns.mp4',
    previewPath: 'assets/ForBiggerMeltdowns-preview.jpg',
  },
];

app.get('/api/stream/video/:id', (req, res) => {
  const { id } = req.params;
  const video = videos.find((v) => v.uid === id);
  const range = req.headers.range;

  // Check if file exists
  if (!video || !fs.existsSync(video.fullPath)) {
    return res.status(404).end('Not Found');
  }

  // Get file stats
  const stat = fs.statSync(video.fullPath);
  const fileSize = stat.size;

  // Parse Range
  if (range) {
    let [start, end] = range.replace(/bytes=/, '').split('-');
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const stream = fs.createReadStream(video.fullPath, { start, end });
    const head = {
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    stream.pipe(res);
    return;
  }

  // Without Range
  const stream = fs.createReadStream(video.fullPath);
  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': fileSize,
  });
  stream.pipe(res);
});

app.get('/api/caption/:id', (req, res) => {
  const { id } = req.params;
  const video = videos.find((v) => v.uid === id);
  const captionPath = path.join(__dirname, video.captionPath);

  if (!video || !fs.existsSync(captionPath)) {
    return res.status(404).end('Not Found');
  }

  res.header('Content-Type', 'text/vtt');
  res.sendFile(captionPath);
});

app.get('/api/preview/:id', (req, res) => {
  const { id } = req.params;
  const video = videos.find((v) => v.uid === id);
  const previewPath = path.join(__dirname, video.previewPath);

  if (!video || !fs.existsSync(previewPath)) {
    return res.status(404).end('Not Found');
  }

  res.sendFile(previewPath);
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
