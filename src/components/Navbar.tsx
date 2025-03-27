import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">Wantedly風</Link>
        <div className="flex items-center space-x-4">
          <Link href="/jobs" className="text-gray-700 hover:text-blue-600">求人一覧</Link>
          <Link href="/jobs/create" className="text-gray-700 hover:text-blue-600">求人作成</Link>
          <Link href="/profile" className="text-gray-700 hover:text-blue-600">プロフィール</Link>
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">ログイン</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;