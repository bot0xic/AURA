from django.contrib import admin

# Register your models here.

from .models import *
admin.site.register(Customer)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Promotion)
admin.site.register(OrderStatus)
admin.site.register(Payment)
admin.site.register(PaymentStatus)
admin.site.register(Shipping)
admin.site.register(ShippingStatus)
admin.site.register(OrderItem)
admin.site.register(Review)
admin.site.register(Supplier)
admin.site.register(Brand)
admin.site.register(PromotionType)
admin.site.register(Category)
