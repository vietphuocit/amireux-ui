import { Header, Navigation } from 'app/module/pages/admin/layouts';
import 'app/static/styles/admin/admin.css';

const Admin = () => {
  return (
    <div className="admin-page">
      <Header />
      <Navigation></Navigation>
    </div>
  );
};

export { Admin };
