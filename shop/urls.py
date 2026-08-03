from django.urls import path
from . import views

urlpatterns = [
    path('',views.home),
    path('products',views.products),
    path('product details',views.product_detail),
    path('cart',views.cart),
    path('chekout',views.checkout),
    path('login',views.login),
    path('register',views.register),

]