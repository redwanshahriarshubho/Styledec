import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="hero min-h-[80vh] bg-base-200 overflow-hidden">
            <div className="hero-content flex-col lg:flex-row-reverse gap-10">
                <motion.img 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop" 
                    className="max-w-md rounded-3xl shadow-2xl border-4 border-accent" 
                />
                <div className="max-w-xl text-center lg:text-left">
                    <motion.h1 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl font-black leading-tight"
                    >
                        Smart Spaces, <br />
                        <span className="text-accent">Grand Ceremonies.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="py-6 text-xl text-gray-600"
                    >
                        StyleDecor transforms your vision into reality with AI-integrated smart home solutions and breathtaking event designs.
                    </motion.p>
                    <Link to="/services">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-primary btn-lg rounded-full px-10 shadow-lg"
                        >
                            Book Decoration Service
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;