import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number | null;
  requirements: string;
  benefits: string;
  employment_type: string;
}

export default function JobEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [salary, setSalary] = useState<number | null>(null);
  const [requirements, setRequirements] = useState<string>('');
  const [benefits, setBenefits] = useState<string>('');
  const [employmentType, setEmploymentType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3001/api/v1/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('求人情報の取得に失敗しました');
        }

        const data: Job = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setSalary(data.salary);
        setRequirements(data.requirements);
        setBenefits(data.benefits);
        setEmploymentType(data.employment_type);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/v1/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          salary,
          requirements,
          benefits,
          employment_type: employmentType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '求人情報の更新に失敗しました');
      }

      router.push('/jobs');
    } catch (err: any) {
      setError(err.message || '求人情報の更新中にエラーが発生しました');
    }
  };

  if (loading) {
    return <p>ロード中...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">求人編集</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* grid レイアウトを適用 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 py-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">場所</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 py-3  block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">給与</label>
            <input
              type="number"
              value={salary !== null ? salary.toString() : ''}
              onChange={(e) => setSalary(e.target.value ? parseInt(e.target.value) : null)}
              className="mt-1 py-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">雇用形態</label>
            <input
              type="text"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="mt-1 py-3  block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={8}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">応募要件</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={5}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">福利厚生</label>
          <textarea
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={5}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          更新
        </button>
      </form>
    </div>
  );
}