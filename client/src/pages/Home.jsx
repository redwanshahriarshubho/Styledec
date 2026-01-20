import Hero from "../components/Hero";
import CoverageMap from "../components/CoverageMap";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <Hero />
            
            {/* Short Service Overview Section */}
            <section className="py-20 container mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold">Featured Packages</h2>
                        <div className="h-1 w-20 bg-accent mt-2"></div>
                    </div>
                    <Link to="/services" className="btn btn-ghost text-accent">View All Services →</Link>
                </div>
                {/* Add a simple grid here that fetches first 3 services from DB */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center p-10 bg-base-200 rounded-3xl">
                    <div className="p-6">
                        <div className="text-5xl mb-4">🏠</div>
                        <h3 className="font-bold text-xl">Home Decor</h3>
                        <p>Smart living room transformations.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-5xl mb-4">💍</div>
                        <h3 className="font-bold text-xl">Weddings</h3>
                        <p>Elegant floral & lighting setups.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-5xl mb-4">🏢</div>
                        <h3 className="font-bold text-xl">Office</h3>
                        <p>Modern productivity-boosting interiors.</p>
                    </div>
                </div>
            </section>

            <CoverageMap />
        </div>
    );
};

export default Home;