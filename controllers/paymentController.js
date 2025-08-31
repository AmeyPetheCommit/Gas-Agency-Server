const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createStripeSession = async (req, res) => {
  const { name, email, price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: 'Gas Cylinder Booking' },
            unit_amount: price * 100, // ₹1 = 100 paise
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/payment-success',
      cancel_url: 'http://localhost:3000/booking',
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
};
