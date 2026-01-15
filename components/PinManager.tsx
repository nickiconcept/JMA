import React, { useState } from 'react';
import { Pin } from '../types';
import Button from './Button';

interface Props {
  pins: Pin[];
  onGenerate: (amount: number) => void;
}

const PinManager: React.FC<Props> = ({ pins, onGenerate }) => {
  const [amount, setAmount] = useState(10);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Result Checking PINs</h2>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Generate</label>
            <input 
              type="number" 
              min="1" max="100"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full border-gray-300 rounded-md p-2 border"
            />
          </div>
          <Button onClick={() => onGenerate(amount)}>Generate PINs</Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-700">Active PINs</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PIN Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pins.map((pin, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-gray-800 tracking-wider">
                    {pin.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pin.usageCount >= pin.maxUsage ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {pin.usageCount >= pin.maxUsage ? 'Used Up' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pin.usageCount} / {pin.maxUsage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pin.expiryDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PinManager;
