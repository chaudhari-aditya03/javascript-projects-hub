import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

/**
 * User List Component
 * Shows all users with online status and search
 */
export default function UserList({ onSelectUser, selectedUserId }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.listUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      const results = await userAPI.searchUsers(query);
      setUsers(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
        />
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Loading users...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 text-sm">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No users found
          </div>
        ) : (
          users.map(user => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`w-full px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition flex items-center gap-3 ${
                selectedUserId === user.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 text-sm">
                  {user.username}
                </div>
                <div className="text-xs text-gray-500">
                  {user.email}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                user.is_online ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
