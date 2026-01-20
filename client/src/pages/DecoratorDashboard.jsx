import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Truck, Hammer, MapPin, PackageCheck } from 'lucide-react';

const DecoratorDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const decoratorEmail = "decorator1@style.com"; // Get this from your Auth Context

    const statusFlow = [
        "Assigned", 
        "Planning Phase", 
        "Materials Prepared", 
        "On the Way to Venue", 
        "Setup in Progress", 
        "Completed"
    ];

    useEffect(() => {
        axios.get(`http://localhost:5000/decorator-tasks/${decoratorEmail}`)
            .then(res => setTasks(res.data));
    }, [decoratorEmail]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/update-status/${id}`, { status: newStatus });
            // Update local state to reflect change immediately
            setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    return (
        <div className="p-8 bg-base-100">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-primary">Decorator Workspace</h1>
                <p className="text-gray-500">Manage your on-site assignments and updates.</p>
            </header>

            <div className="grid gap-8">
                {tasks.map((task) => (
                    <div key={task._id} className="card bg-base-200 shadow-xl border-l-8 border-accent">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="card-title text-2xl">{task.serviceName}</h2>
                                    <p className="flex items-center gap-2 text-gray-600">
                                        <MapPin size={16} /> {task.location}
                                    </p>
                                </div>
                                <div className="badge badge-accent badge-lg">{task.status}</div>
                            </div>

                            {/* --- Progress Steps --- */}
                            <ul className="steps steps-vertical lg:steps-horizontal w-full my-6">
                                {statusFlow.map((step, index) => (
                                    <li 
                                        key={index} 
                                        className={`step ${statusFlow.indexOf(task.status) >= index ? 'step-primary' : ''}`}
                                    >
                                        {step}
                                    </li>
                                ))}
                            </ul>

                            <div className="card-actions justify-end gap-2">
                                <span className="mr-auto font-bold text-lg text-primary">
                                    Total Earnings: ৳{task.price * 0.2} <small>(20% Commission)</small>
                                </span>
                                
                                {task.status !== "Completed" && (
                                    <button 
                                        onClick={() => handleStatusUpdate(task._id, statusFlow[statusFlow.indexOf(task.status) + 1])}
                                        className="btn btn-primary"
                                    >
                                        Move to Next Stage
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DecoratorDashboard;