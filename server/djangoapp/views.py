from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from django.http.response import HttpResponse as HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views import generic
from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json

from djangoapp.models import CarMake, CarModel
from djangoapp.populate import initiate
from djangoapp.restapis import analyze_review_sentiments, get_request, post_review


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


# User login
class CarView(generic.View):
    def get(self, request):
        count = CarMake.objects.count()
        print(count)
        if count == 0:
            initiate()
        car_models = CarModel.objects.select_related("car_make")
        cars = []
        for car_model in car_models:
            cars.append(
                {"CarModel": car_model.name, "CarMake": car_model.car_make.name}
            )
        return JsonResponse({"CarModels": cars})


# get dealers
def get_dealerships(request, state="All"):
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


# get dealer details
def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchDealer/" + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# get review sentiments
def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchReviews/dealer/" + str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews if reviews and len(reviews) else []:
            response = analyze_review_sentiments(review_detail["review"])
            print(response)
            review_detail["sentiment"] = response["sentiment"] if response else None
        return JsonResponse({"status": 200, "reviews": reviews})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# add review
def add_review(request):
    if request.user.is_anonymous == False:
        data = json.loads(request.body)
        try:
            response = post_review(data)
            return JsonResponse({"status": 200})
        except:
            return JsonResponse({"status": 401, "message": "Error in posting review"})
    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})
