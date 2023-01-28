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

    //DOM.formAddEdit.addEventListener('submit', onSubmitAddEdit);
    //DOM.buttonAdd.addEventListener('click', onClickAdd);
    DOM.buttonConfirmDelete.addEventListener('click', onClickConfirmDelete);
  }


  // === EVENTHANDLER =====
  const onClickDelete = (e) => {
    const btnEl = e.currentTarget;
    const id = btnEl.dataset.id;
    console.log('delete: ', id);

    showModalDelete(id);
  };

  const onClickConfirmDelete = (e) => {
    const btnEl = e.currentTarget;
    const id = btnEl.dataset.id;

    // async
    deleteProductByCode(id).then((data) => {
      if (data.success) {
        bsModalDelete.hide();
        getProducts().then((data) => createRows(data));
      }
    });
  };


  // === XHR/FETCH ========
  const getProducts = () => {
    return new Promise((resolve, reject) => {
      fetch('/getProducts')
        .then((resp) => {
          console.log(resp);
          return resp.json();
        })
        .then((data) => resolve(data))
        .catch((err) => console.error(err));
    });
  };


  const addProduct = (product) => {
    return new Promise((resolve, reject) => {
      fetch('api/products', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(product),
      })
        .then((resp) => {
          console.log(resp);
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
      const { id, productname, description, quantity, price, stockwarn = false } = product;

      const trEl = DOM.templateRow.content.cloneNode(true);

      const cbStockWarnEl = trEl.querySelector('.td-stockwarn input[type="checkbox"]');
      const labelStockWarnEl = cbStockWarnEl.nextElementSibling;
      const buttonEditEl = trEl.querySelector('.button-edit');
      const buttonDeleteEl = trEl.querySelector('.button-delete');

      trEl.querySelector('.td-id').textContent = id;
      trEl.querySelector('.td-productname').textContent = description;
      trEl.querySelector('.td-description').textContent = productname;
      trEl.querySelector('.td-quantity').textContent = quantity;
      trEl.querySelector('.span-price').textContent = Number(price).toFixed(2);

      cbStockWarnEl.id = `cb-product-${id}`;
      labelStockWarnEl.htmlFor = `cb-product-${id}`;
      cbStockWarnEl.checked = stockwarn;

      buttonEditEl.dataset.id = id;
      //buttonEditEl.addEventListener('click', onClickEdit);

      buttonDeleteEl.dataset.id = id;
      buttonDeleteEl.addEventListener('click', onClickDelete);

      DOM.tBody.appendChild(trEl);
    });
  };


  const showModalAddEdit = (label = '', method = 'post') => {
    DOM.inputCode.disabled = method === 'post' ? false : true;
    if (method === 'post') DOM.formAddEdit.reset();

    DOM.spanLabels.forEach((spanEl) => {
      spanEl.textContent = label;
    });
    DOM.formAddEdit.dataset.method = method;
  };


  const showModalDelete = (id) => {
    DOM.strongId.textContent = id;
    DOM.buttonConfirmDelete.dataset.id = id;
  };


  const fillFormFields = (product) => {
    const { code, tagline, shortdesc, quantity, price } = product;

    DOM.inputCode.value = code;
    DOM.inputTagline.value = tagline;
    DOM.textareaDescription.value = shortdesc;
    DOM.inputQuantity.value = quantity;
    DOM.inputPrice.value = price;
  };


  init();

})();