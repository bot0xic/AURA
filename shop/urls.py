from django.urls import path
from . import views

urlpatterns = [
    path('',views.home, name='home'),
    path("products/", views.products, name="products"),
    path("products/<str:gender>/", views.products, name="products_by_gender"),
    path('product-details/', views.product_detail, name='product_detail'),
    path('cart/',views.cart, name='cart'),
    path('checkout/',views.checkout, name='checkout'),
    path('login/',views.login, name='login'),
    path('register/',views.register, name='register'),
    path('orders/',views.orders, name='orders'),
    path('profile/',views.profile, name='profile'),

]