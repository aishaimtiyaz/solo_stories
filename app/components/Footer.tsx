'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 text-center mt-12">
      <div className="max-w-4xl mx-auto">
        <p className="mb-2">
          Made with <span className="text-purple-400">💜</span> for solo adventurers
        </p>
        <p className="text-sm text-gray-500">
          © {currentYear} Solo Quest. Discover your next solo adventure.
        </p>
      </div>
    </footer>
  );
}
