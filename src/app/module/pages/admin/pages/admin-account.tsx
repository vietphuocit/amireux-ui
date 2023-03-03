import { Header, Navigation } from 'app/module/pages/admin/layouts';
import { MDBDataTable } from 'mdbreact';
import { useEffect, useState } from 'react';
import API from 'app/services/rest-client';

const checkAuth = () => {
  let check = 'mod';
  const userDetails = sessionStorage.getItem('userDetails');
  const authorities = JSON.parse(userDetails ? userDetails : '').authorities;
  authorities.forEach((item: any) => {
    if (item.authority === 'ROLE_ADMIN') {
      check = 'admin';
    }
  });
  if (check === 'mod') {
    document.location.pathname = '/admin/403';
  }
};

const AdminAccount = () => {
  if (sessionStorage.getItem('userDetails') === null) {
    window.location.pathname = '/admin/login';
  }
  checkAuth();
  const userDetails = sessionStorage.getItem('userDetails');
  const accessToken = 'Bearer ' + JSON.parse(userDetails ? userDetails : '').accessToken;

  const [header] = useState([
    {
      label: 'ID',
      field: 'id',
      sort: 'asc'
    },
    {
      label: 'Tên',
      field: 'name',
      sort: 'asc'
    },
    {
      label: 'Tài khoản',
      field: 'username',
      sort: 'asc'
    },
    {
      label: 'E-mail',
      field: 'email',
      sort: 'asc'
    },
    {
      label: 'Thao tác',
      field: 'action',
      sort: 'asc'
    }
  ]);
  const [dataTable, setDataTable] = useState<any>();
  const [account, setAccount] = useState<any[]>([]);

  const [name, setName] = useState<any>();
  const [username, setUsername] = useState<any>();
  const [email, setEmail] = useState<any>();
  const [password, setPassword] = useState<any>();

  useEffect(() => {
    const headers = {
      Authorization: accessToken,
      'Content-Type': 'application/json'
    };
    API.get('/rest/auth', { headers }).then((response: any) => {
      response.data.forEach((item: any) => {
        account.push({
          id: item.id,
          name: item.name,
          username: item.username,
          email: item.email,
          action: (
            <div className="btn-action">
              <button className="btn btn-danger">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          )
        });
        setAccount([...account]);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDataTable({ columns: header, rows: account });
  }, [account, header]);

  const onChangeName = (e: any) => {
    setName(e.target.value);
  };

  const onChangeEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const onChangeUsername = (e: any) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const createAccount = () => {
    const headers = {
      Authorization: accessToken,
      'Content-Type': 'application/json'
    };

    const formAccount = {
      name,
      email,
      username,
      password
    };

    API.post('/rest/auth/signup', formAccount, { headers }).then(response => {
      document.location.reload();
    });
  };

  return (
    <div>
      <Header></Header>
      <Navigation></Navigation>
      <div className="admin-content">
        <div id="admin-collection-page">
          <div className="admin-name-page">
            <p>Tài khoản</p>
            <div>
              <button className="admin__btn-add" type="button" data-toggle="modal" data-target="#modal-add-account">
                Thêm tài khoản<i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div>
            <MDBDataTable bordered data={dataTable}></MDBDataTable>
          </div>
          <div
            className="modal fade"
            id="modal-add-account"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content justify-content-center">
                <div className="modal-header">
                  <h3 className="modal-title " id="exampleModalLabel">
                    Thêm tài khoản
                  </h3>
                </div>
                <div className="modal-body model-add">
                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-4" htmlFor="">
                      Tên
                    </label>
                    <input className="col-md-8" type="text" name="name" id="" value={name} onChange={onChangeName} />
                  </div>
                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-4" htmlFor="">
                      Email
                    </label>
                    <input className="col-md-8" type="email" name="email" id="" value={email} onChange={onChangeEmail} />
                  </div>
                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-4" htmlFor="">
                      Tài khoản
                    </label>
                    <input className="col-md-8" type="text" name="username" id="" value={username} onChange={onChangeUsername} />
                  </div>
                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-4" htmlFor="">
                      Mật khẩu
                    </label>
                    <input className="col-md-8" type="text" name="password" id="" value={password} onChange={onChangePassword} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="model-btn btn btn-success" onClick={createAccount}>
                    Thêm
                  </button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">
                    Thoát
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminAccount };
