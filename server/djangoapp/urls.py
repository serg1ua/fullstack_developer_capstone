from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

app_name = "djangoapp"
urlpatterns = [
    path("login", views.UserLoginView.as_view(), name="login"),
    path("logout", views.UserLoginView.as_view(), name="logout"),
    path("register", views.UserRegistrationView.as_view(), name="login"),
    path("get_cars", views.CarView.as_view(), name="getcars"),
    path(route="get_dealers", view=views.get_dealerships, name="get_dealers"),
    path(
        route="get_dealers/<str:state>",
        view=views.get_dealerships,
        name="get_dealers_by_state",
    ),
    path(
        route="dealer/<int:dealer_id>",
        view=views.get_dealer_details,
        name="dealer_details",
    ),
    path(
        route="reviews/dealer/<int:dealer_id>",
        view=views.get_dealer_reviews,
        name="dealer_details",
    ),
    path(route="add_review", view=views.add_review, name="add_review"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
