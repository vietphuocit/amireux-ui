import { Header, Navigation } from 'app/module/pages/admin/layouts';
import { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import API from 'app/services/rest-client';
import 'app/static/styles/admin/admin-product.css';

const AdminProduct = () => {
  if (sessionStorage.getItem('userDetails') === null) {
    window.location.pathname = '/admin/login';
  }
  const userDetails = sessionStorage.getItem('userDetails');
  const accessToken = 'Bearer ' + JSON.parse(userDetails ? userDetails : '').accessToken;

  const [header] = useState([
    {
      label: 'ID',
      field: 'id',
      sort: 'asc'
    },
    {
      label: 'Tên sản phẩm',
      field: 'name',
      sort: 'asc'
    },
    {
      label: 'Giá',
      field: 'price',
      sort: 'asc'
    },
    {
      label: 'Số lượng',
      field: 'quantity',
      sort: 'asc'
    },
    {
      label: 'Thao tác',
      field: 'action',
      sort: 'asc'
    }
  ]);
  const [dataTable, setDataTable] = useState<any>();
  const [products, setProducts] = useState<any[]>([]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState('');
  const [collection, setCollection] = useState(-1);
  const [collections, setCollections] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [imagesSelected, setImagesSelected] = useState<any[]>([]);
  const [specification, setSpecification] = useState('');
  const [specifications, setSpecifications] = useState<any[]>([]);
  const [id, setId] = useState<number>();

  const showFormEdit = (id: number) => {
    resetForm();
    setId(id);
    API.get('api/product/' + id).then((response: any) => {
      setName(response.data.name);
      setPrice(response.data.price);
      setQuantity(response.data.quantity);
      setDescription(response.data.description);
      setCollection(response.data.collectionId);

      response.data.specifications.forEach((item: any, index: number) => {
        specifications.push({ id: index, content: item.name, check: true });
      });
      setSpecifications([...specifications]);
    });
  };

  const onCheckedImage = (e: any) => {
    const idImage = e.target.id.split('image')[1];
    images.map(image => {
      if (image.id - idImage === 0) {
        images.splice(images.indexOf(image), 1);
        setImagesSelected([...imagesSelected, image]);
      }
      return null;
    });
  };

  const onUnCheckedImage = (e: any) => {
    const idImage = e.target.id.split('imageC')[1];
    imagesSelected.map(image => {
      if (image.id - idImage === 0) {
        imagesSelected.splice(imagesSelected.indexOf(image), 1);
        setImages([...images, image]);
      }
      return null;
    });
  };

  const onNameChange = (e: any) => {
    setName(e.target.value);
  };

  const onPriceChange = (e: any) => {
    setPrice(e.target.value);
  };

  const onQuantityChange = (e: any) => {
    setQuantity(e.target.value);
  };

  const onDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const onCollectionChange = (e: any) => {
    setCollection(e.target.value);
  };

  const onSpecificationChange = (e: any) => {
    setSpecification(e.target.value);
  };

  const onAddSpecificationClick = (e: any) => {
    setSpecifications([...specifications, { id: specifications.length, content: specification, check: true }]);
    setSpecification('');
  };

  const removeSpecification = (id: any) => {
    specifications[id].check = false;
    setSpecifications([...specifications]);
  };

  useEffect(() => {
    API.get('api/product/').then((response: any) => {
      response.data.forEach((item: any) => {
        products.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          action: (
            <div className="btn-action">
              <button
                className="btn btn-warning"
                id={'btn-edit-photo-' + item.id}
                type="button"
                data-toggle="modal"
                data-target="#modal-edit-product"
                onClick={() => showFormEdit(item.id)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button className="btn btn-danger" id={'btn-del-photo-' + item.id} onClick={() => delProduct(item.id)}>
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          )
        });
        setProducts([...products]);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    API.get('api/uploads/files?product=true').then((response: any) => {
      setImages(response.data);
    });
  }, []);

  useEffect(() => {
    API.get('api/collection/').then((response: any) => {
      setCollections(response.data);
    });
  }, []);

  useEffect(() => {
    setDataTable({ columns: header, rows: products });
  }, [products, header]);

  const insertProduct = () => {
    const specificationList: string[] = [];
    const imagesIdList: number[] = [];
    specifications.map(item => (item.check ? specificationList.push(item.content) : ''));
    imagesSelected.map(item => imagesIdList.push(item.id));
    const headers = {
      Authorization: accessToken,
      'Content-Type': 'application/json;'
    };
    const formProduct = {
      name,
      price,
      description,
      collectionId: collection,
      quantity,
      imagesId: imagesIdList,
      specifications: specificationList
    };
    API.post('api/product/', formProduct, { headers }).then((response: any) => {
      document.location.reload();
    });
  };

  const editProduct = () => {
    const headers = {
      Authorization: accessToken,
      'Content-Type': 'application/json'
    };
    const specificationList: string[] = [];
    specifications.map(item => (item.check ? specificationList.push(item.content) : ''));
    const formProduct = {
      name,
      price,
      description,
      collectionId: collection,
      quantity,
      specifications: specificationList
    };
    API.put('api/product/' + id, formProduct, { headers }).then(response => {
      document.location.reload();
    });
  };

  const delProduct = (id: number) => {
    const headers = {
      Authorization: accessToken,
      'Content-Type': 'application/json;'
    };
    API.delete('api/product/' + id, { headers }).then(response => {
      document.location.reload();
    });
  };

  const resetForm = () => {
    setName('');
    setPrice(0);
    setQuantity(0);
    setDescription('');
    let length = specifications.length;
    for (let index = 0; index < length; index++) {
      specifications.pop();
    }
    setSpecifications([...specifications]);
  };

  return (
    <div>
      <Header></Header>
      <Navigation></Navigation>
      <div className="admin-content">
        <div id="admin-collection-page">
          <div className="admin-name-page">
            <p>Sản phẩm</p>
            <div>
              <button className="admin__btn-add" type="button" data-toggle="modal" data-target="#modal-add-product" onClick={resetForm}>
                Thêm sản phẩm<i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div>
            <MDBDataTable bordered data={dataTable}></MDBDataTable>
          </div>

          <div
            className="modal fade"
            id="modal-add-product"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            style={{ overflowY: 'hidden' }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header justify-content-center">
                  <h3 className="modal-title " id="exampleModalLabel">
                    Thêm sản phẩm
                  </h3>
                </div>
                <div className="modal-body model-add">
                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Tên
                    </label>
                    <input className="col-md-10" type="text" name="name" id="" onChange={onNameChange} value={name} />
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Giá
                    </label>
                    <input className="col-md-10" type="number" name="price" id="" onChange={onPriceChange} value={price} />
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Số lượng
                    </label>
                    <input className="col-md-10" type="number" name="quantity" id="" onChange={onQuantityChange} value={quantity} />
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Mô tả
                    </label>
                    <textarea className="model-textarea" name="description" id="" onChange={onDescriptionChange} value={description} />
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Danh mục
                    </label>
                    <select className="col-md-10" name="collections" id="" onChange={onCollectionChange} defaultValue={collection}>
                      <option key={-1} value={-1}>
                        Chọn danh mục
                      </option>
                      {collections.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row px-2 mx-2 pt-2 mt-2 align-items-center justify-content-between" style={{ paddingBottom: '0px' }}>
                    <label className="col-md-2" htmlFor="">
                      Ảnh
                    </label>
                  </div>

                  <div className="row px-2 mx-2 pb-2 mb-2 align-items-center ">
                    <div id="product-photo">
                      <div>
                        <h5>Hình ảnh có sẵn</h5>
                        <ul>
                          {images.map(image => (
                            <li key={image.id}>
                              <button className="btn btn-success" id={'image' + image.id} onClick={onCheckedImage}>
                                Chọn
                              </button>
                              <div>{image.name}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5>Hình ảnh đã chọn</h5>
                        <ul>
                          {imagesSelected.map(image => (
                            <li key={image.id}>
                              <button className="btn btn-danger" id={'imageC' + image.id} onClick={onUnCheckedImage}>
                                Bỏ Chọn
                              </button>
                              <div>{image.name}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2">Chi tiết</label>
                    <input className="col-md-8" type="text" onChange={onSpecificationChange} value={specification} />
                    <button className="btn btn-primary col-md-2" onClick={onAddSpecificationClick} disabled={!specification}>
                      Thêm
                    </button>
                  </div>

                  <div className="modal-footer">
                    <button className="model-btn btn btn-success" onClick={insertProduct}>
                      Thêm
                    </button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">
                      Thoát
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-dialog" style={{ position: 'relative', top: '-400px', right: '-500px' }} role="document">
              <div className="modal-content">
                <div className="modal-header justify-content-center">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Danh sách chi tiết
                  </h5>
                </div>
                <div className="modal-body" style={{ minHeight: '325px' }}>
                  <ul className="list-group" style={{ maxHeight: '299px', overflowY: 'auto' }}>
                    {specifications.map((item: any) => {
                      if (item.check) {
                        return (
                          <li key={item.id} className="list-group-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ width: '80%', lineHeight: '36px', margin: '0' }}>{item.content}</p>
                            <button
                              className="btn btn-danger"
                              style={{ width: '36px', height: '36px' }}
                              onClick={() => removeSpecification(item.id)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </li>
                        );
                      } else {
                        return <></>;
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="modal-edit-product"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            style={{ overflowY: 'hidden' }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header justify-content-center">
                  <h3 className="modal-title " id="exampleModalLabel">
                    Sửa sản phẩm
                  </h3>
                </div>
                <div className="modal-body model-add">
                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Tên
                    </label>
                    <input className="col-md-10" type="text" name="name" id="" onChange={onNameChange} value={name} />
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Giá
                    </label>
                    <input className="col-md-10" type="number" name="price" id="" onChange={onPriceChange} value={price} />
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Số lượng
                    </label>
                    <input className="col-md-10" type="number" name="quantity" id="" onChange={onQuantityChange} value={quantity} />
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Mô tả
                    </label>
                    <textarea className="model-textarea" name="description" id="" onChange={onDescriptionChange} value={description} />
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2" htmlFor="">
                      Danh mục
                    </label>
                    <select className="col-md-10" name="collections" id="" onChange={onCollectionChange} defaultValue={collection}>
                      <option key={-1} value={-1}>
                        Chọn danh mục
                      </option>
                      {collections.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row p-2 m-2 align-items-center justify-content-between">
                    <label className="col-md-2">Chi tiết</label>
                    <input className="col-md-8" type="text" onChange={onSpecificationChange} value={specification} />
                    <button className="btn btn-primary col-md-2" onClick={onAddSpecificationClick} disabled={!specification}>
                      Thêm
                    </button>
                  </div>

                  <div className="modal-footer">
                    <button className="model-btn btn btn-success" onClick={editProduct}>
                      Sửa
                    </button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">
                      Thoát
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-dialog" style={{ position: 'relative', top: '-400px', right: '-500px' }} role="document">
              <div className="modal-content">
                <div className="modal-header justify-content-center">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Danh sách chi tiết
                  </h5>
                </div>
                <div className="modal-body" style={{ minHeight: '325px' }}>
                  <ul className="list-group" style={{ maxHeight: '299px', overflowY: 'auto' }}>
                    {specifications.map((item: any) => {
                      if (item.check) {
                        return (
                          <li key={item.id} className="list-group-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ width: '80%', lineHeight: '36px', margin: '0' }}>{item.content}</p>
                            <button
                              className="btn btn-danger"
                              style={{ width: '36px', height: '36px' }}
                              onClick={() => removeSpecification(item.id)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </li>
                        );
                      } else {
                        return <></>;
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminProduct };
