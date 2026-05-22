import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FiRefreshCcw, FiTrash2, FiArrowLeft, FiShield } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const AdminUserRestore = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  const fetchDeletedUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/users/deleted/all', config);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching deleted users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const restoreHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Restore User?',
      text: "This user will regain access to their account.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e', // brand-green
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, restore them!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        await axios.put(`http://localhost:5000/api/users/${id}/restore`, {}, config);
        Swal.fire({
          title: 'Restored!',
          text: 'The user has been restored.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchDeletedUsers();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error restoring user' });
      }
    }
  };

  const hardDeleteHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Permanently Delete?',
      text: "You won't be able to revert this! This completely erases the user from the database forever.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete permanently!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        await axios.delete(`http://localhost:5000/api/users/${id}/hard`, config);
        Swal.fire({
          title: 'Deleted!',
          text: 'The user has been permanently deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchDeletedUsers();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error deleting user' });
      }
    }
  };

  const emptyTrashHandler = async () => {
    const result = await Swal.fire({
      title: 'Empty Trash?',
      text: "This will permanently delete all users in the trash! This action is irreversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, empty trash!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        await axios.delete('http://localhost:5000/api/users/deleted/all/empty', config);
        Swal.fire('Emptied!', 'All trashed users have been permanently deleted.', 'success');
        fetchDeletedUsers();
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Error emptying trash', 'error');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/users" className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <FiArrowLeft className="text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Trash / User Restore</h1>
        </div>

        {users.length > 0 && (
          <button 
            onClick={emptyTrashHandler}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm"
          >
            <FiTrash2 /> Empty Trash
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-brand-green">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-medium text-gray-600">The user trash is empty</h2>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="py-4 px-6 font-medium">NAME</th>
                  <th className="py-4 px-6 font-medium">EMAIL</th>
                  <th className="py-4 px-6 font-medium">ROLE</th>
                  <th className="py-4 px-6 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-500 line-through">{u.name}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-400 line-through">{u.email}</td>
                    <td className="py-4 px-6">
                      {u.isAdmin ? (
                        <span className="flex items-center gap-1 text-gray-400 font-bold text-xs bg-gray-100 px-2 py-1 rounded-md w-max">
                          <FiShield /> Admin
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs font-medium">Customer</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => restoreHandler(u._id)}
                          className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
                          title="Restore"
                        >
                          <FiRefreshCcw size={16} /> <span className="text-sm font-medium">Restore</span>
                        </button>
                        <button 
                          onClick={() => hardDeleteHandler(u._id)}
                          className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                          title="Permanently Delete"
                        >
                          <FiTrash2 size={16} /> <span className="text-sm font-medium">Delete Permanently</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserRestore;
