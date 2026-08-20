from pathlib import Path
from contextlib import contextmanager
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
import os
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


@contextmanager
def serve(root: Path):
    old = Path.cwd()
    os.chdir(root)
    server = ThreadingHTTPServer(("127.0.0.1", 0), SimpleHTTPRequestHandler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_port}/index.html"
    finally:
        server.shutdown()
        server.server_close()
        os.chdir(old)


with serve(ROOT) as url, sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 960})
    page.set_default_timeout(7000)
    errors = []
    page.on("console", lambda msg: errors.append(("console", msg.type, msg.text)) if msg.type == "error" else None)
    page.on("pageerror", lambda exc: errors.append(("pageerror", "error", str(exc))))
    page.goto(url, wait_until="networkidle")

    assert page.evaluate("typeof window.__TECHOPS_REFRESH__") == "object"
    assert page.locator("#titleRefreshBtn").is_visible()

    # Experienced-tech path opens directly; it does not force the beginner orientation.
    page.click("#titleRefreshBtn")
    assert page.locator("#refreshOverlay").is_visible()
    assert page.get_by_text("Come back sharp, not bored.", exact=True).is_visible()
    assert not page.locator("#coachModalBackdrop").is_visible()

    # Instructor lens can be enabled for professional content review.
    page.click("#homeInstructor")
    assert page.evaluate("window.__TECHOPS_REFRESH__.state.instructor") is True

    # Complete a perfect 15-scenario skills scan. Every regression fixture uses choice 0.
    page.click('[data-go="scan"]')
    page.click("#startScan")
    for _ in range(15):
        page.locator('[data-scan-choice="0"]').click()
        page.wait_for_timeout(980)
    page.wait_for_timeout(200)
    assert page.evaluate("window.__TECHOPS_REFRESH__.state.bestScore") == 100
    assert page.get_by_text("Skills are sharp.", exact=True).is_visible()
    assert page.locator(".domain-result").count() == 5

    # Open reviewer tools and confirm a professional packet is generated.
    page.click("#scanReview")
    packet = page.evaluate("window.__TECHOPS_REFRESH__.buildReport()")
    assert "TECHOPS FIELD REVIEW PACKET" in packet
    assert "Best skills scan: 100%" in packet
    assert "Core 1 lab coverage:" in packet

    # Open Repair Room Challenge and clear all six three-step devices.
    page.click('[data-refresh-view="queue"]')
    page.click("#startQueue")
    for _ in range(18):
        page.locator('[data-repair-choice="0"]').click()
        page.wait_for_timeout(900)
    page.wait_for_timeout(200)
    assert page.evaluate("window.__TECHOPS_REFRESH__.state.queueRuns") >= 1
    assert page.get_by_text("Queue cleared.", exact=True).is_visible()

    # Technician mode can hand off into the same Core 1 hands-on lab.
    page.click("#queueFaults")
    page.wait_for_timeout(150)
    assert page.locator("#labOverlay").is_visible()
    assert page.get_by_text("Troubleshooting Arena", exact=True).is_visible()

    print("Technician Refresh smoke: best_scan=", page.evaluate("window.__TECHOPS_REFRESH__.state.bestScore"), "queue_runs=", page.evaluate("window.__TECHOPS_REFRESH__.state.queueRuns"))
    print("Browser errors:", errors)
    assert not errors
    browser.close()
