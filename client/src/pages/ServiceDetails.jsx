import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [user, setUser] = useState({ name: "John Doe", email: "john@example.com" }); // Replace with Auth context

  useEffect(() => {
    axios.get(`http://localhost:5000/services/${id}`)
      .then(res => setService(res.data));
  }, [id]);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const bookingData = {
      ...data,
      serviceName: service.service_name,
      price: service.cost,
      customerEmail: user.email,
      status: "Assigned"
    };
    
    try {
      await axios.post('http://localhost:5000/bookings', bookingData);
      alert("Booking Successful!");
      document.getElementById('booking-modal').close();
    } catch (err) {
      console.error(err);
    }
  };

  if (!service) return <span className="loading loading-spinner loading-lg"></span>;

  return (
    <div className="container mx-auto p-8">
      <div className="card lg:card-side bg-base-100 shadow-xl border-2 border-accent/20">
        <figure><img src={service.image} alt={service.service_name} className="w-full h-96 object-cover" /></figure>
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-primary">{service.service_name}</h2>
          <p className="text-gray-600">{service.description}</p>
          <div className="badge badge-secondary p-4 text-lg">Cost: ৳{service.cost} {service.unit}</div>
          
          <div className="card-actions justify-end mt-10">
            <button className="btn btn-primary" onClick={() => document.getElementById('booking-modal').showModal()}>
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* --- Booking Modal --- */}
      <dialog id="booking-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-accent">Complete Your Booking</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <input type="text" value={user.name} readOnly className="input input-bordered w-full bg-gray-100" />
            <input type="email" value={user.email} readOnly className="input input-bordered w-full bg-gray-100" />
            <input type="date" {...register("date")} required className="input input-bordered w-full" />
            <input type="text" placeholder="Service Location" {...register("location")} required className="input input-bordered w-full" />
            <button className="btn btn-accent w-full mt-4">Confirm Booking</button>
          </form>
          <div className="modal-action">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById('booking-modal').close()}>✕</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ServiceDetails;