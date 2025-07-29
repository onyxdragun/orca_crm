import React, { useEffect, useState, useCallback } from "react";

import { Device } from "@/types/ticket";
import DeviceModal from "./DeviceModal";

interface CustomerDeviceListProps {
  customerId: number;
}

const CustomerDeviceList: React.FC<CustomerDeviceListProps> = ({ customerId }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | undefined>(undefined);
  const [openRow, setOpenRow] = useState<number | null>(null);

  const fetchDevices = useCallback(async () => {
      const res = await fetch(`/api/customers/${customerId}/devices`);
      if (res.ok) setDevices(await res.json());
    }, [customerId]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  function handleAdd() {
    setEditDevice(undefined);
    setShowModal(true);
  }

  async function handleSave(device: Device) {
    const method = editDevice ? 'PUT' : 'POST';
    const url = editDevice ? `/api/devices/${editDevice.equipment_id}` : `/api/customers/${customerId}/devices`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device),
    });
    if (res.ok) {
      setShowModal(false);
      fetchDevices();
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Devices</h3>
        <button className="bg-blue-700 px-3 py-1 rounded text-white cursor-pointer" onClick={handleAdd}>Add Device</button>
      </div>
      {devices.length === 0 ? (
        <p>No devices found for this customer.</p>
      ) : (
        <div className="overflow-x-auto w-full">
          {/* Mobile: Cards, Desktop: Table */}
          <div className="block md:hidden space-y-4 w-full">
            {devices.map(device => (
              <div key={device.equipment_id} className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700 w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white text-lg">{device.device_type_name || device.device_type_id}</span>
                  <span className="text-xs font-semibold text-blue-300 bg-gray-900 px-2 py-1 rounded">{device.custody_status ? device.custody_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'With Customer'}</span>
                </div>
                <div className="text-gray-200 mb-1"><strong>Brand/Model:</strong> {device.brand_model}</div>
                <div className="text-gray-200 mb-1"><strong>Serial:</strong> {device.serial_number}</div>
                <div className="text-gray-200 mb-1"><strong>Notes:</strong> {device.notes || 'N/A'}</div>
                <div className="flex justify-end mt-2">
                  <button className="bg-gray-600 px-2 py-1 rounded text-white cursor-pointer" onClick={() => { setEditDevice(device); setShowModal(true); }}>Edit</button>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden md:table min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-4 py-2 text-left text-gray-300">Type</th>
                <th className="px-4 py-2 text-left text-gray-300">Brand/Model</th>
                <th className="px-4 py-2 text-left text-gray-300">Serial</th>
                <th className="px-4 py-2 text-center text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(device => (
                <React.Fragment key={device.equipment_id}>
                  <tr key={device.equipment_id} className="hover:bg-gray-700 cursor-pointer" onClick={() => setOpenRow(openRow === device.equipment_id ? null : device.equipment_id)}>
                    <td className="px-4 py-2 text-white">{device.device_type_name || device.device_type_id}</td>
                    <td className="px-4 py-2 text-gray-200">{device.brand_model}</td>
                    <td className="px-4 py-2 text-gray-200">{device.serial_number}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="bg-gray-600 px-2 py-1 rounded text-white cursor-pointer" onClick={e => { e.stopPropagation(); setEditDevice(device); setShowModal(true); }}>Edit</button>
                    </td>
                  </tr>
                  {openRow === device.equipment_id && (
                    <tr>
                      <td colSpan={7} className="bg-gray-900 text-left px-6 py-4 text-gray-200 border-t border-gray-700">
                        <strong>Notes:</strong> {device.notes || 'N/A'}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DeviceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        device={editDevice}
      />
    </div>
  );
};

export default CustomerDeviceList;
