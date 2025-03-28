import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>インターンマッチングアプリ</title>
        <link rel="icon" href="/images/logo2.svg" className="w-10 h-10"  />
      </Head>

      {/* ヘッダー */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            インターンマッチング
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/jobs" className="text-gray-600 hover:text-indigo-600">求人一覧</Link>
            <Link href="/login" className="text-gray-600 hover:text-indigo-600">ログイン</Link>
            <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">登録</Link>
          </nav>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">
            理想のインターンシップを見つけよう
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            インターン生と企業を繋ぎ、新たな可能性を広げます。
          </p>
          <div className="flex justify-center mb-8">
            <input type="text" placeholder="キーワードで検索" className="border border-gray-300 rounded-l-md py-2 px-4 w-full md:w-1/2" />
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-r-md">検索</button>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="bg-indigo-600 text-white py-3 px-6 rounded hover:bg-indigo-700">インターン生の方はこちら</Link>
            <Link href="/register" className="bg-teal-500 text-white py-3 px-6 rounded hover:bg-teal-600">企業の方はこちら</Link>
          </div>
        </div>
      </section>

      {/* コンテンツセクション (インターン生向け) */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-indigo-600 mb-8">インターン生向け</h2>
          {/* おすすめ求人、インターン体験談、登録フォームなどのコンテンツ */}
        </div>
      </section>

      {/* コンテンツセクション (企業向け) */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-indigo-600 mb-8">企業向け</h2>
          {/* 求人掲載のメリット、導入事例、掲載フォームなどのコンテンツ */}
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} インターンマッチング</p>
          {/* サイトマップ、ソーシャルメディアリンクなど */}
        </div>
      </footer>
    </div>
  );
}