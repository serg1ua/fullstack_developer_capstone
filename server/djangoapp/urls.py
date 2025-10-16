from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

app_name = "djangoapp"
urlpatterns = [
    path("login", views.UserLoginView.as_view(), name="login"),
    path("logout", views.UserLoginView.as_view(), name="logout"),
    path("register", views.UserRegistrationView.as_view(), name="login"),
    # path("login", TemplateView.as_view(template_name="index.html")),
    # path for dealer reviews view
    # path for add a review view
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
