import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  requirements: string;
  benefits: string;
  employment_type: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">エラー: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">求人一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-4">
            <Link href={`/jobs/${job.id}`}>
              <h2 className="text-xl font-semibold mb-2 hover:underline cursor-pointer">{job.title}</h2>
            </Link>
            <p className="text-gray-600 mb-1">場所: {job.location}</p>
            <p className="text-gray-600 mb-1">給与: {job.salary}</p>
            <p className="text-gray-600 mb-1">雇用形態: {job.employment_type}</p>
            <p className="text-gray-700">{job.description.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}