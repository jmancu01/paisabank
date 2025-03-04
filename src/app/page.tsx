import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold">Welcome to My App</h1>
      <div className="flex gap-4 mt-8">
        <Link
          href="/login"
          className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
