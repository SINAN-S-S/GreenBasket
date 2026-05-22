import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FiTrash2, FiTrash, FiShield, FiShieldOff, FiUserCheck, FiUserX } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/users', config);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlockHandler = async (id, isBlocked, isAdmin) => {
    if (isAdmin) {
      Swal.fire({ icon: 'error', title: 'Action Denied', text: 'You cannot block an Admin user.' });
      return;
    }

    const actionText = isBlocked ? 'Unblock' : 'Block';
    const result = await Swal.fire({
      title: `${actionText} User?`,
      text: isBlocked ? "This user will regain access to their account." : "This user will be prevented from logging in.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBlocked ? '#22c55e' : '#f59e0b',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: `Yes, ${actionText} them!`
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        await axios.put(`http://localhost:5000/api/users/${id}/block`, {}, config);
        Swal.fire({
          title: 'Success!',
          text: `User has been ${actionText.toLowerCase()}ed.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchUsers();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || `Error ${actionText.toLowerCase()}ing user` });
      }
    }
  };

  const deleteHandler = async (id, isAdmin) => {
    if (isAdmin) {
      Swal.fire({ icon: 'error', title: 'Action Denied', text: 'You cannot delete an Admin user.' });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This user will be moved to the Trash.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f87171',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete them!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        await axios.delete(`http://localhost:5000/api/users/${id}`, config);
        Swal.fire({
          title: 'Deleted!',
          text: 'The user has been moved to the trash.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchUsers();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error deleting user' });
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <Link 
          to="/admin/users/restore"
          className="flex items-center gap-2 bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-medium shadow-sm"
        >
          <FiTrash /> Trash
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-brand-green">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="py-4 px-6 font-medium">NAME</th>
                  <th className="py-4 px-6 font-medium">EMAIL</th>
                  <th className="py-4 px-6 font-medium">ROLE</th>
                  <th className="py-4 px-6 font-medium">STATUS</th>
                  <th className="py-4 px-6 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className={`hover:bg-gray-50/50 transition-colors ${u.isBlocked ? 'bg-red-50/30' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-800">{u.name}</div>
                      {u.username && <div className="text-xs text-gray-400">@{u.username}</div>}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{u.email}</td>
                    <td className="py-4 px-6">
                      {u.isAdmin ? (
                        <span className="flex items-center gap-1 text-brand-green font-bold text-xs bg-green-50 px-2 py-1 rounded-md w-max">
                          <FiShield /> Admin
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs font-medium">Customer</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {u.isBlocked ? (
                        <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-md">Blocked</span>
                      ) : (
                        <span className="text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded-md">Active</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => toggleBlockHandler(u._id, u.isBlocked, u.isAdmin)}
                          className={`p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${
                            u.isAdmin ? 'bg-gray-50 text-gray-300 cursor-not-allowed' :
                            u.isBlocked 
                              ? 'bg-green-50 text-green-500 hover:bg-green-100' 
                              : 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                          }`}
                          title={u.isBlocked ? "Unblock User" : "Block User"}
                        >
                          {u.isBlocked ? <FiUserCheck size={18} /> : <FiUserX size={18} />}
                        </button>
                        
                        <button 
                          onClick={() => deleteHandler(u._id, u.isAdmin)}
                          className={`p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${
                            u.isAdmin ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-red-50 text-red-500 hover:bg-red-100'
                          }`}
                          title="Delete User"
                        >
                          <FiTrash2 size={18} />
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

export default AdminUsers;
