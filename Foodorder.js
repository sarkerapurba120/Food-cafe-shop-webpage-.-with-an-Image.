
async function placeOrder(userId, restaurantId, items) {
  // Validate user
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  // Create order
  const order = new Order({
    user: userId,
    restaurant: restaurantId,
    items: items,
    status: 'pending',
    createdAt: new Date()
  });
  
  // Process payment
  const paymentResult = await processPayment(user, order.total);
  if (!paymentResult.success) {
    order.status = 'payment_failed';
    await order.save();
    throw new Error('Payment failed');
  }
  
  // Notify restaurant
  await notifyRestaurant(restaurantId, order._id);
  
  return order;
}