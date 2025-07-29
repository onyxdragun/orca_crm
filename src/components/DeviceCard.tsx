import React, { useState } from "react";

import { Device } from "@/types/ticket";

interface DeviceCardProps {
  device: Device;
  onEdit?: (device: Device) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onEdit }) => {
  const [open, setOpen] = useState(false);
  if (!device) return null;
  return (
    <div className="mb-4 p-0 bg-gray-700 rounded-lg overflow-hidden border border-gray-700 w-full">
      <button
        className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3 bg-gray-800 text-white font-semibold focus:outline-none cursor-pointer"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`device-details-${device.equipment_id}`}
      >
        <span className="text-base md:text-lg font-bold mb-2 md:mb-0">Device: {device.device_type_name || 'N/A'}</span>
        <span className="flex items-center gap-2 mt-2 md:mt-0">
          <span className="text-xs font-semibold text-blue-300 bg-gray-900 px-2 py-1 rounded">
            {device.custody_status ? device.custody_status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'With Customer'}
          </span>
          <span>{open ? '-' : '+'}</span>
        </span>
      </button>
      {open && (
        <div id={`device-details-${device.equipment_id}`} className="px-4 pb-4 pt-2 block md:grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">{device.brand_model || 'N/A'}</h4>
            <div className="text-gray-300 mb-1"><strong>Type:</strong> {device.device_type_name || 'N/A'}</div>
            <div className="text-gray-300 mb-1"><strong>Brand/Model:</strong> {device.brand_model || 'N/A'}</div>
            <div className="text-gray-300 mb-1"><strong>Serial Number:</strong> {device.serial_number || 'N/A'}</div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="text-gray-300 mb-2"><strong>Notes:</strong> {device.notes || 'N/A'}</div>
            {onEdit && (
              <button
                className="bg-blue-600 px-3 py-1 rounded text-white font-semibold cursor-pointer mt-2 md:mt-0 self-end"
                onClick={() => onEdit(device)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceCard;
