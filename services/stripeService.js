const orderService = require('../services/orderService');


// Include stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function createLineItems(orderItems) {

    // line item is an array of object.
    // each object is representing one item the user wants to buy (aka one line item)
    // the keys of the line item object are predefined by Stripe
    const lineItems = orderItems.map(item => {

        // Ensure donationAmount is a valid number
        const donationAmount = Number(item.donation_amount);
        if (isNaN(donationAmount)) {
            throw new Error(`Invalid donation amount: ${item.donationAmount}`);
        }

        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.campaign_title,
                    metadata: {
                        campaign_id: item.campaign_id,
                        donation_amount: donationAmount
                    }
                },
                unit_amount: Math.round(donationAmount * 100) // Convert donation amount to cents for Stripe
            },
            quantity: 1 // Donations usually don't have a "quantity", but always set it to 1
        };
    });

    return lineItems;
}

async function createCheckoutSession(userId, orderItems, campaignId) {
    const lineItems = createLineItems(orderItems);

    // Create the order first and get its ID
    const orderId = await orderService.createOrder(userId, orderItems);
    console.log("Order created with ID:", orderId); // Log to verify the order ID


    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `http://localhost:5177/payment-success?orderId={CHECKOUT_SESSION_ID}`, // Corrected to use placeholder initially
        cancel_url: 'http://www.google.com',
        metadata: {
            campaign_id: campaignId,
            user_id: userId,
            order_id: orderId
        }
    });

    return session;
}


module.exports = {
    createCheckoutSession,
};
