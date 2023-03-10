import 'app/static/styles/pay.css';
import { useEffect, useState } from 'react';
import API from 'app/services/rest-client';

const getCart = () => {
  let cart = localStorage.getItem('cart');
  if (cart) {
    return (cart = JSON.parse(cart));
  } else {
    return [];
  }
};

const Pay = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cart, setCart] = useState<any[]>(getCart);
  const [cartChecked, setCartChecked] = useState<any[]>([]);
  const [sumMoney, setSumMoney] = useState(0);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let sum = 0;
    cartChecked.forEach(item => {
      sum += item.productInCart.product.price * item.productInCart.qty;
    });
    setSumMoney(sum);
  }, [cartChecked]);

  const onNameChange = (e: any) => {
    setName(e.target.value);
  };

  const onEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const onPhoneChange = (e: any) => {
    setPhone(e.target.value);
  };

  const onAddressChange = (e: any) => {
    setAddress(e.target.value);
  };

  const onClickPaymentMethods = (e: any) => {
    const content_atm = document.getElementById('content-atm');
    const content_vdt = document.getElementById('content-vdt');
    if (e.target.id === 'payment-method-cod') {
      if (content_atm && content_vdt) {
        content_atm.style.display = 'none';
        content_vdt.style.display = 'none';
      }
    } else if (e.target.id === 'payment-method-atm') {
      if (content_atm && content_vdt) {
        content_atm.style.display = 'block';
        content_vdt.style.display = 'none';
      }
    } else if (e.target.id === 'payment-method-vdt') {
      if (content_atm && content_vdt) {
        content_atm.style.display = 'none';
        content_vdt.style.display = 'block';
      }
    }
  };

  const onClickCheckedProduct = (e: any) => {
    const idElement: string = e.target.id;
    const posProduct = idElement.substr(8);
    if (e.target.checked) {
      setCartChecked([...cartChecked, cart[+posProduct]]);
    } else {
      cartChecked.splice(cart[+posProduct], 1);
      setCartChecked([...cartChecked]);
    }
  };

  const onClickComplete = () => {
    if (cartChecked.length === 0) {
      return;
    }
    const elementRadioChecked = document.querySelector('input[name="payment-method"]:checked');
    if (elementRadioChecked) {
      const idElement: string = elementRadioChecked.id;
      const paymentMethod = idElement.substr(15).toUpperCase();
      const listProduct: any[] = [];

      cartChecked.forEach(item => {
        listProduct.push({
          id: item.productInCart.product.id,
          color: item.productInCart.color,
          size: item.productInCart.size,
          qty: item.productInCart.qty
        });
      });

      const dataBill = {
        name,
        email,
        phone,
        address,
        paymentMethod,
        listProduct
      };

      const headers = {
        'Content-Type': 'application/json;'
      };

      API.post('api/bill', dataBill, { headers }).then((response: any) => {
        cartChecked.forEach(item => {
          console.log(cart);
          cart.splice(item, 1);
          setCart([...cart]);
        });
        document.location.href = '/pay-success';
      });
    }
  };

  return (
    <div id="pay">
      <div className="pay-content">
        <div className="pay-wrap">
          <form className="form-info">
            <h1>AMIREUX</h1>

            <h3>Th??ng tin kh??ch h??ng</h3>
            <input type="text" placeholder="T??n c???a b???n" required onChange={onNameChange} value={name} />
            <div>
              <input type="email" placeholder="Email (kh??ng b???t bu???c)" onChange={onEmailChange} value={email} />
              <input type="tel" pattern="(\+84|0)\d{9,10}" placeholder="S??? ??i???n tho???i" required onChange={onPhoneChange} value={phone} />
            </div>
            <input type="text" placeholder="?????a ch??? nh???n h??ng" required onChange={onAddressChange} value={address} />

            <h3>Th??ng tin v???n chuy???n</h3>
            <p>V???n chuy???n trong 3 - 7 ng??y. (Mi???n ph?? ship)</p>

            <h3>Ph????ng th???c thanh to??n</h3>
            <div id="payment-methods">
              <div>
                <label htmlFor="payment-method-cod">
                  <input type="radio" name="payment-method" id="payment-method-cod" onClick={onClickPaymentMethods} />
                  Thanh to??n ti???n m???t khi nh???n h??ng.
                </label>
              </div>
              <div>
                <label htmlFor="payment-method-atm">
                  <input type="radio" name="payment-method" id="payment-method-atm" onClick={onClickPaymentMethods} required />
                  Chuy???n kho???n ng??n h??ng.
                  <div id="content-atm" style={{ display: 'none' }}>
                    <p>
                      Quy?? kha??ch vui lo??ng chuy????n ti????n va??o:
                      <br />
                      <br />
                      Ng??n h??ng: Agribank ??? Chi nha??nh Tam K???
                      <br />
                      S??? t??i kho???n: 0123456789
                      <br />
                      Ch??? t??i kho???n: Tr???n Vi???t Ph?????c
                      <br />
                      N????i dung chuy????n khoa??n: S????-??i????n-thoa??i-cu??a-ba??n
                      <br />
                      <br />
                      Sau ??o??, b????m nu??t 'Hoa??n t????t' phi??a d??????i.
                    </p>
                  </div>
                </label>
              </div>
              <div>
                <label htmlFor="payment-method-vdt">
                  <input type="radio" name="payment-method" id="payment-method-vdt" onClick={onClickPaymentMethods} />
                  Chuy???n kho???n v?? ??i???n t???.
                  <div id="content-vdt" style={{ display: 'none' }}>
                    <p>
                      Quy?? kha??ch vui lo??ng chuy????n ti????n va??o:
                      <br />
                      <br />
                      Momo: 0583217667
                      <br />
                      Ch??? t??i kho???n: Tr???n Vi???t Ph?????c
                      <br />
                      N????i dung chuy????n khoa??n: S????-??i????n-thoa??i-cu??a-ba??n
                      <br />
                      <br />
                      Sau ??o??, b????m nu??t 'Hoa??n t????t' phi??a d??????i.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <a href="/cart">Gi??? h??ng</a>
              <button onClick={onClickComplete}>Ho??n t???t</button>
            </div>
          </form>
          <div className="form-cart">
            <div>
              {cart.map((item: any, index) => {
                return (
                  <label key={index} id={'js-item-' + index} className="item" htmlFor={'product-' + index}>
                    <label className="container-checkbox">
                      <input id={'product-' + index} type="checkbox" onChange={onClickCheckedProduct} />
                      <span className="checkmark"></span>
                    </label>
                    <img src={'http://localhost:8080/api/uploads/files/' + item.productInCart.product.images[0].id} alt="" />
                    <div>
                      <h3>{item.productInCart.product.name}</h3>
                      <p>M??u s???c: {item.productInCart.color}</p>
                      <p>K??ch c???: {item.productInCart.size}</p>
                      <p>S??? l?????ng: {item.productInCart.qty}</p>
                    </div>
                    <div>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        item.productInCart.product.price * item.productInCart.qty
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            <div id="voucher">
              <input type="text" name="" id="" placeholder="Voucher" />
              <button>S??? d???ng</button>
            </div>
            <div id="sum-money">
              <h2>T???ng ti???n</h2>
              <h3>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumMoney)}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Pay };
