import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'; // axios をインポート

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  requirements: string;
  benefits: string;
  image_url: string;
  company_id: number; // 企業のIDを追加
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

  const handleInquiry = async () => {
    if (!job) return;

    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setError('ログインしてください');
        return;
      }

      await axios.post(
        'http://localhost:3001/api/v1/messages',
        {
          sender_id: parseInt(userId),
          receiver_id: job.company_id,
          content: `求人「${job.title}」について話を聞きたいです。`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('メッセージを送信しました');
    } catch (err: any) {
      setError(err.response?.data?.message || 'メッセージの送信に失敗しました');
    }
  };

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
      {job.image_url && <img src={job.image_url} alt="Job Image" className="mb-4 rounded-md" />}
      <p className="text-gray-600 mb-2">場所: {job.location}</p>
      <p className="text-gray-700 mb-2" style={{ whiteSpace: 'pre-line' }}>{job.description}</p> {/* 改行を反映 */}
      <h2 className="text-lg font-semibold mb-2">応募要件</h2>
      <p className="text-gray-700 mb-2" style={{ whiteSpace: 'pre-line' }}>{job.requirements}</p> {/* 改行を反映 */}
      <button onClick={handleInquiry} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        話を聞いてみる
      </button>
    </div>
  );
}