//console.log("Hello World");
//console.log(user);

var formWrap = document.getElementById('form-wrapper');

if (user == 'AnonymousUser') {
    formWrap.innerHTML = 'User needs to be Logged in first!';
}

var form = document.getElementById('form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log("Form submitted..");
    document.getElementById('form-button').classList.add("hidden");
    document.getElementById('payment-info').classList.remove("hidden");
})

document.getElementById('make-payment').addEventListener('click', function(e) {
    submitFormData();

})

function submitFormData() {
    console.log('Payment Done!');
    var userFormData = {
        'name':null,
        'email':null,
        'address':null,
        'city':null,
        'state':null,
        'zipcode':null,
        'total':total
    }

    userFormData.name = form.name.value;
    userFormData.email = form.email.value;
    userFormData.address = form.address.value;
    userFormData.city = form.city.value;
    userFormData.state = form.state.value;
    userFormData.zipcode = form.zipcode.value;
    userFormData.country = form.country.value;

    var process_url = '/processOrder/';
    fetch(process_url, {
        method:'POST',
        headers: {
            'Content-Type':'application/json',
            'x-csrfToken':csrftoken,
        },
        body:JSON.stringify(userFormData)
    })

    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log('data', data);
        alert("Transaction Completed!");
        window.location.href = "{% url 'store' %}";
    })
}