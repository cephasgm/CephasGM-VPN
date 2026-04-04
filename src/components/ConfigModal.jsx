import React from 'react';
export default function ConfigModal({ show, config, onClose, onConfirm }) {
  if (!show) return null;
  const download = () => {
    const blob = new Blob([config], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'wireguard-config.conf';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full">
        <h2 className="text-xl font-bold text-white mb-4">WireGuard Config</h2>
        <pre className="bg-gray-900 p-3 rounded-lg text-sm overflow-auto max-h-60 mb-4">{config}</pre>
        <div className="flex justify-end space-x-3">
          <button onClick={download} className="bg-blue-600 px-4 py-2 rounded-lg">Download</button>
          <button onClick={onConfirm} className="bg-green-600 px-4 py-2 rounded-lg">Connected</button>
          <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}
