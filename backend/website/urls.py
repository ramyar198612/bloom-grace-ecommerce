
from django.urls import path
from .views import WebsiteContentAPIView

urlpatterns = [
    path("", WebsiteContentAPIView.as_view(), name="website-content"),
]
