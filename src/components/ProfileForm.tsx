import { useState, React,ChangeEvent, FormEvent } from 'react';

interface ProfileFormProps {
  initialProfile?: { introduction: string; skills: string; company_name: string; industry: string };
  onSubmit: (profile: { introduction: string; skills: string; company_name: string; industry: string }) => void;
  onError?: (error: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onSubmit, onError }) => {
  const [introduction, setIntroduction] = useState(initialProfile?.introduction || '');
  const [skills, setSkills] = useState(initialProfile?.skills || '');
  const [companyName, setCompanyName] = useState(initialProfile?.company_name || '');
  const [industry, setIndustry] = useState(initialProfile?.industry || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!introduction || !skills || !companyName || !industry) {
      setError("すべてのフィールドを入力してください。");
      if (onError) onError("すべてのフィールドを入力してください。");
      return;
    }
    setError(null);
    onSubmit({ introduction, skills, companyName, industry });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="introduction" className="block text-sm font-medium text-gray-700">自己紹介</label>
        <textarea
          id="introduction"
          value={introduction}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setIntroduction(e.target.value)}
          placeholder="自己紹介"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">スキル</label>
        <textarea
          id="skills"
          value={skills}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSkills(e.target.value)}
          placeholder="スキル"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">会社名</label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
          placeholder="会社名"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">業界</label>
        <input
          type="text"
          id="industry"
          value={industry}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
          placeholder="業界"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        保存
      </button>
    </form>
  );
};

export default ProfileForm;