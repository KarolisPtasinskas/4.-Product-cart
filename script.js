updateHtmlTable();
createFilterList();

document.getElementById('submit-btn').addEventListener('click', addNewProduct);
document.getElementById('edit-btn').addEventListener('click', saveEditedProduct);
document.getElementById('filter-btn').addEventListener('click', filterProducts);


//Perkraunam visą lentelę. Puslapio starte, sukūrus naują produktą, ištrynus produktą ir pakoregavus roduktą.

function updateHtmlTable(filteredProducts) {
    let HTML = '';
    let productsList = JSON.parse(localStorage.getItem('products'));
    if (productsList === null) {
        localStorage.setItem( 'products', JSON.stringify([]) );
        localStorage.setItem( 'id', '0' );
        return;
    }
    if (filteredProducts) {
        for (let i = 0; i < filteredProducts.length; i++) {
            const product = filteredProducts[i];
            
            let tableRow = `<tr>
                                <td>${product.name}</td>
                                <td>${product.amount}</td>
                                <td>${product.category}</td>
                                <td>
                                    <div class="check btn btn-success" id="check-${product.id}">Check</div>
                                    <div class="edit btn btn-warning" id="edit-${product.id}">Edit</div>
                                    <div class="delete btn btn-danger" id="delete-${product.id}">Delete</div>
                                </td>
                            </tr>`;
    
            HTML += tableRow;
        } 
    } else {
        for (let i = 0; i < productsList.length; i++) {
            const product = productsList[i];
            
            let tableRow = `<tr>
                                <td>${product.name}</td>
                                <td>${product.amount}</td>
                                <td>${product.category}</td>
                                <td>
                                    <div class="check btn btn-success" id="check-${product.id}">Check</div>
                                    <div class="edit btn btn-warning" id="edit-${product.id}">Edit</div>
                                    <div class="delete btn btn-danger" id="delete-${product.id}">Delete</div>
                                </td>
                            </tr>`;
    
            HTML += tableRow;
        }
    }

    document.getElementById("product-table").innerHTML = HTML;
    activateDeleteBtns();
    activateEditBtns();
    activateCheckBtns();
}

//Pridedam naują produktą

function addNewProduct() {
    if (isFieldEmpty(`product-name`)) {
        return;
    }

    let productsList = JSON.parse( localStorage.getItem('products') );
    let productName = document.getElementById('product-name').value;
    let amountNumber = document.getElementById('amount-number').value;
    let categoryName = document.getElementById('category-name').value;

    let product = {
        id: parseInt(localStorage.getItem('id')) + 1,
        name: productName,
        amount: amountNumber,
        category: categoryName
    }

    productsList.push(product);

    localStorage.setItem('id', product.id);
    localStorage.setItem('products', JSON.stringify(productsList));

    clearForm();
    updateHtmlTable();
    
    document.getElementById('product-name').focus();

}

function clearForm() {
    document.getElementById("product-name").value = '';
    document.getElementById("amount-number").value = '';
    document.getElementById('category-name').value = `placeholder`;
}

//Ištriname "delete" produktus

function activateDeleteBtns() {
    let deleteBtns = document.getElementsByClassName('delete');

    for (let i = 0; i < deleteBtns.length; i++) {
        let btn = deleteBtns[i];
        btn.addEventListener('click',function(){
            deleteProduct(btn.id);
        });
    }
}

function deleteProduct(id) {
    let productsList = JSON.parse(localStorage.getItem('products'));

    for (let i = 0; i < productsList.length; i++) { 
        if( `delete-${productsList[i].id}` == id){
            productsList.splice(i,1);
            break;
        }
    }
    localStorage.setItem('products', JSON.stringify(productsList));
    updateHtmlTable();
}

//Redaguojame "edit" produktus

function activateEditBtns() {
    let editBtns = document.getElementsByClassName('edit');

    for (let i = 0; i < editBtns.length; i++) {
        let btn = editBtns[i];
        btn.addEventListener('click',function(){
            editProduct(btn.id);
        });
    }
}

function editProduct(id) {
    let productsList = JSON.parse(localStorage.getItem('products'));
    for (let i = 0; i < productsList.length; i++) { 
        if( `edit-${productsList[i].id}` == id){
            productEditMode(productsList[i]);
        }
    }
}

function productEditMode(product) {
    document.getElementById('product-name').value = product.name;
    document.getElementById('amount-number').value = product.amount;
    document.getElementById('category-name').value = product.category;

    document.getElementById('product-id').value = product.id;

    document.getElementById("edit-btn").style = '';
    document.getElementById("submit-btn").style = "display: none";
}

function saveEditedProduct() {
    let productsList = JSON.parse(localStorage.getItem('products'));
    let product = {
        id: ``,
        name: ``,
        amount: ``,
        category: ``
    }

    product.id = document.getElementById('product-id').value;
    product.name = document.getElementById('product-name').value;
    product.amount = document.getElementById('amount-number').value;
    product.category = document.getElementById('category-name').value;

    for (let i = 0; i < productsList.length; i++) {
        const productFromStorage = productsList[i];
        if (productFromStorage.id == product.id) {
            productsList[i] = product;
            break;
        }
    }

    localStorage.setItem('products', JSON.stringify(productsList));

    updateHtmlTable();
    clearForm();

    document.getElementById("edit-btn").style = `display: none`;
    document.getElementById("submit-btn").style = ``;
}

//Check product

function activateCheckBtns() {
    let checkBtns = document.getElementsByClassName('check');

    for (let i = 0; i < checkBtns.length; i++) {
        let btn = checkBtns[i];
        btn.addEventListener('click',function(){
            checkProduct(btn.id);
        });
    }
}

function checkProduct(id) {
    let productsList = JSON.parse(localStorage.getItem('products'));
    for (let i = 0; i < productsList.length; i++) { 
        if( `check-${productsList[i].id}` == id){
            let btnId = `check-${productsList[i].id}`
            productCheckMode(btnId);
        }
    }
}

function productCheckMode(btnId) {
    let row = document.getElementById(`${btnId}`).parentNode.parentNode;
    row.classList.toggle(`check-row`);
}

//Validation

function isFieldEmpty(id) {
    if (document.getElementById(id).value == ``) {
        
        return true;
    }
    return false;
}

//Creating filter list. Dublicating Category list to empty div.

function createFilterList() {
    let existingCategories = document.getElementById(`category-name`).innerHTML;
    document.getElementById(`filter-list`).innerHTML = existingCategories;
}

//Filtering products and updating products table.

function filterProducts() {
    let filterCategory = document.getElementById(`filter-list`).value;

    if (filterCategory == `placeholder`) {
        updateHtmlTable();
        return;
    }

    let productsList = JSON.parse(localStorage.getItem('products'));

    let filteredProducts = [];

    productsList.forEach(product => {

        if (filterCategory == product.category) {
            filteredProducts.push(product); 
        } 

    });
    updateHtmlTable(filteredProducts);

}
