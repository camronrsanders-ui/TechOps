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


def first_choice(page):
    page.locator('[data-choice="0"]').first.click()
    page.wait_for_timeout(80)


def go_station(page, station):
    page.locator(f'[data-lab-view="{station}"]').first.click()
    page.wait_for_timeout(100)


with serve(ROOT) as url, sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 960})
    page.set_default_timeout(6000)
    errors = []
    page.on("console", lambda msg: errors.append(("console", msg.type, msg.text)) if msg.type == "error" else None)
    page.on("pageerror", lambda exc: errors.append(("pageerror", "error", str(exc))))
    page.goto(url, wait_until="networkidle")

    assert page.title() == "TechOps — First Shift Playtest"
    assert page.evaluate("typeof window.__TECHOPS_LAB__") == "object"
    assert page.evaluate("window.__TECHOPS_LAB__.stations.length") == 8
    assert page.evaluate("Object.keys(window.__TECHOPS_LAB__.objectives).length") == 27

    # Lab is available before starting the story.
    page.click("#titleLabBtn")
    page.wait_for_timeout(100)
    assert page.locator("#labOverlay").is_visible()
    assert page.get_by_text("TechOps Computer Lab", exact=True).is_visible()

    # PC Build Bay: safe handling + full compatible office build + POST.
    go_station(page, "pc-build-bay")
    page.click("#esdBtn")
    page.locator('[data-install="am5-matx"]').click()
    page.locator('[data-part-tab="cpu"]').click()
    page.locator('[data-install="r5-am5"]').click()
    page.locator('[data-part-tab="ram"]').click()
    page.locator('[data-install="ddr5-16"]').click()
    page.locator('[data-part-tab="storage"]').click()
    page.locator('[data-install="nvme-1t"]').click()
    page.locator('[data-part-tab="psu"]').click()
    page.locator('[data-install="450w"]').click()
    page.locator('[data-part-tab="gpu"]').click()
    page.locator('[data-install="igpu"]').click()
    page.click("#postBuildBtn")
    assert page.evaluate("window.__TECHOPS_LAB__.state.objectives['3.3'] >= 1")
    assert page.evaluate("window.__TECHOPS_LAB__.state.objectives['3.6'] >= 1")
    page.wait_for_timeout(1500)

    # Cable identification/tool drill.
    go_station(page, "cable-wall")
    first_choice(page)
    page.wait_for_timeout(1250)

    # Network rack.
    go_station(page, "network-rack")
    first_choice(page)
    page.wait_for_timeout(1300)

    # Mobile clinic.
    go_station(page, "mobile-clinic")
    first_choice(page)
    page.wait_for_timeout(1250)

    # Display lab.
    go_station(page, "display-lab")
    first_choice(page)
    page.wait_for_timeout(1250)

    # Printer shop.
    go_station(page, "printer-shop")
    first_choice(page)
    page.wait_for_timeout(1250)

    # VM/cloud sandbox + verify resource sliders are usable.
    go_station(page, "vm-cloud-sandbox")
    page.locator("#vmRam").evaluate("el => { el.value = '8'; el.dispatchEvent(new Event('input', {bubbles:true})); }")
    assert page.locator("#vmRamVal").inner_text() == "8"
    first_choice(page)
    page.wait_for_timeout(1400)

    # Troubleshooting arena: complete evidence -> cause -> fix -> verify.
    go_station(page, "troubleshooting-arena")
    for _ in range(4):
        page.locator('[data-trouble-choice="0"]').first.click()
        page.wait_for_timeout(920)

    assert page.evaluate("window.__TECHOPS_LAB__.state.sessions >= 8")
    assert page.evaluate("window.__TECHOPS_LAB__.state.xp > 0")
    assert page.evaluate("window.__TECHOPS_LAB__.coverage() > 0")

    # Matrix renders all five official Core 1 domains and all objective IDs.
    page.evaluate("window.__TECHOPS_LAB__.renderView('matrix')")
    page.wait_for_timeout(100)
    assert page.locator(".domain-card").count() == 5
    assert page.locator(".objective-row").count() == 27

    # Escape exits the lab instead of moving the story character underneath it.
    page.keyboard.press("Escape")
    page.wait_for_timeout(80)
    assert not page.locator("#labOverlay").is_visible()

    print("Core 1 lab smoke: stations=8 objectives=27 coverage=", page.evaluate("window.__TECHOPS_LAB__.coverage()"))
    print("Browser errors:", errors)
    assert not errors
    browser.close()
