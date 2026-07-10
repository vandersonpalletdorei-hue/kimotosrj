import { MercadoPagoConfig, Preference } from 'mercadopago';

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-6893868456418369-070214-cc2452bad2ce9cb90604671246ac8a7f-3281350303';
const client = new MercadoPagoConfig({ accessToken });
const preference = new Preference(client);

preference.create({
  body: {
    items: [{ id: "1", title: "Test", quantity: 1, unit_price: 50, currency_id: 'BRL' }],
    back_urls: {
      success: "https://google.com/success",
      pending: "https://google.com/pending",
      failure: "https://google.com/failure"
    },
    auto_return: "approved"
  }
}).then(res => console.log('OK', res.init_point)).catch(err => console.error('ERR', err));
