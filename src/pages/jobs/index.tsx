import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Sidebar from '@/components/Sidebar';


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
  user: {
    name: string;
    profiles: {
      user_icon: string;
    };
  };
  created_at: string;
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
        let data: Job[] = await response.json();
        data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
        <Sidebar
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          industryCategories={industryCategories}
        />

        <div className="col-span-3">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">求人一覧</h1>
          <p className="text-sm text-gray-600 mb-4">{jobs.length}件の求人</p> {/* 件数を表示 */}
          {jobs.map((job) => {
            const defaultUserIcon = 'https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_user_1.png';
            const user = job.user || { name: 'デフォルトユーザー' };

            return (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
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
                      {job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <img
                        src={user.profile?.user_icon || defaultUserIcon}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">{user.name}</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}