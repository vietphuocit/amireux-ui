import React from 'react';
import ReactDOM from 'react-dom';
import 'app/static/styles/index.css';
import { Routes } from 'app/router';
import { BrowserView, MobileView } from 'react-device-detect';

ReactDOM.render(
  <React.StrictMode>
    <BrowserView>
      <Routes />
    </BrowserView>

    <MobileView>
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <h3>
          Chúng tôi chưa phát triển tính năng cho điện thoại!
          <br />
          Mong các bạn thông cảm.
        </h3>
      </div>
    </MobileView>
  </React.StrictMode>,
  document.getElementById('root')
);
