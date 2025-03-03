'use client';

import React from 'react';
import PaisbankCardCarousel from '@/components/paisbank-card-carousel';
import TransactionList from '@/components/transaction-list';
import Navbar from '@/components/navbar';
import Header from '@/components/header';

export default function Dashboard() {
  return (
    <div className="pb-16">
      <Header />
      <PaisbankCardCarousel />
      <TransactionList />
      <Navbar initialTab="home" />
    </div>
  );
}
