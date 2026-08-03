from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request,'shop/index.html')

def products(request):
    return render(request,'shop/products.html')

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