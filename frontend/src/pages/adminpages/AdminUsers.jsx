import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FiTrash2, FiTrash, FiShield, FiUserCheck, FiUserX } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import '../adminCss/AdminUsers.css';

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
      <div className="admin-users-header">
        <h1 className="admin-users-title">Users</h1>
        <Link 
          to="/admin/users/restore"
          className="admin-users-trash-btn"
        >
          <FiTrash /> Trash
        </Link>
      </div>

      {loading ? (
        <div className="admin-users-loading">Loading...</div>
      ) : (
        <div className="admin-users-table-container">
          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ADDRESS</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th className="text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className={u.isBlocked ? 'admin-users-row-blocked' : ''}>
                    <td>
                      <div className="admin-users-name">{u.name}</div>
                      {u.username && <div className="admin-users-username">@{u.username}</div>}
                    </td>
                    <td className="admin-users-email">{u.email}</td>
                    <td className="admin-users-address text-sm text-gray-600 max-w-xs truncate" title={u.address}>{u.address}</td>
                    <td>
                      {u.isAdmin ? (
                        <span className="admin-users-role-admin">
                          <FiShield /> Admin
                        </span>
                      ) : (
                        <span className="admin-users-role-customer">Customer</span>
                      )}
                    </td>
                    <td>
                      {u.isBlocked ? (
                        <span className="admin-users-status-blocked">Blocked</span>
                      ) : (
                        <span className="admin-users-status-active">Active</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-users-actions">
                        <button 
                          onClick={() => toggleBlockHandler(u._id, u.isBlocked, u.isAdmin)}
                          className={`admin-users-action-btn ${
                            u.isAdmin ? 'admin-users-action-disabled' :
                            u.isBlocked 
                              ? 'admin-users-action-unblock' 
                              : 'admin-users-action-block'
                          }`}
                          title={u.isBlocked ? "Unblock User" : "Block User"}
                        >
                          {u.isBlocked ? <FiUserCheck size={18} /> : <FiUserX size={18} />}
                        </button>
                        
                        <button 
                          onClick={() => deleteHandler(u._id, u.isAdmin)}
                          className={`admin-users-action-btn ${
                            u.isAdmin ? 'admin-users-action-disabled' : 'admin-users-action-delete'
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
