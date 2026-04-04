import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import StatusCard from './StatusCard';
import ConfigModal from './ConfigModal';

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState(null);
  const [configId, setConfigId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/vpn/servers').then(res => setServers(res.data)).catch(console.error);
    const status = localStorage.getItem('vpn_connected') === 'true';
    setConnected(status);
  }, []);

  const handleConnect = async (serverId) => {
    setLoading(true);
    try {
      const configRes = await api.post('/vpn/config', { serverId });
      const { configId: newConfigId, config: newConfig } = configRes.data;
      setConfigId(newConfigId);
      setConfig(newConfig);
      await api.post('/vpn/peer', { configId: newConfigId });
      setShowModal(true);
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const onConfirmConfig = () => {
    localStorage.setItem('vpn_connected', 'true');
    setConnected(true);
    setShowModal(false);
  };

  const handleDisconnect = () => {
    localStorage.setItem('vpn_connected', 'false');
    setConnected(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('vpn_connected');
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">VPN Control Panel</h1>
          <button onClick={logout} className="bg-red-600 px-4 py-2 rounded-lg">Logout</button>
        </div>
        <StatusCard connected={connected} onDisconnect={handleDisconnect} />
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">Servers</h2>
        <div className="grid gap-4">
          {servers.map(s => (
            <div key={s.id} className="bg-gray-800 p-4 rounded-xl flex justify-between">
              <div>
                <h3 className="font-bold text-white">{s.name}</h3>
                <p className="text-sm text-gray-400">{s.endpoint}</p>
              </div>
              <button
                onClick={() => handleConnect(s.id)}
                disabled={connected || loading}
                className={`px-4 py-2 rounded-lg ${connected || loading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white`}
              >
                {loading ? 'Generating...' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
        <ConfigModal show={showModal} config={config} onClose={() => setShowModal(false)} onConfirm={onConfirmConfig} />
      </div>
    </div>
  );
}
