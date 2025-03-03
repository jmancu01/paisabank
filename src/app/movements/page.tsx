'use client';

import React from 'react';
import TransactionList from '@/components/transaction-list';
import Navbar from '@/components/navbar';

export default function Movements() {
  return (
    <div className="pb-16">
      <TransactionList
        title="All Transactions"
        limit={10}
        enableSearch={true}
        enableFilters={true}
      />
      <Navbar initialTab="home" />
    </div>
  );
}
