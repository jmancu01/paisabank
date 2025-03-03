'use client';
import { use } from 'react';
import Header from '@/components/header';
import Navbar from '@/components/navbar';
import CardDetailPage from '@/components/paisbank-card-page';

type CardParams = {
  id: string;
};

export default function CardById({
  params,
}: {
  params: CardParams | Promise<CardParams>;
}) {
  const unwrappedParams = use(params as Promise<CardParams>) as CardParams;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-4 py-6 mb-16">
        <CardDetailPage id={unwrappedParams.id} />
      </main>

      <Navbar initialTab="home" />
    </div>
  );
}
