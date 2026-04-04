import React from 'react';
export default function StatusCard({ connected, onDisconnect }) {
  return (
    <div className={`p-6 rounded-xl ${connected ? 'bg-green-800' : 'bg-red-800'}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-white">Status</p>
          <p className="text-2xl font-bold text-white">{connected ? 'CONNECTED' : 'DISCONNECTED'}</p>
        </div>
        {connected && (
          <button onClick={onDisconnect} className="bg-red-600 px-4 py-2 rounded-lg">Disconnect</button>
        )}
      </div>
    </div>
  );
}
