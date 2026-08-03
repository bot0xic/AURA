from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Customer(models.Model):
    GENDER_CHOICES = [
        ('male','male'),
        ('female',"female")
    ]
    fullname = models.CharField(max_length=200)
    email = models.EmailField(max_length=100)
    gender = models.CharField(max_length=10,choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    city = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    signup_date = models.DateField()
    def __str__(self):
        return self.fullname

class Product(models.Model):
    product_name = models.CharField(max_length=200)
    target_gender = models.CharField(max_length=200)
    price = models.FloatField()
    cost = models.FloatField()
    stock_quantity = models.PositiveIntegerField()
    create_date = models.DateField()
    category = models.ForeignKey("Category",on_delete=models.CASCADE,related_name="products")
    brand = models.ForeignKey("Brand",on_delete=models.CASCADE,related_name="products")
    supplier = models.ForeignKey("Supplier", on_delete=models.CASCADE,related_name="products")
    def __str__(self):
        return self.product_name

class Order(models.Model):
    customer = models.ForeignKey('Customer',on_delete=models.CASCADE,related_name='orders')
    promo = models.ForeignKey('Promotion',on_delete=models.CASCADE,related_name='orders')
    order_status = models.ForeignKey('OrderStatus',on_delete=models.PROTECT,related_name='orders')
    order_date = models.DateField()
    total_price = models.FloatField()



class Supplier(models.Model):
    supplier_name = models.CharField(max_length=200)
    country = models.CharField(max_length=200)

class Brand(models.Model):
    brand_name = models.CharField(max_length=100)
    def __str__(self):
        return self.brand_name

class Shipping(models.Model):
    order = models.OneToOneField("Order",on_delete=models.CASCADE)
    shipping_status = models.ForeignKey('ShippingStatus',on_delete=models.PROTECT)
    shipping_date = models.DateField()
    delivery_date = models.DateField()
    carrier = models.CharField(max_length=200)
    shipping_cost =models.FloatField()

class OrderItem(models.Model):
    order = models.ForeignKey('Order',on_delete=models.PROTECT) 
    product = models.ForeignKey('Product',on_delete=models.PROTECT)
    quantity = models.FloatField()
    unit_price = models.FloatField()
    total_price = models.FloatField()


class Category(models.Model):
    category_name = models.CharField(max_length=200)
    def __str__(self):
        return self.category_name


class Review(models.Model):
    customer = models.ForeignKey('Customer',on_delete=models.CASCADE)
    product = models.ForeignKey('Product',on_delete=models.CASCADE,related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.CharField(max_length=200)
    review_date = models.DateField()

class PromotionType(models.Model):
    STATUS_PROMOTION=[
        ('percentage','percentage'),
        ('fixed amount','fixed amount'),
        ('free shipping','free shipping')
    ]
    type_name = models.CharField(max_length=20,choices=STATUS_PROMOTION)

class Promotion(models.Model):
    code = models.CharField(max_length=200)
    discount_percentqage = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    Promotion_type = models.ForeignKey('PromotionType',on_delete=models.PROTECT,related_name='promotions')

class OrderStatus(models.Model):
    STATUS_CHOICES = [
    ("Pending", "Pending"),
    ("Shipped", "Shipped"),
    ("Delivered", "Delivered"),
    ("Cancelled", "Cancelled"),
    ]
    status_name = models.CharField(max_length=20,choices=STATUS_CHOICES)


class Payment(models.Model):
    order = models.OneToOneField('Order',on_delete=models.CASCADE)
    payment_status = models.ForeignKey("PaymentStatus",on_delete=models.PROTECT)
    amount = models.IntegerField()
    method = models.CharField(max_length=50)


class PaymentStatus(models.Model):
    STATUS_PAYMENT=[
        ('paid','paid'),
        ('pending','pending'),
        ('failed','failed'),
        ('refunded','refunded')
    ]
    status_name=models.CharField(max_length=20,choices=STATUS_PAYMENT)

class ShippingStatus(models.Model):
    STATUS_SHIPPING=[
        ('preparing','preparing'),
        ('shipped','shipped'),
        ('in transit','in transit'),
        ('delivered','delivered'),
        ('returned','returned')
    ]
    status_name = models.CharField(max_length=20,choices=STATUS_SHIPPING)