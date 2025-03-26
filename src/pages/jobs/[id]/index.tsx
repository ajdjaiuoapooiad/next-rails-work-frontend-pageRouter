import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/jobs/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '求人情報の取得に失敗しました');
        }
        const data: Job = await response.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message || '求人情報の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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

  if (!job) {
    return <p>求人情報が見つかりません。</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
      <p className="text-gray-600 mb-2">場所: {job.location}</p>
      <p className="text-gray-600 mb-2">給与: {job.salary}</p>
      <p className="text-gray-600 mb-2">雇用形態: {job.employment_type}</p>
      <p className="text-gray-700 mb-2">{job.description}</p>
      <h2 className="text-lg font-semibold mb-2">応募要件</h2>
      <p className="text-gray-700 mb-2">{job.requirements}</p>
      <h2 className="text-lg font-semibold mb-2">福利厚生</h2>
      <p className="text-gray-700">{job.benefits}</p>
    </div>
  );
}