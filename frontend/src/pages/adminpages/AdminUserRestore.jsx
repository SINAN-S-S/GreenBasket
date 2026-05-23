import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FiRefreshCcw, FiTrash2, FiArrowLeft, FiShield } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import '../adminCss/AdminRestore.css';

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
      <div className="admin-restore-header">
        <div className="admin-restore-header-left">
          <Link to="/admin/users" className="admin-restore-back-btn">
            <FiArrowLeft />
          </Link>
          <h1 className="admin-restore-title">Trash / User Restore</h1>
        </div>

        {users.length > 0 && (
          <button 
            onClick={emptyTrashHandler}
            className="admin-restore-empty-btn"
          >
            <FiTrash2 /> Empty Trash
          </button>
        )}
      </div>

      {loading ? (
        <div className="admin-restore-loading">Loading...</div>
      ) : users.length === 0 ? (
        <div className="admin-restore-empty-state">
          <h2 className="admin-restore-empty-title">The user trash is empty</h2>
        </div>
      ) : (
        <div className="admin-restore-table-container">
          <div className="admin-restore-table-wrapper">
            <table className="admin-restore-table">
              <thead>
                <tr>
                  <th className="th-gray">NAME</th>
                  <th className="th-gray">EMAIL</th>
                  <th className="th-gray">ROLE</th>
                  <th className="th-gray text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="admin-restore-text-muted admin-restore-line-through">{u.name}</div>
                    </td>
                    <td className="admin-restore-text-light admin-restore-line-through">{u.email}</td>
                    <td>
                      {u.isAdmin ? (
                        <span className="admin-restore-role-admin">
                          <FiShield /> Admin
                        </span>
                      ) : (
                        <span className="admin-restore-role-customer">Customer</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-restore-actions">
                        <button 
                          onClick={() => restoreHandler(u._id)}
                          className="admin-restore-action-btn admin-restore-action-restore"
                          title="Restore"
                        >
                          <FiRefreshCcw size={16} /> <span>Restore</span>
                        </button>
                        <button 
                          onClick={() => hardDeleteHandler(u._id)}
                          className="admin-restore-action-btn admin-restore-action-delete"
                          title="Permanently Delete"
                        >
                          <FiTrash2 size={16} /> <span>Delete Permanently</span>
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
