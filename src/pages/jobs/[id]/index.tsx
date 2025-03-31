import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

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
  image_url: string;
}

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('API URLが設定されていません。');
        }
        const response = await fetch(`${apiUrl}/jobs/${id}`);
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URLが設定されていません。');
      }

      await axios.post(
        `${apiUrl}/messages`,
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

  const handleLike = () => {
    setIsLiked(!isLiked);
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-9/10 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">{job.title}</h1>
        <div className="flex justify-end mb-4">
          <button onClick={handleLike} className="text-2xl text-red-500">
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <div className="flex justify-center mb-8">
          <img
            src={job.image_url || 'https://images.wantedly.com/i/jtLvrG6?w=800&format=jpeg'}
            alt="Job Image"
            className="rounded-md w-full"
            style={{ height: '400px', objectFit: 'cover' }}
          />
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">私たちのストーリー</h2>
          <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
            {/* 企業のストーリーや社員の想いを記述 */}
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">業務内容</h2>
          <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
            {job.description}
          </p>
        </div>
        {job.requirements && job.requirements.trim() && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">応募要件</h2>
            <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
              {job.requirements}
            </p>
          </div>
        )}
        {job.benefits && job.benefits.trim() && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">福利厚生</h2>
            <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
              {job.benefits}
            </p>
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={handleInquiry}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg"
          >
            話を聞いてみる
          </button>
        </div>
      </div>
    </div>
  );
}