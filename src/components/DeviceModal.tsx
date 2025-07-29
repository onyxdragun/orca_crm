'use client';

import React, { useState, useEffect } from "react";

import { Device } from "@/types/ticket";
import { DeviceType } from "@/types/index";
import { useCustomer } from "@/context/CustomerContext";



interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: Device) => Promise<void>;
  device: Device | undefined;
}

const DeviceModal: React.FC<DeviceModalProps> = ({ isOpen, onClose, onSave, device }) => {
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [form, setForm] = useState({
    device_type_id: '', // will be converted to number
    brand_model: '',
    serial_number: '',
    first_service_date: '',
    last_service_date: '',
    notes: '',
    custody_status: 'with_customer',
  });
  const { customerId } = useCustomer();

  useEffect(() => {
    if (isOpen && device) {
      setForm({
        device_type_id: form.device_type_id ? String(form.device_type_id) : '',
        brand_model: device.brand_model || '',
        serial_number: device.serial_number || '',
        first_service_date: device.first_service_date || '',
        last_service_date: device.last_service_date || '',
        notes: device.notes || '',
        custody_status: device.custody_status || 'with_customer',
      });
    } else if (isOpen && !device) {
      setForm({
        device_type_id: '',
        brand_model: '',
        serial_number: '',
        first_service_date: '',
        last_service_date: '',
        notes: '',
        custody_status: 'with_customer',
      });
    }
  }, [isOpen, device, form.device_type_id]);

  useEffect(() => {
    async function fetchTypes() {
      const res = await fetch('/api/device_types');
      if (res.ok) setDeviceTypes(await res.json());
    }
    if (isOpen) fetchTypes();
  }, [isOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const deviceData: Partial<Device> = {
      ...form,
      device_type_id: form.device_type_id ? Number(form.device_type_id) : 0,
      customer_id: customerId ?? 0,
      first_service_date: form.first_service_date || null,
      last_service_date: form.last_service_date || null,
    };
    // Only include id if editing and device has id (or equipment_id)
    if (device && ('id' in device || 'equipment_id' in device)) {
      deviceData.equipment_id = device.equipment_id
    }
    onSave(deviceData as Device);
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-30">
      <form className="bg-gray-900 p-6 rounded shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h5 className="text-white mb-4">{device ? 'Edit Device' : 'Add Device'}</h5>
        <label className="block text-gray-300 mb-2">Type</label>
        <select
          name="device_type_id"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
          value={form.device_type_id}
          onChange={handleChange}
          required
        >
          <option value="">Select type</option>
          {deviceTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <label className="block text-gray-300 mb-2">Brand/Model</label>
        <input
          name="brand_model"
          type="text"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
          value={form.brand_model}
          onChange={handleChange}
          required
        />
        <label className="block text-gray-300 mb-2">Serial Number</label>
        <input
          name="serial_number"
          type="text"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
          value={form.serial_number}
          onChange={handleChange}
        />
        <label className="block text-gray-300 mb-2">First Service Date</label>
        <input
          name="first_service_date"
          type="date"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
          value={form.first_service_date}
          onChange={handleChange}
        />
        <label className="block text-gray-300 mb-2">Last Service Date</label>
        <input
          name="last_service_date"
          type="date"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
          value={form.last_service_date}
          onChange={handleChange}
        />
        <label className="block text-gray-300 mb-2">Notes</label>
        <textarea
          name="notes"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
          value={form.notes}
          onChange={handleChange}
          rows={2}
        />
        <label className="block text-gray-300 mb-2">Custody Status</label>
        <select
          name="custody_status"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
          value={form.custody_status}
          onChange={handleChange}
          required
        >
          <option value="with_customer">With Customer</option>
          <option value="in_service">In Service</option>
          <option value="awaiting_pickup">Awaiting Pickup</option>
          <option value="delivered">Delivered</option>
        </select>
        
        <div className="flex justify-end gap-2">
          <button type="button" className="bg-gray-600 px-3 py-1 rounded text-white cursor-pointer" onClick={onClose}>Cancel</button>
          <button type="submit" className="bg-blue-700 px-3 py-1 rounded text-white cursor-pointer">{device ? 'Save' : 'Add'}</button>
        </div>
      </form>
    </div>
  );
};

export default DeviceModal;
