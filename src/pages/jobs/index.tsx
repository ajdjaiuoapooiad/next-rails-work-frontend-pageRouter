import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/jobs');
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
        <link rel="icon" href="/images/logo2.svg"  />
      </Head>


      <h1 className="text-3xl font-bold mb-6 text-gray-800">求人一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/jobs/${job.id}`}>
              <h2 className="text-xl font-semibold mb-3 text-blue-600 hover:underline cursor-pointer">
                {job.title}
              </h2>
            </Link>
            {job.location && (
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">場所:</span> {job.location}
              </p>
            )}
            {job.salary && (
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">時給:</span> {job.salary} 円
              </p>
            )}
            {job.employment_type && (
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">雇用形態:</span> {job.employment_type}
              </p>
            )}
            {job.description && (
              <p className="text-gray-800 text-sm">
                {job.description.length > 120
                  ? `${job.description.substring(0, 120)}...`
                  : job.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}