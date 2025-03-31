import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  company_id: number;
  requirements: string;
  benefits: string;
  employment_type: string;
  image_url?: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');

  const industryCategories = {
    IT: ['エンジニア', 'デザイナー', 'マーケター', 'プロジェクトマネージャー'],
    Finance: ['アナリスト', 'トレーダー', 'コンサルタント', '会計士'],
    Manufacturing: ['生産管理', '品質管理', '研究開発', '設計'],
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('API URLが設定されていません。');
        }
        const response = await fetch(`${apiUrl}/jobs`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '求人情報の取得に失敗しました');
        }
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message || '求人情報の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 font-semibold text-lg">エラー: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>求人一覧ページ</title>
        <link rel="icon" href="/images/logo2.svg" />
      </Head>

      <div className="grid grid-cols-4 gap-4 max-w-7xl mx-auto px-[150px]">
        {/* サイドバー */}
        <aside className="col-span-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">キーワード検索</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <h2 className="text-lg font-semibold mb-4">フィルタ</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">場所</label>
            <div className="flex flex-col">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">東京</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">大阪</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">福岡</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">業界</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="">全て</option>
              <option value="IT">IT</option>
              <option value="Finance">金融</option>
              <option value="Manufacturing">製造業</option>
            </select>
          </div>
          {selectedIndustry && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">カテゴリ</label>
              <div className="flex flex-col">
                {industryCategories[selectedIndustry].map((category) => (
                  <label key={category} className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">雇用形態</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option>全て</option>
              <option>正社員</option>
              <option>アルバイト</option>
              <option>インターン</option>
            </select>
          </div>
        </aside>

        {/* 求人情報リスト */}
        <div className="col-span-3">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">求人一覧</h1>
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md p-4 mb-4"
            >
              <Link href={`/jobs/${job.id}`}>
                <div>
                  <img
                    src={job.image_url || 'https://images.wantedly.com/i/fzq897n?w=1960&format=jpeg'}
                    alt={job.title}
                    className="w-full h-[250px] object-cover rounded-md mb-2"
                  />
                  <h2 className="text-lg font-semibold mb-1 text-blue-600 hover:underline cursor-pointer">
                    {job.title}
                  </h2>
                  <p className="text-gray-800 text-sm">
                    {job.description.length > 150
                      ? `${job.description.substring(0, 150)}...`
                      : job.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}