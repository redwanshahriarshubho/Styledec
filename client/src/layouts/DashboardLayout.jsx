import { Link, Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Home, Settings, Briefcase, ShoppingBag, Menu } from "lucide-react";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
    const [role] = useRole(); // admin, decorator, or user

    const adminLinks = (
        <>
            <li><NavLink to="/dashboard/admin-home"><LayoutDashboard size={20}/> Admin Home</NavLink></li>
            <li><NavLink to="/dashboard/manage-services"><Briefcase size={20}/> Manage Services</NavLink></li>
            <li><NavLink to="/dashboard/all-bookings"><Users size={20}/> All Bookings</NavLink></li>
        </>
    );

    const decoratorLinks = (
        <>
            <li><NavLink to="/dashboard/decorator-home"><LayoutDashboard size={20}/> Decorator Home</NavLink></li>
            <li><NavLink to="/dashboard/my-tasks"><Briefcase size={20}/> My Assignments</NavLink></li>
        </>
    );

    const userLinks = (
        <>
            <li><NavLink to="/dashboard/my-bookings"><ShoppingBag size={20}/> My Bookings</NavLink></li>
            <li><NavLink to="/dashboard/user-profile"><Settings size={20}/> My Profile</NavLink></li>
        </>
    );

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col p-8 bg-slate-50">
                {/* Mobile Menu Button */}
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden mb-4">
                    <Menu /> Open Menu
                </label>
                <Outlet /> {/* Content renders here */}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content text-lg font-medium space-y-2">
                    <div className="mb-10 px-4">
                        <h1 className="text-2xl font-black text-primary italic">StyleDecor</h1>
                        <div className="badge badge-accent badge-sm uppercase">{role} Panel</div>
                    </div>
                    
                    {role === 'admin' && adminLinks}
                    {role === 'decorator' && decoratorLinks}
                    {role === 'user' && userLinks}
                    
                    <div className="divider"></div>
                    <li><NavLink to="/"><Home size={20}/> Back to Home</NavLink></li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;