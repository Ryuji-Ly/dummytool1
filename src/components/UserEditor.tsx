'use client';

import { useState } from 'react';

interface User {
  id: string | number;
  [key: string]: any;
}

interface UserEditorProps {
  user: User;
  onCancel: () => void;
  onUpdate: (user: User) => Promise<void>;
}

export default function UserEditor({ user, onCancel, onUpdate }: UserEditorProps) {
  const [formData, setFormData] = useState<User>({ ...user });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(formData);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (key: string, value: any) => {
    // Skip rendering the id field as input
    if (key === 'id') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID
          </label>
          <input
            type="text"
            value={value}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
          />
        </div>
      );
    }

    // Determine input type based on value type
    const inputType = typeof value === 'number' ? 'number' : 'text';

    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
          {key.replace(/_/g, ' ')}
        </label>
        <input
          type={inputType}
          value={value || ''}
          onChange={(e) => {
            const newValue = inputType === 'number' 
              ? parseFloat(e.target.value) || 0
              : e.target.value;
            handleChange(key, newValue);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit User</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-6">
          {Object.entries(formData).map(([key, value]) => {
            // Only render primitive types
            if (typeof value === 'object' && value !== null) {
              return null;
            }
            return renderField(key, value);
          })}

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
