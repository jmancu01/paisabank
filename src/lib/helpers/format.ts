// Format currency with user's locale
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD', // You might want to make this dynamic based on user preference
  }).format(amount);
};
// Format date (assuming transaction.date is in ISO format or similar)
export const formatDate = (date: Date | null) => {
  if (!date) return 'No date';

  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date instanceof Date ? date : new Date(date));
};

export const getTextColor = (amount: number) => {
  return amount < 0 ? 'text-red-500' : 'text-green-500';
};

export const formatTime = (dateString: string | Date | null) => {
  if (!dateString) return '';

  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
