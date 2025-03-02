const orderService = require('../services/orderService');


// Include stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


function createLineItems(orderItems) {
    // line item is an array of object.
    // each object is representing one item the user wants to buy (aka one line item)
    // the keys of the line item object are predefined by Stripe
    const lineItems = orderItems.map(item => {

        // Ensure donationAmount is a valid number
        const donationAmount = Number(item.donationAmount);
        if (isNaN(donationAmount)) {
            throw new Error(`Invalid donation amount: ${item.donationAmount}`);
        }

        return {
            price_data: {
                currency: "usd",
                unit_amount: donationAmount * 100,
                product_data: {
                    name: item.campaignTitle,
                    metadata: {
                        campaign_id: item.campaignId,
                        donation_amount: donationAmount,
                    }
                }
            },
            quantity: 1
        };



    });

    return lineItems;
}

async function createCheckoutSession(userId, orderItems, campaignId, orderId) {
    const lineItems = createLineItems(orderItems);

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `http://localhost:5174/payment-success?session_id={CHECKOUT_SESSION_ID}`,
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
