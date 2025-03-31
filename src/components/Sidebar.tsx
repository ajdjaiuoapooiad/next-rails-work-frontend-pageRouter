import { useState } from 'react';

interface SidebarProps {
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  industryCategories: { [key: string]: string[] };
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedIndustry,
  setSelectedIndustry,
  industryCategories,
}) => {
  return (
    <aside className="col-span-1">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          キーワード検索
        </label>
        <input
          type="text"
          placeholder="キーワードで検索"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <h2 className="text-lg font-semibold mb-4">フィルタ</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">場所</label>
        <div className="flex flex-col">
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">東京</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">大阪</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">福岡</span>
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">業界</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
        >
          <option value="">全て</option>
          <option value="IT">IT</option>
          <option value="Finance">金融</option>
          <option value="Manufacturing">製造業</option>
        </select>
      </div>
      {selectedIndustry && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            カテゴリ
          </label>
          <div className="flex flex-col">
            {industryCategories[selectedIndustry].map((category) => (
              <label key={category} className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          雇用形態
        </label>
        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option>全て</option>
          <option>正社員</option>
          <option>アルバイト</option>
          <option>インターン</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">特徴</label>
        <div className="flex flex-col">
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">学生さん歓迎</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">昼食おごります</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">服装自由</span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;