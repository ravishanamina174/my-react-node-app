# Stripe Payment Integration Setup

## Frontend Environment Variables

Create a `.env` file in your project root with:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_BASE_URL=http://localhost:8000
```

## Backend Environment Variables

In your backend, you'll need these environment variables:

```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Test Card Numbers

Use these test card numbers for testing:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

## Backend API Endpoints Required

Your backend needs these endpoints:

1. `POST /api/payments/create-payment-intent` - Creates a Stripe PaymentIntent
2. `POST /api/orders` - Creates an order (already exists)
3. `GET /api/payments/session-status` - Gets payment session status (optional)

## Flow Overview

1. User fills shipping address → Order created
2. User redirected to payment page → PaymentIntent created
3. User enters card details → Payment processed
4. On success → Redirected to complete page with order details
5. Cart cleared and localStorage cleaned up
