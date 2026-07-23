const token = process.env.MELHORENVIO_TOKEN;
const url = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';
console.log('Token exists:', !!token);
fetch(url, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'User-Agent': 'Aplicacao (contato@example.com)'
  },
  body: JSON.stringify({
    from: { postal_code: "01001000" },
    to: { postal_code: "01001000" },
    products: [{ id: "1", weight: 0.5, width: 15, height: 15, length: 15, insurance_value: 50, quantity: 1 }]
  })
}).then(res => res.json().then(data => ({status: res.status, data}))).then(console.log).catch(console.error);
