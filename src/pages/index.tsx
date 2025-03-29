import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>インターンマッチングアプリ</title>
        <link rel="icon" href="/images/logo2.svg" />
      </Head>

      {/* ヒーローセクション */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">
            未来を切り拓く、インターンシップ
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            インターン生と企業を繋ぎ、新たな可能性を広げます。
          </p>
          <div className="flex justify-center mb-8">
            <input type="text" placeholder="キーワードで検索" className="border border-gray-300 rounded-l-md py-2 px-4 w-full md:w-1/2" />
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-r-md">検索</button>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/users/register" className="bg-indigo-600 text-white py-3 px-6 rounded hover:bg-indigo-700">インターン生の方はこちら</Link>
            <Link href="/users/register" className="bg-teal-500 text-white py-3 px-6 rounded hover:bg-teal-600">企業の方はこちら</Link>
          </div>
        </div>
      </section>

      {/* コンテンツセクション (インターン生向け) */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-indigo-600 mb-8">インターン生向け</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <img src="/images/hero2.svg" alt="求人画像" className="" width="200" height="150" />
              <h3 className="text-xl font-bold mb-4">おすすめ求人</h3>
              <p>あなたのスキルを活かせるインターンシップを見つけよう。</p>
              <Link href="/jobs" className="text-indigo-600 hover:underline">求人一覧を見る</Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <img src="/images/hero.svg" alt="体験談画像" className="" width="200" height="150" />
              <h3 className="text-xl font-bold mb-4">インターン体験談</h3>
              <p>実際にインターンシップに参加した先輩の声を聞いてみよう。</p>
              <Link href="/experiences" className="text-indigo-600 hover:underline">体験談を読む</Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/register" className="bg-indigo-600 text-white py-3 px-6 rounded hover:bg-indigo-700">今すぐ登録</Link>
          </div>
          {/* インターンシップのメリットセクション */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">インターンシップのメリット</h3>
            <ul className="list-disc list-inside">
              <li>実践的なスキルが身につく</li>
              <li>業界の知識が深まる</li>
              <li>就職活動に有利になる</li>
              <li>人脈が広がる</li>
            </ul>
          </div>
          {/* インターンシップ参加の流れセクション */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">インターンシップ参加の流れ</h3>
            <ol className="list-decimal list-inside">
              <li>会員登録</li>
              <li>求人検索</li>
              <li>応募</li>
              <li>企業との面談</li>
              <li>インターンシップ開始</li>
            </ol>
          </div>
        </div>
      </section>

      {/* コンテンツセクション (企業向け) */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-indigo-600 mb-8">企業向け</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <img src="/images/hero4.svg" alt="メリット画像" className="" width="200" height="150" />
              <h3 className="text-xl font-bold mb-4">求人掲載のメリット</h3>
              <p>優秀なインターン生をスカウトし、企業の成長を加速させましょう。</p>
              <Link href="/merits" className="text-indigo-600 hover:underline">メリットを見る</Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <img src="/images/hero3.svg" alt="導入事例画像" className="" width="200" height="150" />
              <h3 className="text-xl font-bold mb-4">導入事例</h3>
              <p>実際にインターン生を採用した企業の事例をご紹介します。</p>
              <Link href="/cases" className="text-indigo-600 hover:underline">事例を見る</Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/register" className="bg-teal-500 text-white py-3 px-6 rounded hover:bg-teal-600">求人を掲載する</Link>
          </div>
          {/* インターンシップ受け入れのメリットセクション */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">インターンシップ受け入れのメリット</h3>
            <ul className="list-disc list-inside">
              <li>優秀な人材を早期に発掘できる</li>
              <li>企業の魅力をアピールできる</li>
              <li>若手の視点を取り入れられる</li>
              <li>社員の育成につながる</li>
            </ul>
          </div>
          {/* インターンシップ受け入れの流れセクション */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">インターンシップ受け入れの流れ</h3>
            <ol className="list-decimal list-inside">
              <li>求人掲載</li>
              <li>応募受付</li>
              <li>面談</li>
              <li>インターンシップ開始</li>
              <li>評価・フィードバック</li>
            </ol>
          </div>
        </div>
      </section>

      {/* 成功事例セクション */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-indigo-600 mb-8 text-center">成功事例</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <img src="https://info.cookpad.com/assets/images/ogp.jpg" alt="成功事例1" className="" width="200" height="150" />
              <h3 className="text-xl font-bold mb-4">事例1</h3>
              <p>インターンシップを通して、即戦力となる人材を採用できました。</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <img src="https://dena.com/images/common/ogp.png" alt="成功事例2" className="" width="200" height="150" />
              <h3 className="text-xl font-bold mb-4">事例2</h3>
              <p>インターン生が企業の活性化に貢献してくれました。</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <img src="https://www.cyberagent.co.jp/files/user/img/common/ogp/ogimage.png" alt="成功事例3" className="" width="200" height="150" />
              <h3 className="text-xl font-bold mb-4">事例3</h3>
              <p>インターンシップがきっかけで、新卒採用に繋がりました。</p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} インターンマッチング</p>
          <div className="mt-4">
            <Link href="/sitemap" className="text-gray-300 hover:underline mr-4">サイトマップ</Link>
            <Link href="/privacy" className="text-gray-300 hover:underline mr-4">プライバシーポリシー</Link>
            <Link href="/terms" className="text-gray-300 hover:underline mr-4">利用規約</Link>
            <Link href="/contact" className="text-gray-300 hover:underline">お問い合わせ</Link>
          </div>
          <div className="mt-4">
            {/* ソーシャルメディアリンク */}
          </div>
        </div>
      </footer>
    </div>
  );
}

