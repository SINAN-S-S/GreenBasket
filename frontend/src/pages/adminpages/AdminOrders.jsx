import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { FiCheckCircle, FiXCircle, FiTruck, FiTrash2 } from 'react-icons/fi';
import '../adminCss/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deliverHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Mark as Delivered?',
      text: "Are you sure this order has been delivered to the customer?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, mark delivered!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, config);
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: 'Order Delivered',
          showConfirmButton: false,
          timer: 1500
        });
        fetchOrders();
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Error updating order', 'error');
      }
    }
  };

  const deleteOrderHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Order?',
      text: "Are you sure you want to permanently delete this cancelled order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/orders/${id}`, config);
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: 'Order Deleted',
          showConfirmButton: false,
          timer: 1500
        });
        fetchOrders();
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Error deleting order', 'error');
      }
    }
  };

  return (
    <div>
      <div className="admin-orders-header">
        <h1 className="admin-orders-title">Orders</h1>
      </div>

      {loading ? (
        <div className="admin-orders-loading">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="admin-orders-empty">
          <div className="admin-orders-empty-icon">
            <FiTruck />
          </div>
          <h2 className="admin-orders-empty-title">No Orders Found</h2>
          <p className="admin-orders-empty-desc">There are no orders in the system yet.</p>
        </div>
      ) : (
        <div className="admin-orders-table-container">
          <div className="admin-orders-table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>USER</th>
                  <th>DATE</th>
                  <th>ITEMS</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th className="text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="admin-orders-id">ORD-{order._id.substring(18, 24).toUpperCase()}</td>
                    <td>
                      <div className="admin-orders-user-name">{order.user?.name || 'Unknown User'}</div>
                      <div className="admin-orders-user-email">{order.user?.email}</div>
                    </td>
                    <td className="admin-orders-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="admin-orders-items">
                      <div className="admin-orders-items-list">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="admin-orders-item-row">
                            <span className="admin-orders-item-qty">{item.qty}x</span> {item.name} <span className="admin-orders-item-unit">({item.unit || '1kg'})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="admin-orders-total">₹{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        <div className="admin-orders-badge admin-orders-badge-success">
                          <FiCheckCircle /> Yes
                        </div>
                      ) : (
                        <div className="admin-orders-badge admin-orders-badge-warning">
                          <FiXCircle /> COD
                        </div>
                      )}
                    </td>
                    <td>
                      {order.isCancelled ? (
                        <div className="admin-orders-badge admin-orders-badge-danger">
                          <FiXCircle /> Cancelled
                        </div>
                      ) : order.isDelivered ? (
                        <div className="admin-orders-badge admin-orders-badge-success">
                          <FiCheckCircle /> {new Date(order.deliveredAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="admin-orders-badge admin-orders-badge-warning" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                          <FiTruck /> Pending
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="admin-orders-actions">
                        {!order.isDelivered && !order.isCancelled && (
                          <button 
                            onClick={() => deliverHandler(order._id)}
                            className="admin-orders-action-btn"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.isCancelled && (
                          <button 
                            onClick={() => deleteOrderHandler(order._id)}
                            className="admin-action-btn admin-action-delete"
                            title="Delete Order"
                            style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
                          >
                            <FiTrash2 />
                          </button>
                        )}
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

export default AdminOrders;
