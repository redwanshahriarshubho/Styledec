import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ price, bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        axios.post("http://localhost:5000/create-payment-intent", { price })
            .then(res => setClientSecret(res.data.clientSecret));
    }, [price]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });

        if (!error) {
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: card }
            });

            if (paymentIntent.status === "succeeded") {
                // Update DB to mark as paid
                await axios.patch(`http://localhost:5000/bookings/pay/${bookingId}`, { transactionId: paymentIntent.id });
                alert("Payment Successful!");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
            <CardElement className="p-4 border rounded-md mb-4" />
            <button className="btn btn-primary w-full" type="submit" disabled={!stripe || !clientSecret}>
                Pay ৳{price}
            </button>
        </form>
    );
};

const Payment = () => {
    // In a real app, fetch booking info from URL ID
    const price = 5000; 
    return (
        <div className="p-10 text-center">
            <h2 className="text-3xl font-bold mb-10">Complete Your Payment</h2>
            <Elements stripe={stripePromise}>
                <CheckoutForm price={price} bookingId="example_id" />
            </Elements>
        </div>
    );
};

export default Payment;