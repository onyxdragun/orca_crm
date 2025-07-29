'use client';
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaUserCheck, FaUserClock, FaHouseUser } from 'react-icons/fa';
import Modal from './Modal';
import { Customer } from '@/types';

interface CustomerInfoCardProps {
  customer: Customer;
  onSave: (updated: Partial<Customer>) => void;
}

const statusColors: Record<string, string> = {
  Active: 'bg-blue-900',
  Inactive: 'bg-gray-700',
  Suspended: 'bg-blue-800',
  // Add more statuses as needed
};

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ customer, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState(customer.first_name);
  const [editLastName, setEditLastName] = useState(customer.last_name);
  const [editEmail, setEditEmail] = useState(customer.email);
  const [editPhone, setEditPhone] = useState(customer.phone_number);
  const [editStatus, setEditStatus] = useState(customer.status);
  const [editAddress, setEditAddress] = useState({
    unit: customer.unit ?? '',
    street: customer.street ?? '',
    city: customer.city ?? '',
    postal_code: customer.postal_code ?? ''
  });

  const openModal = () => {
    setEditFirstName(customer.first_name);
    setEditLastName(customer.last_name);
    setEditEmail(customer.email);
    setEditPhone(customer.phone_number);
    setEditStatus(customer.status);
    setEditAddress({
      unit: customer.unit ?? '',
      street: customer.street ?? '',
      city: customer.city ?? '',
      postal_code: customer.postal_code ?? ''
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    onSave({
      ...customer,
      first_name: editFirstName,
      last_name: editLastName,
      phone_number: editPhone || '', // ensure string
      email: editEmail,
      status: editStatus,
      unit: editAddress.unit,
      street: editAddress.street,
      city: editAddress.city,
      postal_code: editAddress.postal_code,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#101624] rounded-xl shadow-lg p-8 w-full max-w-3xl mx-auto border border-blue-950 relative">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Info Section */}
        <div className="flex-1 space-y-4">
          <h4 className="text-xl font-bold text-blue-100 flex items-center gap-2 mb-2">
            <FaUserCheck className="text-blue-400" /> Info
          </h4>
          <div className="flex items-center gap-2 text-blue-200">
            <FaEnvelope className="text-blue-500" />
            <span className="font-medium">Email:</span>
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-200">
            <FaPhone className="text-blue-500" />
            <span className="font-medium">Phone:</span>
            <span>{customer.phone_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-200">Status:</span>
            <span className={`px-3 py-1 rounded-full text-blue-100 font-semibold text-sm shadow ${statusColors[customer.status] || 'bg-blue-950'}`}>{capitalizeFirst(customer.status)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <FaUserClock className="text-blue-600" />
            <span>Created: {customer.created_at ? new Date(customer.created_at).toLocaleString() : ''}</span>
            <span className="mx-2">|</span>
            <span>Updated: {customer.updated_at ? new Date(customer.updated_at).toLocaleString() : ''}</span>
          </div>
        </div>
        {/* Address Section */}
        <div className="flex-1 space-y-2">
          <h4 className="text-xl font-bold text-blue-100 mb-2 flex items-center gap-2">
            <FaHouseUser className="text-blue-400" /> Address
          </h4>
          <div className="bg-blue-950 rounded-lg p-4 border border-blue-900">
            <div className="text-blue-200 font-medium">
              {customer.unit ? `${customer.unit}, ` : ''}{customer.street}
            </div>
            <div className="text-blue-300">{customer.city}</div>
            <div className="text-blue-300">{customer.postal_code}</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <button
          className="px-3 py-1 text-sm bg-blue-900 text-blue-100 rounded hover:bg-blue-800 transition font-semibold shadow cursor-pointer"
          onClick={openModal}
        >
          Edit
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-bold mb-4 text-blue-100">Edit Customer Info</h3>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div>
            <label className="block text-blue-200 mb-1">First Name</label>
            <input type="text" className="w-full p-2 rounded bg-blue-950 text-blue-100 border border-blue-900" value={editFirstName ?? ''} onChange={e => setEditFirstName(e.target.value)} />
          </div>
          <div>
            <label className="block text-blue-200 mb-1">Last Name</label>
            <input type="text" className="w-full p-2 rounded bg-blue-950 text-blue-100 border border-blue-900" value={editLastName ?? ''} onChange={e => setEditLastName(e.target.value)} />
          </div>
          <div>
            <label className="block text-blue-200 mb-1">Email</label>
            <input type="email" className="w-full p-2 rounded bg-blue-950 text-blue-100 border border-blue-900" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-blue-200 mb-1">Phone</label>
            <input type="text" className="w-full p-2 rounded bg-blue-950 text-blue-100 border border-blue-900" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-blue-200 mb-1">Status</label>
            <select className="w-full p-2 rounded bg-blue-950 text-blue-100 border border-blue-900" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
              <option value="lead">Lead</option>
              <option value="current">Current</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-blue-200 mb-1">Unit</label>
            <input type="text" className="w-full p-2 rounded bg-blue-950 text-blue-100 border border-blue-900" value={editAddress.unit ?? ''} onChange={e => setEditAddress({ ...editAddress, unit: e.target.value })} />
          </div>
          <div>
            <label className="block text-blue-200 mb-1">Street</label>
            <input type="text" className="w-full p-2 rounded bg-blue-950 text-blue-100 border border-blue-900" value={editAddress.street ?? ''} onChange={e => setEditAddress({ ...editAddress, street: e.target.value })} />
          </div>
          <div>
            <label className="block text-blue-200 mb-1">City</label>
            <input type="text" className="w-full p-2 rounded bg-blue-950 text-blue-100 border border-blue-900" value={editAddress.city ?? ''} onChange={e => setEditAddress({ ...editAddress, city: e.target.value })} />
          </div>
          <div>
            <label className="block text-blue-200 mb-1">Postal Code</label>
            <input type="text" className="w-full p-2 rounded bg-blue-950 text-blue-100 border border-blue-900" value={editAddress.postal_code ?? ''} onChange={e => setEditAddress({ ...editAddress, postal_code: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 bg-gray-700 text-blue-100 rounded cursor-pointer" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-900 text-blue-100 rounded font-semibold hover:bg-blue-800 cursor-pointer">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerInfoCard;
