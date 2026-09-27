#!/bin/sh
DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
case "$(uname)" in
 Darwin) open "$DIR/AeroTwin.html" ;;
 *) if command -v xdg-open >/dev/null 2>&1; then xdg-open "$DIR/AeroTwin.html"; else printf "Open this file in your browser: %s/AeroTwin.html\n" "$DIR"; fi ;;
esac
