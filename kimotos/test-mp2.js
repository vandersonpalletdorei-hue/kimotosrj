const req = { get: () => undefined };
console.log(`${req.get('origin') || 'http://localhost:3000'}/checkout/success`);
