from django.shortcuts import render
from .models import *

# Create your views here.
def home(request):

    return render(request,'shop/index.html')

def products(request,gender=None):
    products = Product.objects.all()
    if gender:
        products = products.filter(target_gender=gender)
    context = {
        'products':products,
        'current_gender':gender
    }
    return render(request,'shop/products.html',context)

def cart(request):

    return render(request,'shop/cart.html')

def product_detail(request):
    return render(request,'shop/product-detail.html')

def checkout(request):
    return render(request,'shop/checkout.html')

def login(request):
    return render(request,'shop/login.html')

def register(request):
    return render(request,'shop/register.html')

def orders(request):
    return render(request,'shop/orders.html')

def profile(request):
    return render(request,'shop/profile.html')