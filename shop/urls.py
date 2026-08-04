from django.urls import path
from . import views

urlpatterns = [
    path('',views.home),
    path('products',views.products),
    path('product details',views.product_detail),
    path('cart',views.cart),
    path('checkout',views.checkout),
    path('login',views.login),
    path('register',views.register),
    path('orders',views.orders),
    path('profile',views.profile),

]