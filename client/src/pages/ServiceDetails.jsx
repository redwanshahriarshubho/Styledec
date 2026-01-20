import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter } from "lucide-react";

const Services = () => {
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/services?search=${search}&type=${category}`)
            .then(res => setServices(res.data));
    }, [search, category]);

    return (
        <div className="container mx-auto p-10">
            <h2 className="text-4xl font-black mb-8">Decoration Packages</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20}/>
                    <input 
                        type="text" 
                        placeholder="Search service name..." 
                        className="input input-bordered w-full pl-10"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className="select select-bordered w-full md:w-64" onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="home">Home Decor</option>
                    <option value="wedding">Wedding</option>
                    <option value="office">Office</option>
                </select>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => (
                    <div key={service._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-slate-100">
                        <figure className="h-56"><img src={service.image} className="w-full h-full object-cover" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">{service.service_name}</h2>
                            <p className="text-slate-500 line-clamp-2">{service.description}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-2xl font-bold text-primary">৳{service.cost}</span>
                                <div className="badge badge-outline">{service.service_category}</div>
                            </div>
                            <div className="card-actions mt-6">
                                <button className="btn btn-primary btn-block rounded-xl">Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;