// console.log("Hello World!");
var addCart = document.getElementsByClassName('update-cart');

for (var i=0; i<addCart.length; i++) {
    addCart[i].addEventListener('click', function() {
        var productId = this.dataset.product;
        var action = this.dataset.action;
        console.log("Product ID:",productId,"Action:",action);
        console.log('user:',user);
        if (user == 'AnonymousUser') {
            //console.log("Not logged in");
            addCookieItem(productId, action);
            // location.reload()
        } else {
            updateUserOder(productId, action);
        }
    })
}

function addCookieItem(productId, action) {
    console.log("User is not authenticated");
    if (action == 'add') {
        console.log("Adding...!")
        if (cart[productId] == undefined) {
            console.log('undefined...!');
            cart[productId] = {'quantity':1};
        } else {
            cart[productId]['quantity'] += 1;
        }
    }
    if (action == 'remove') {
        cart[productId]['quantity'] -= 1;
        if (cart[productId]['quantity'] <= 0) {
            console.log('Item should be deleted.');
            delete cart[productId];
        }
    }
    console.log(cart);
    document.cookie = "cart=" + JSON.stringify(cart) + ";domain=;path=/";
    location.reload();
}

function updateUserOder(productId, action) {
    console.log("User is logged in sending data");
    var url = '/update_item/';
    fetch(url, {
        method:'POST',
        headers: {
            'Content-Type':'application/json',
            'x-CSRFToken':csrftoken
        },
        body:JSON.stringify({'productId':productId, 'action':action})
    })

    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log('data',data);
        location.reload();
    })
}
