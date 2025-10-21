import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        // 1️⃣ Create PaymentIntent on server
        const res = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 1000 }), // $10
        });
        const data = await res.json();

        // 2️⃣ Confirm Card Payment
        const result = await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (result.error) {
            setMessage(result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
            setMessage("Payment Successful!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <CardElement />
            <button
                type="submit"
                disabled={!stripe}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Pay
            </button>
            {message && <p>{message}</p>}
        </form>
    );
}
