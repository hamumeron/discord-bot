// api/index.js
import express from 'express';
import fetch from 'node-fetch';
const app = express();
app.use(express.json());

app.post('/api/user/start', async (req, res) => {
  // GitHub or ストレージから bot.js を取得し Render に Deploy
  const response = await fetch('https://api.render.com/deploy', {
    method: 'POST',
    headers: {'Authorization': `Bearer ${process.env.RENDER_API_KEY}`},
    body: JSON.stringify({
      serviceId: req.user.serviceId,
      branch: req.user.repoBranch || 'main',
    })
  });
  return res.json(await response.json());
});

app.post('/api/user/stop', async (req, res) => {
  await fetch(`https://api.render.com/services/${req.user.serviceId}/stop`, {
    method: 'POST',
    headers: {'Authorization': `Bearer ${process.env.RENDER_API_KEY}`}
  });
  res.sendStatus(204);
});

app.get('/api/user/status', async (req, res) => {
  const botInfo = await (
    await fetch(`https://api.render.com/services/${req.user.serviceId}`, {
       headers: {'Authorization': `Bearer ${process.env.RENDER_API_KEY}`}
     })
  ).json();
  // logs や metrics を LogDNA などから取得して一緒に返す
  res.json({
    running: botInfo.state === 'live',
    logs: ['ログ行１', 'ログ行２'],
    metrics: {uptimeSec: 1234, memMB: 45}
  });
});

// 管理者向け統計
app.get('/api/admin/summary', async (req, res) => {
  const services = await fetch('https://api.render.com/services', {
    headers: {'Authorization': `Bearer ${process.env.RENDER_API_KEY}`}
  }).then(r => r.json());
  res.json({
    total: services.length,
    running: services.filter(s => s.state === 'live').length
  });
});

export default app;
