# Backend Stripe Integration Prompt

Copy and paste this into your backend Cursor window:

---

I need to implement Stripe payment integration for my e-commerce store. Here are the requirements:

## Environment Variables Needed
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## API Endpoints to Implement

### 1. Create Payment Intent
**Endpoint**: `POST /api/payments/create-payment-intent`

**Request Body**:
```json
{
  "orderId": "order_id_here",
  "amount": 5000
}
```

**Response**:
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

**Implementation**:
- Use Stripe to create a PaymentIntent with the provided amount (in cents)
- Store the PaymentIntent ID with the order for reference
- Return the client secret to the frontend

### 2. Update Order Schema
The order schema should include:
- `paymentIntentId` field to track Stripe payment
- `paymentStatus` field (pending, paid, failed)
- `shippingAddress` object with all shipping fields
- `orderItems` array with product details

### 3. Webhook Handler (Optional but Recommended)
**Endpoint**: `POST /api/payments/webhook`

**Purpose**: Handle Stripe webhooks to update order status when payment succeeds/fails

**Events to handle**:
- `payment_intent.succeeded` - Update order status to paid
- `payment_intent.payment_failed` - Update order status to failed

## Dependencies to Install
```bash
npm install stripe
```

## Key Implementation Points
1. **Amount Handling**: Frontend sends amount in cents (e.g., $50.00 = 5000)
2. **Error Handling**: Proper error responses for failed payments
3. **Order Updates**: Update order status when payment completes
4. **Security**: Validate webhook signatures from Stripe
5. **Test Mode**: Use Stripe test keys for development

## Example Payment Intent Creation
```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: amount, // in cents
  currency: 'usd',
  metadata: {
    orderId: orderId
  }
});
```

## Frontend Integration
The frontend will:
1. Create order with shipping details
2. Call create-payment-intent endpoint
3. Use returned client secret with Stripe Elements
4. Send payment success/failure to complete page

Please implement these endpoints with proper error handling, validation, and security measures.
