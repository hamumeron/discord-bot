// src/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
export default function UserDashboard() {
  const [status, setStatus] = useState(null);
  const fetchStatus = () => fetch('/api/user/status').then(r => r.json()).then(setStatus);
  useEffect(() => { fetchStatus(); }, []);
  return (
    <div>
      <h2>Bot 状態: {status?.running ? '起動中' : '停止中'}</h2>
      <button onClick={fetchStatus}>リロード</button>
      <button onClick={() => fetch('/api/user/start', {method: 'POST'}).then(fetchStatus)}>起動</button>
      <button onClick={() => fetch('/api/user/stop', {method: 'POST'}).then(fetchStatus)}>停止</button>
      <pre>{JSON.stringify(status?.metrics, null, 2)}</pre>
      <textarea readOnly value={status?.logs?.join('\n')} rows={10} cols={80} />
    </div>
  );
}
