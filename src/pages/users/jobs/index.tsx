import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  // ... (求人情報の他のプロパティ)
}

const CompanyJobs = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // ユーザーIDを保持

  useEffect(() => {
    // localStorage から userId を取得
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(parseInt(id));
    }
  }, []);

  useEffect(() => {
    if (!userId) return; // userId がない場合は処理を中断

    const fetchJobs = async () => {
      try {
        // ログインユーザー自身のIDを使用して求人情報を取得
        const response = await axios.get(`http://localhost:3001/api/v1/jobs?company_id=${userId}`);
        setJobs(response.data);
      } catch (err: any) {
        setError(err.message || '求人情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId]); // userId が変更された場合に再実行

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>募集した求人一覧</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyJobs;