import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/admin/bookings')
            .then(res => setBookings(res.data));
    }, []);

    const handleAssign = async (id, email) => {
        await axios.patch(`http://localhost:5000/admin/assign-decorator/${id}`, { decoratorEmail: email });
        alert("Decorator Assigned!");
        // Refresh data
    };

    return (
        <div className="p-10 bg-base-200 min-h-screen">
            <h2 className="text-3xl font-bold mb-8 border-l-4 border-accent pl-4">Admin Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="stats shadow bg-primary text-primary-content">
                    <div className="stat">
                        <div className="stat-title text-white">Total Revenue</div>
                        <div className="stat-value">৳ 45,200</div>
                    </div>
                </div>
                {/* Add more stats here for Analytics Marks */}
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th>Service</th>
                            <th>Customer</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking._id}>
                                <td className="font-semibold">{booking.serviceName}</td>
                                <td>{booking.customerEmail}</td>
                                <td>
                                    <span className={`badge ${booking.paid ? 'badge-success' : 'badge-error'}`}>
                                        {booking.paid ? 'Paid' : 'Unpaid'}
                                    </span>
                                </td>
                                <td><div className="badge badge-outline">{booking.status}</div></td>
                                <td>
                                    <select 
                                        className="select select-bordered select-sm"
                                        onChange={(e) => handleAssign(booking._id, e.target.value)}
                                        disabled={!booking.paid}
                                    >
                                        <option disabled selected>Assign Decorator</option>
                                        <option value="decorator1@style.com">Robert (Floral Specialist)</option>
                                        <option value="decorator2@style.com">Sarah (Smart Home Expert)</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;