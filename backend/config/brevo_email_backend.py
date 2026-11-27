import json
import logging
import os
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

from django.core.mail.backends.base import BaseEmailBackend

logger = logging.getLogger(__name__)


class BrevoEmailBackend(BaseEmailBackend):

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        api_key = os.getenv("BREVO_API_KEY", "")

        if not api_key:
            logger.error("BREVO_API_KEY is missing.")
            return 0

        sent_count = 0

        for message in email_messages:
            try:
                sender_email = message.from_email
                sender_name = "Bloom & Grace"

                if "<" in sender_email and ">" in sender_email:
                    sender_name = sender_email.split("<")[0].strip()
                    sender_email = sender_email.split("<")[1].split(">")[0].strip()

                payload = {
                    "sender": {
                        "name": sender_name,
                        "email": sender_email,
                    },
                    "to": [
                        {"email": email}
                        for email in message.to
                    ],
                    "subject": message.subject,
                    "textContent": message.body,
                }

                # Include CC recipients if present
                if message.cc:
                    payload["cc"] = [
                        {"email": email}
                        for email in message.cc
                    ]

                # Include BCC recipients if present
                if message.bcc:
                    payload["bcc"] = [
                        {"email": email}
                        for email in message.bcc
                    ]

                # Include HTML email content if available
                if message.alternatives:
                    for content, content_type in message.alternatives:
                        if content_type == "text/html":
                            payload["htmlContent"] = content
                            break

                # Include Reply-To if present
                if message.reply_to:
                    payload["replyTo"] = {
                        "email": message.reply_to[0]
                    }

                request = Request(
                    "https://api.brevo.com/v3/smtp/email",
                    data=json.dumps(payload).encode("utf-8"),
                    headers={
                        "api-key": api_key,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    method="POST",
                )

                with urlopen(request, timeout=15) as response:
                    if response.status in (200, 201, 202):
                        sent_count += 1
                        logger.info(
                            "Brevo email sent successfully."
                        )

            except (HTTPError, URLError, TimeoutError, Exception) as error:
                logger.error(
                    "Brevo email sending failed: %s",
                    error,
                )

                if not self.fail_silently:
                    raise

        return sent_count