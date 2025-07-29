'use client';
import React, { useState } from 'react';
import LoginHeader from '@/components/LoginHeader';
import CustomerTable from '@/components/CustomerTable';
import Breadcrumb from '@/components/Breadcrumb';
import AddCustomerForm from '@/components/AddCustomerForm';
import Modal from '@/components/Modal';

export default function CustomersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>
      <LoginHeader onLogin={() => {}} isLoggedIn={true} onLogout={() => {}} />
      <div className="max-w-4xl w-full mx-auto p-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Customers' }]} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Customers</h1>
          <button
            className="bg-blue-700 px-4 py-2 rounded text-white font-semibold shadow hover:bg-blue-800 transition cursor-pointer"
            onClick={() => setShowAddModal(true)}
          >
            Add Customer
          </button>
        </div>
        <CustomerTable isLoggedIn={true} key={refreshKey} />
      </div>
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <AddCustomerForm
          onCreated={() => {
            setShowAddModal(false);
            setRefreshKey(k => k + 1);
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </>
  );
}
