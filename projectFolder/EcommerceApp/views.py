from django.shortcuts import render, redirect
from .models import *
from django.http import JsonResponse
import json
import datetime
from .utils import cartFunction


# Create your views here.
def store(request):
    cartData = cartFunction(request)
    cartItems = cartData['cartItems']
    order = cartData['order']
    items = cartData['items']
    products = Product.objects.all()
    context = {"products":products, 'cartItems':cartItems}
    return render(request, 'store/store.html', context)

def cart(request):
    cartData = cartFunction(request)
    cartItems = cartData['cartItems']
    order = cartData['order']
    items = cartData['items']
    context = {'items':items, 'order':order, 'cartItems':cartItems}
    print(items)
    return render(request, 'store/cart.html', context)

def checkout(request):
    cartData = cartFunction(request)
    cartItems = cartData['cartItems']
    order = cartData['order']
    items = cartData['items']
    context = {'items':items, 'order':order, 'cartItems':cartItems}
    return render(request, 'store/checkout.html', context)

def updateItem(request):
    data = json.loads(request.body)
    productId = data['productId']
    action = data['action']
    print("id:", productId)
    print("action:",action)

    customer = request.user.customer
    product = Product.objects.get(id=productId)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)
    if action == 'add':
        orderItem.quantity = (orderItem.quantity+1)
    elif action == 'remove':
        orderItem.quantity = (orderItem.quantity-1)
    orderItem.save()
    if orderItem.quantity <= 0:
        orderItem.delete()
    return JsonResponse("Item was added", safe=False)

def processOrder(request):
    transaction_id = datetime.datetime.now().timestamp()
    data = json.loads(request.body)
    #print(data['total'])
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        total = data['total']
        order.transaction_id = transaction_id
        print(type(total),float(order.get_cart_total))
        if float(total) == float(order.get_cart_total):
            print('hello world')
            order.complete = True
        order.save()
        ShippingAddress.objects.create(
            customer=customer,
            order=order,
            address=data['address'],
            city=data['city'],
            state=data['state'],
            zipcode=data['zipcode']
        )
    return JsonResponse("Payment Complete", safe=False)
