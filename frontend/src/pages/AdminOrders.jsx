import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi';

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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
      </div>

      {loading ? (
        <div className="text-center py-10 text-brand-green">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTruck className="text-2xl text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No Orders Found</h2>
          <p className="text-gray-500">There are no orders in the system yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="py-4 px-6 font-medium">ORDER ID</th>
                  <th className="py-4 px-6 font-medium">USER</th>
                  <th className="py-4 px-6 font-medium">DATE</th>
                  <th className="py-4 px-6 font-medium">TOTAL</th>
                  <th className="py-4 px-6 font-medium">PAID</th>
                  <th className="py-4 px-6 font-medium">DELIVERED</th>
                  <th className="py-4 px-6 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-500 font-mono">{order._id.substring(18, 24)}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-800">{order.user?.name || 'Unknown User'}</div>
                      <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-brand-green">₹{order.totalPrice}</td>
                    <td className="py-4 px-6">
                      {order.isPaid ? (
                        <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-md w-max text-xs font-bold">
                          <FiCheckCircle /> Yes
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1 rounded-md w-max text-xs font-bold">
                          <FiXCircle /> COD
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {order.isDelivered ? (
                        <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-md w-max text-xs font-bold">
                          <FiCheckCircle /> {new Date(order.deliveredAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-md w-max text-xs font-bold">
                          <FiXCircle /> Pending
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-3">
                        {!order.isDelivered && (
                          <button 
                            onClick={() => deliverHandler(order._id)}
                            className="px-3 py-1.5 bg-brand-green text-white rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                          >
                            Mark Delivered
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
