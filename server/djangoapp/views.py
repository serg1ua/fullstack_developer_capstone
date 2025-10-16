from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http.response import HttpResponse as HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views import generic
from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json


# Get an instance of a logger
logger = logging.getLogger(__name__)


# User registration
class UserRegistrationView(generic.View):
    initial = {}
    template_name = "dynamic.html"

    def get(self, request):
        return render(request, self.template_name)


# User login
class UserLoginView(generic.View):
    initial = {}
    template_name = "dynamic.html"

    @method_decorator(csrf_exempt)
    def get(self, request):
        if "logout" in request.path:
            logout(request)
            data = {"userName": ""}
            return JsonResponse(data)
        return render(request, self.template_name)

    @method_decorator(csrf_exempt)
    def post(self, request):
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]

        user = authenticate(username=username, password=password)
        data = {}

        if user is not None:
            login(request, user)
            data = {"userName": username, "status": "Authenticated"}
        print(data, "DATA")
        return JsonResponse(data)


# Create a `registration` view to handle sign up request
# @csrf_exempt
# def registration(request):
# ...

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...

# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
# ...

# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...

# Create a `add_review` view to submit a review
# def add_review(request):
# ...
