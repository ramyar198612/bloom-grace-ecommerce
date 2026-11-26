
from django.urls import path

from .views import WebsiteContentAPIView
from .import_views import import_database_fixture


urlpatterns = [
    path(
        "",
        WebsiteContentAPIView.as_view(),
        name="website-content",
    ),
    path(
        "import/",
        import_database_fixture,
        name="import-database-fixture",
    ),
]
