import { Header, Navigation } from 'app/module/pages/admin/layouts';

const Forbidden = () => {
  return (
    <div>
      <Header></Header>
      <Navigation></Navigation>
      <div className="admin-content">
        <div id="admin-collection-page">
          <div className="admin-name-page">
            <p style={{ color: 'red' }}>403 - Forbidden</p>
          </div>
        </div>
        <div>
          <p>Bạn không có quyền truy cập vào trang này</p>
        </div>
      </div>
    </div>
  );
};

export { Forbidden };
