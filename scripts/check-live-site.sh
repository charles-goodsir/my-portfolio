#!/usr/bin/env bash
# Checks the deployed site for the controls GitHub Pages lets us have:
# an HTTP to HTTPS redirect, and the CSP meta tag the build adds.
# Usage: scripts/check-live-site.sh https://charlesgoodsir.com
set -euo pipefail

site="${1:?usage: $0 https://example.com}"
host="${site#https://}"

redirect=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "http://$host/")
if [[ "$redirect" != "301 https://$host/" ]]; then
  echo "FAIL: http://$host/ should 301 to https://$host/, got: $redirect"
  exit 1
fi
echo "ok: HTTP redirects to HTTPS"

# The query string skips the CDN cache, so this reads the build just deployed.
html=$(curl -sf "$site/?v=${GITHUB_SHA:-local}")
if ! grep -q "http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'" <<<"$html"; then
  echo "FAIL: no CSP meta tag with default-src 'self' on $site"
  exit 1
fi
echo "ok: CSP meta tag present"
