import { useState } from 'react';
import { useRouter } from 'next/router';

export default function JobCreate() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [requirements, setRequirements] = useState<string>('');
  const [benefits, setBenefits] = useState<string>('');
  const [employmentType, setEmploymentType] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const requiredFields = ['タイトル', '説明', '場所', '雇用形態'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URLが設定されていません。');
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      if (salary) {
        formData.append('salary', salary);
      }
      formData.append('requirements', requirements);
      formData.append('benefits', benefits);
      formData.append('employment_type', employmentType);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${apiUrl}/jobs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '求人情報の作成に失敗しました');
      }

      router.push('/jobs');
    } catch (err: any) {
      setError(err.message || '求人情報の作成中にエラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 w-full max-w-3xl mx-auto"> {/* コンテナの最大幅を調整 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-gray-300 shadow-lg rounded-3xl sm:p-20"> {/* paddingを調整 */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">求人作成</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                タイトル
                {requiredFields.includes('タイトル') && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                説明
                {requiredFields.includes('説明') && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={6} // テキストエリアの行数を調整
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                場所
                {requiredFields.includes('場所') && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">給与</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">応募要件</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={4} // テキストエリアの行数を調整
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">福利厚生</label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={4} // テキストエリアの行数を調整
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                雇用形態
                {requiredFields.includes('雇用形態') && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">画像</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              作成
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}