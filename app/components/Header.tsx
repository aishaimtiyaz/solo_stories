'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-8 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-2">Solo Quest</h1>
      <p className="text-lg md:text-xl text-purple-100">
        Spin the wheel and discover your next solo adventure
      </p>
    </header>
  );
}
