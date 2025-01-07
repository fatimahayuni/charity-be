// Include stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function createLineItems(donationItems) {
    // line item is an array of object.
    // each object is representing one item the user wants to buy (aka one line item)
    // they keys of the line item object is predefined by Stripe
    const lineItems = donationItems.map(item => ({
        price_data: {
            currency: 'usd', // Change to your preferred currency if necessary
            product_data: {
                name: item.campaignName, // Use the name of the campaign as the "product name"
                description: `Donation for ${item.campaignName}`, // Provide more context
                images: [item.campaignImage || 'https://via.placeholder.com/150'], // Use a campaign image or a placeholder
                metadata: {
                    campaign_id: item.campaignId // Store campaign-specific data
                }
            },
            // Convert donation amount to cents for Stripe
            unit_amount: Math.round(item.donationAmount * 100)
        },
        quantity: 1 // Donations usually don't have a "quantity" but always set it to 1
    }));

    return lineItems;
}


async function createCheckoutSession(userId, orderItems, campaignId) {
    const lineItems = createLineItems(donationItems);
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