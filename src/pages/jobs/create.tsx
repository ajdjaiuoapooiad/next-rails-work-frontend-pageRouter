import { useState } from 'react';
import { useRouter } from 'next/router';

export default function JobCreate() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [salary, setSalary] = useState<string>(''); // stringに変更
  const [requirements, setRequirements] = useState<string>('');
  const [benefits, setBenefits] = useState<string>('');
  const [employmentType, setEmploymentType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ローカルストレージからトークンを取得 (例)
      const token = localStorage.getItem('authToken');

      const response = await fetch('http://localhost:3001/api/v1/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // トークンをヘッダーに追加
        },
        body: JSON.stringify({
          title,
          description,
          location,
          salary: salary ? parseInt(salary) : null,
          requirements,
          benefits,
          employment_type: employmentType,
        }),
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '求人情報の作成に失敗しました');
      }

      router.push('/jobs'); // 求人一覧ページへリダイレクト
    } catch (err: any) {
      setError(err.message || '求人情報の作成中にエラーが発生しました');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">求人作成</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">タイトル</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">説明</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">場所</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">給与</label>
          <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">応募要件</label>
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">福利厚生</label>
          <textarea value={benefits} onChange={(e) => setBenefits(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">雇用形態</label>
          <input type="text" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">作成</button>
      </form>
    </div>
  );
}