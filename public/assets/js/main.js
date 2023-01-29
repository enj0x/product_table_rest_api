!'use strict';

(() => {

  // === DOM & VARS =======
  const DOM = {};
  DOM.module = document.querySelector('.m-table-products');
  DOM.tableProducts = DOM.module.querySelector('.table-products');
  DOM.tBody = DOM.tableProducts.querySelector('tbody');
  DOM.buttonAdd = DOM.module.querySelector('.button-add');
  DOM.templateRow = DOM.module.querySelector('template.row-product');
  DOM.modalAddEdit = DOM.module.querySelector('#modal-add-edit');
  DOM.formAddEdit = DOM.modalAddEdit.querySelector('.form-add-edit');
  DOM.inputId = DOM.modalAddEdit.querySelector('#input-id');
  DOM.inputProductname = DOM.modalAddEdit.querySelector('#input-productname');
  DOM.textareaDescription = DOM.modalAddEdit.querySelector('#textarea-description');
  DOM.inputQuantity = DOM.modalAddEdit.querySelector('#input-quantity');
  DOM.inputPrice = DOM.modalAddEdit.querySelector('#input-price');
  DOM.buttonAddEdit = DOM.modalAddEdit.querySelector('.button-add-edit');
  DOM.spanLabels = Array.from(DOM.modalAddEdit.querySelectorAll('.span-label'));
  DOM.modalDelete = DOM.module.querySelector('#modal-delete');
  DOM.strongId = DOM.modalDelete.querySelector('.strong-code');
  DOM.buttonConfirmDelete = DOM.modalDelete.querySelector('.button-confirm-delete');
  
  const bsModalAddEdit = new bootstrap.Modal(DOM.modalAddEdit, {
    backdrop: 'static',
  });
  const bsModalDelete = new bootstrap.Modal(DOM.modalDelete, {
    backdrop: 'static',
  });


  // === INIT =============
  const init = async () => {

    getProducts().then((data) => createRows(data));
    DOM.formAddEdit.addEventListener('submit', onSubmitAddEdit);
    DOM.buttonAdd.addEventListener('click', onClickAddProduct);
    DOM.buttonConfirmDelete.addEventListener('click', onClickConfirmDelete);
  }


  // === EVENTHANDLER =====
  const onClickAddProduct = (e) => {
    const btnEl = e.currentTarget;
    const label = btnEl.dataset.label;
    showModalAddEdit(label, 'post');
  };

  const onClickEdit = (e) => {
    const btnEl = e.currentTarget;
    const id = btnEl.dataset.id;
    const label = btnEl.dataset.label;
    getProductByCode(id).then((data) => {
      fillFormFields(data);
      showModalAddEdit(label, 'put');
    });
  };

  const onClickDelete = (e) => {
    const btnEl = e.currentTarget;
    const id = btnEl.dataset.id;
    showModalDelete(id);
  };

  const onClickConfirmDelete = (e) => {
    const btnEl = e.currentTarget;
    const id = btnEl.dataset.id;
    deleteProductByCode(id).then((data) => {
      if (data.success) {
        bsModalDelete.hide();
        getProducts().then((data) => createRows(data));
      }
    });
  };

  const onSubmitAddEdit = (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const method = formEl.dataset.method;
    const product = {
      id: cleanFieldText(DOM.inputId.value),
      productname: cleanFieldText(DOM.inputProductname.value),
      description: cleanFieldText(DOM.textareaDescription.value),
      quantity: Number(DOM.inputQuantity.value),
      price: Number(DOM.inputPrice.value),
    };
    if (method.toLowerCase() === 'post') {
      addProduct(product).then((data) => {
        if (data.success) {
          DOM.formAddEdit.reset();
          bsModalAddEdit.hide();
          getProducts().then((data) => createRows(data));
        }
      });
    } else {
      updateProductByCode(product).then((data) => {
        if (data.success) {
          DOM.formAddEdit.reset();
          bsModalAddEdit.hide();
          getProducts().then((data) => createRows(data));
        }
      });
    }
  }


  // === XHR/FETCH ========
  const getProducts = () => {
    return new Promise((resolve, reject) => {
      fetch('/product')
        .then((resp) => {
          console.log(resp);
          return resp.json();
        })
        .then((data) => resolve(data))
        .catch((err) => console.error(err));
    });
  };

  const getProductByCode = (id) => {
    return new Promise((resolve, reject) => {
      fetch(`product/${id}`)
        .then((resp) => {
          return resp.json();
        })
        .then((data) => resolve(data))
        .catch((err) => console.error(err));
    });
  };

  const addProduct = (product) => {
    return new Promise((resolve, reject) => {
      fetch('/product', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(product),
      })
        .then((resp) => {
          return resp.json();
        })
        .then((data) => resolve(data))
        .catch((err) => console.error(err));
    });
  };

  const updateProductByCode = (product) => {
    const id = product.id;
    return new Promise((resolve, reject) => {
      fetch(`/product/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(product),
      })
        .then((resp) => {
          return resp.json();
        })
        .then((data) => resolve(data))
        .catch((err) => console.error(err));
    });
  };

  const deleteProductByCode = (id) => {
    return new Promise((resolve, reject) => {
      fetch(`/product/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })
        .then((resp) => {
          return resp.json();
        })
        .then((data) => resolve(data))
        .catch((err) => console.error(err));
    });
  };


  // === FUNCTIONS ========
  const createRows = (products) => {
    DOM.tBody.textContent = '';
    products.forEach((product, idx) => {
      const { id, productname, description, quantity, price} = product;
      const trEl = DOM.templateRow.content.cloneNode(true);
      const buttonEditEl = trEl.querySelector('.button-edit');
      const buttonDeleteEl = trEl.querySelector('.button-delete');
      trEl.querySelector('.td-id').textContent = id;
      trEl.querySelector('.td-productname').textContent = productname;
      trEl.querySelector('.td-description').textContent = description;
      trEl.querySelector('.td-quantity').textContent = quantity;
      trEl.querySelector('.span-price').textContent = Number(price).toFixed(2);
      buttonEditEl.dataset.id = id;
      buttonEditEl.addEventListener('click', onClickEdit);
      buttonDeleteEl.dataset.id = id;
      buttonDeleteEl.addEventListener('click', onClickDelete);
      DOM.tBody.appendChild(trEl);
    });
  };

  const showModalAddEdit = (label = '', method = 'post') => {
    //DOM.inputCode.disabled = method === 'post' ? false : true;
    if (method === 'post') DOM.formAddEdit.reset();
    DOM.spanLabels.forEach((spanEl) => {
      spanEl.textContent = label;
    });
    DOM.formAddEdit.dataset.method = method;
  };

  const fillFormFields = (product) => {
    const { id, productname, description, quantity, price } = product[0];
    DOM.inputId.value = id;
    DOM.inputProductname.value = productname;
    DOM.textareaDescription.value = description;
    DOM.inputQuantity.value = quantity;
    DOM.inputPrice.value = price;
  };

  const showModalDelete = (id) => {
    DOM.strongId.textContent = id;
    DOM.buttonConfirmDelete.dataset.id = id;
  };

  const cleanFieldText = (text) => {
    return text.replaceAll(',', '\\,');
  };

  init();

})();