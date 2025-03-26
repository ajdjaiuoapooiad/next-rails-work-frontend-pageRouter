import { useState, useEffect } from 'react';

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
        const response = await fetch('http://localhost:3001/api/v1/jobs'); // Rails APIのエンドポイント
        if (!response.ok) {
          throw new Error('求人情報の取得に失敗しました');
        }
        const data: Job[] = await response.json();
        setJobs(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <p>ロード中...</p>;
  }

  if (error) {
    return <p>エラー: {error}</p>;
  }

  return (
    <div>
      <h1>求人一覧</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h2>{job.title}</h2>
            <p>場所: {job.location}</p>
            <p>給与: {job.salary}</p>
            <p>雇用形態: {job.employment_type}</p>
            <p>{job.description}</p>
            {/* 他の求人情報も表示 */}
          </li>
        ))}
      </ul>
    </div>
  );
}