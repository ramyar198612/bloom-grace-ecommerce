
import hmac
import json
import os
import tempfile

from django.conf import settings
from django.core.management import call_command
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


@csrf_exempt
@require_POST
def import_database_fixture(request):
    expected_token = os.getenv("DATA_IMPORT_TOKEN", "")

    if not expected_token:
        return JsonResponse(
            {"error": "Import endpoint is disabled."},
            status=404,
        )

    supplied_token = request.headers.get("X-Import-Token", "")

    if not hmac.compare_digest(supplied_token, expected_token):
        return JsonResponse(
            {"error": "Unauthorized."},
            status=401,
        )

    if len(request.body) > 5 * 1024 * 1024:
        return JsonResponse(
            {"error": "Import file is too large."},
            status=413,
        )

    try:
        fixture_data = json.loads(request.body.decode("utf-8"))

        if not isinstance(fixture_data, list):
            raise ValueError("Expected a JSON list.")

        if len(fixture_data) != 39:
            return JsonResponse(
                {"error": "Unexpected fixture record count."},
                status=400,
            )

        temp_path = None

        try:
            with tempfile.NamedTemporaryFile(
                mode="w",
                encoding="utf-8",
                suffix=".json",
                delete=False,
            ) as temp_file:
                json.dump(
                    fixture_data,
                    temp_file,
                    ensure_ascii=False,
                )
                temp_path = temp_file.name

            call_command(
                "loaddata",
                temp_path,
                verbosity=0,
            )

        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

        return JsonResponse({
            "success": True,
            "imported_records": len(fixture_data),
            "message": "Database import completed.",
        })

    except Exception:
        return JsonResponse(
            {"error": "Import failed. Check Render logs."},
            status=400,
        )
