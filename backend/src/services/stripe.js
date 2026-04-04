const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { pool } = require('../config/db');

class StripeService {
  static async createCheckoutSession(userId, email, plan) {
    const priceId = plan === 'monthly' 
      ? process.env.STRIPE_PRICE_MONTHLY 
      : process.env.STRIPE_PRICE_YEARLY;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://vpn.cephasgm.com/dashboard.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://vpn.cephasgm.com/subscription.html',
      customer_email: email,
      metadata: { userId: userId.toString() }
    });
    return { sessionId: session.id, url: session.url };
  }

  static async handleWebhook(event) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  static async handleCheckoutCompleted(session) {
    const userId = parseInt(session.metadata.userId);
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const planName = subscription.items.data[0].price.nickname || 
                     (subscription.items.data[0].price.recurring.interval === 'month' ? 'monthly' : 'yearly');
    await pool.query(
      `UPDATE users SET 
        stripe_customer_id = $1,
        subscription_status = 'active',
        subscription_plan = $2,
        subscription_end_date = to_timestamp($3)
       WHERE id = $4`,
      [session.customer, planName, subscription.current_period_end, userId]
    );
    await pool.query(
      `INSERT INTO subscriptions (user_id, stripe_subscription_id, plan, status, current_period_end)
       VALUES ($1, $2, $3, 'active', to_timestamp($4))`,
      [userId, subscription.id, planName, subscription.current_period_end]
    );
  }

  static async handleSubscriptionDeleted(subscription) {
    await pool.query(
      `UPDATE users SET subscription_status = 'canceled' 
       WHERE stripe_customer_id = $1`,
      [subscription.customer]
    );
  }
}

module.exports = StripeService;
