// Include stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function createLineItems(orderItems) {
    console.log('Order Items:', orderItems);

    // line item is an array of object.
    // each object is representing one item the user wants to buy (aka one line item)
    // the keys of the line item object are predefined by Stripe
    const lineItems = orderItems.map(item => {
        // Log the donation amount for debugging purposes
        console.log(item.donation_amount);

        // Ensure donationAmount is a valid number
        const donationAmount = Number(item.donation_amount);
        if (isNaN(donationAmount)) {
            throw new Error(`Invalid donation amount: ${item.donationAmount}`);
        }

        return {
            price_data: {
                currency: 'myr', // Change to your preferred currency if necessary
                product_data: {
                    name: item.campaign_title, // Use the name of the campaign as the "product name"
                    description: `Donation for ${item.campaign_title}`, // Provide more context
                    images: [item.imageUrl || 'https://via.placeholder.com/150'], // Use a campaign image or a placeholder
                    metadata: {
                        campaign_id: item.campaignId // Store campaign-specific data
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
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `https://www.google.com`,
        cancel_url: `https://www.yahoo.com`,
        metadata: {
            userId: userId,
            campaignId: campaignId
        }
    });
    return session;
}

module.exports = {
    createCheckoutSession,
};
