import React from 'react';

const Dashboard = ({ stats, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <p className="text-gray-600 mb-4">
        Selamat datang di Panel Admin Perkebunan Dayeuhmanggung.
      </p>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Total Artikel</h3>
            <p className="text-2xl font-bold text-blue-700">{stats.totalArtikel}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Total Review</h3>
            <p className="text-2xl font-bold text-green-700">{stats.totalReview}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Total Foto</h3>
            <p className="text-2xl font-bold text-purple-700">{stats.totalFoto}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 