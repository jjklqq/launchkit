"""Resend email client + all transactional email templates."""

import asyncio
import logging

import resend

from core.config import settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Low-level sender
# ---------------------------------------------------------------------------

async def send_email(to: str, subject: str, html: str) -> None:
    """Send a single transactional email via Resend.

    Runs the synchronous Resend SDK in a thread so it doesn't block the
    async event loop.  Errors are logged but never raised — a failed email
    must not break the calling request.
    """
    def _send() -> None:
        resend.api_key = settings.RESEND_API_KEY
        resend.Emails.send(
            {
                "from": settings.RESEND_FROM_EMAIL,
                "to": [to],
                "subject": subject,
                "html": html,
            }
        )

    try:
        await asyncio.to_thread(_send)
    except Exception:
        logger.exception("Failed to send email to %s (subject: %r)", to, subject)


# ---------------------------------------------------------------------------
# HTML templates
# ---------------------------------------------------------------------------

def welcome_email(email: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;padding:40px">
        <tr><td>
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b">
            Welcome to LaunchKit
          </h1>
          <p style="margin:0 0 24px;font-size:15px;color:#71717a">
            Your account is ready. Start building.
          </p>
          <p style="margin:0 0 8px;font-size:14px;color:#52525b">
            You're signed in as <strong>{email}</strong>.
          </p>
          <a href="{settings.APP_URL}/dashboard"
             style="display:inline-block;margin-top:24px;padding:10px 24px;background:#09090b;color:#ffffff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">
            Go to dashboard
          </a>
          <p style="margin:32px 0 0;font-size:12px;color:#a1a1aa">
            If you didn't create this account, you can safely ignore this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


def password_reset_email(email: str, reset_url: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;padding:40px">
        <tr><td>
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b">
            Reset your password
          </h1>
          <p style="margin:0 0 24px;font-size:15px;color:#71717a">
            We received a password reset request for <strong>{email}</strong>.
          </p>
          <a href="{reset_url}"
             style="display:inline-block;padding:10px 24px;background:#09090b;color:#ffffff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">
            Reset password
          </a>
          <p style="margin:24px 0 0;font-size:13px;color:#71717a">
            This link expires in 1 hour. If you didn't request a reset,
            you can safely ignore this email — your password won't change.
          </p>
          <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;word-break:break-all">
            Or paste this URL into your browser:<br>{reset_url}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


# ---------------------------------------------------------------------------
# Convenience senders
# ---------------------------------------------------------------------------

async def send_welcome_email(email: str) -> None:
    await send_email(
        to=email,
        subject="Welcome to LaunchKit",
        html=welcome_email(email),
    )


async def send_password_reset_email(email: str, reset_url: str) -> None:
    await send_email(
        to=email,
        subject="Reset your LaunchKit password",
        html=password_reset_email(email, reset_url),
    )
