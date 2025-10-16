from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


CAR_TYPES = [
    ("SEDAN", "Sedan"),
    ("SUV", "SUV"),
    ("WAGON", "Wagon"),
    ("HATCHBACK", "Hatchback"),
    ("CONVERTIBLE", "Convertible"),
    ("COUPE", "Coupe"),
    ("MINIVAN", "Minivan"),
    ("PICKUP", "Pickup Truck"),
]


class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CAR_TYPES, default="SUV")
    year = models.IntegerField(
        default=2023, validators=[MaxValueValidator(2025), MinValueValidator(2015)]
    )

    def __str__(self):
        return self.name
