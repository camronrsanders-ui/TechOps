from pathlib import Path
import contextlib
import http.server
import socketserver
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

@contextlib.contextmanager
def server():
    handler = lambda *args, **kwargs: Quiet(*args, directory=str(ROOT), **kwargs)
    with socketserver.TCPServer(('127.0.0.1', 0), handler) as httpd:
        port = httpd.server_address[1]
        t = threading.Thread(target=httpd.serve_forever, daemon=True)
        t.start()
        try:
            yield f'http://127.0.0.1:{port}/index.html'
        finally:
            httpd.shutdown()

def install(page, part_id, zone):
    page.drag_and_drop(f'[data-part-id="{part_id}"]', f'[data-drop-zone="{zone}"]')
    page.wait_for_timeout(80)

def cable(page, part_id, node):
    page.click(f'[data-part-id="{part_id}"]')
    page.click(f'[data-connect-node="{node}"]')
    page.wait_for_timeout(80)

with server() as url, sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(url, wait_until='networkidle')

    page.wait_for_selector('#titleVisualHardwareBtn')
    assert '0.4' in page.locator('.brand-lockup small').inner_text()

    page.click('#titleVisualHardwareBtn')
    page.wait_for_selector('#visualHardwareOverlay:not(.hidden)')
    page.click('[data-vh-view="build"]')
    page.wait_for_selector('.vh-mobo-zone')

    page.click('#vhPower')
    assert 'No normal system power' in page.locator('#vhPost').inner_text()
    page.click('#vhResetBuild')

    page.click('#vhEsd')
    install(page, 'b650', 'board')
    install(page, 'r5-am5', 'board')
    install(page, 'thermal-paste', 'board')
    install(page, 'tower-cooler', 'board')
    install(page, 'ddr5-16', 'board')
    install(page, 'nvme-1t', 'board')
    install(page, '450w', 'psu')

    cable(page, 'atx24', 'atx24')
    cable(page, 'eps8', 'eps8')
    cable(page, 'cpu-fan', 'cpu-fan')
    cable(page, 'front-panel', 'front-panel')
    cable(page, 'hdmi', 'display-mb')
    page.click('#vhPower')
    page.wait_for_timeout(150)
    assert 'POST SUCCESS' in page.locator('#vhPost').inner_text()
    assert page.evaluate('window.__TECHOPS_VISUAL_HARDWARE__.state.buildSuccess') >= 1

    page.click('#vhClose')
    page.evaluate('window.__TECHOPS_LAB__.open()')
    page.wait_for_selector('#labOverlay:not(.hidden)')
    page.click('[data-lab-view="pc-build-bay"]')
    page.wait_for_selector('#visualHardwareOverlay:not(.hidden)')
    assert page.locator('#labOverlay').evaluate('(el)=>el.classList.contains("hidden")')

    page.evaluate('window.__TECHOPS_VISUAL_HARDWARE__.renderView("cables")')
    page.click('[data-vh-cable="rj45"]')
    page.click('[data-cable-side="left"]')
    page.click('[data-cable-side="right"]')
    page.wait_for_timeout(100)
    assert page.evaluate('window.__TECHOPS_VISUAL_HARDWARE__.state.cableSuccess') >= 1

    page.evaluate('window.__TECHOPS_VISUAL_HARDWARE__.renderView("bios")')
    page.click('[data-bios-tab="boot"]')
    page.click('[data-boot-up="1"]')
    page.click('#vhBiosSave')
    assert 'PASS:' in page.locator('#vhBiosResult').inner_text()
    assert page.evaluate('window.__TECHOPS_VISUAL_HARDWARE__.state.biosSuccess') >= 1

    page.click('[data-vh-mode="challenge"]')
    page.evaluate('window.__TECHOPS_VISUAL_HARDWARE__.renderView("build")')
    assert 'vh-hidden-labels' in page.locator('.vh-workbench').get_attribute('class')

    mobile = browser.new_page(viewport={'width': 390, 'height': 844})
    mobile_errors = []
    mobile.on('pageerror', lambda e: mobile_errors.append(str(e)))
    mobile.goto(url, wait_until='networkidle')
    mobile.click('#titleVisualHardwareBtn')
    mobile.click('[data-vh-view="build"]')
    assert mobile.locator('#vhPower').is_visible()
    assert mobile.locator('#vhEsd').is_visible()

    assert errors == [], errors
    assert mobile_errors == [], mobile_errors
    print('Visual hardware smoke: build=PASS cable=PASS bios=PASS mobile=PASS errors=0')
    browser.close()
