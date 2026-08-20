from pathlib import Path
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PORT = 4173


def go(page, x, y):
    page.evaluate(f"window.__TECHOPS__.state.player.x={x};window.__TECHOPS__.state.player.y={y}")
    page.wait_for_timeout(80)
    page.keyboard.press("e")
    page.wait_for_timeout(60)


def click_text(page, text):
    page.get_by_role("button", name=text, exact=True).click()
    page.wait_for_timeout(70)


def open_app(page, name):
    page.locator(f'.os-icon[data-app="{name}"]').click()
    page.wait_for_timeout(80)


def cmd(page, text):
    page.locator("#terminalInput").fill(text)
    page.locator("#terminalInput").press("Enter")
    page.wait_for_timeout(80)


def ticket(page):
    page.fill("#ticketSummary", "User reported an incident affecting normal work.")
    page.fill("#ticketCause", "Root cause was identified through troubleshooting evidence.")
    page.fill("#ticketFix", "I applied the appropriate corrective action safely.")
    page.fill("#ticketVerify", "I verified full functionality after the repair was complete.")
    page.click("#closeTicketBtn")
    page.wait_for_timeout(120)
    assert page.get_by_text("MISSION COMPLETE").count() or page.get_by_text("INCIDENT RESOLVED").count()


def close_overlay(page):
    page.click("#overlayClose")
    page.wait_for_timeout(50)


server = subprocess.Popen(
    [sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
    cwd=ROOT,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)
time.sleep(0.6)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        page.set_default_timeout(5000)
        errors = []
        page.on("console", lambda msg: errors.append(("console", msg.type, msg.text)) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(("pageerror", "error", str(exc))))
        page.goto(f"http://127.0.0.1:{PORT}/", wait_until="networkidle")

        assert page.title() == "TechOps — First Shift Playtest"
        assert page.evaluate("window.__TECHOPS__.missions.length") == 8
        assert page.evaluate("typeof window.__TECHOPS_UX__") == "object"
        assert page.locator("#learnBtn").is_visible()

        page.click("#newGameBtn")
        page.wait_for_timeout(180)

        # Beginner orientation must appear on a fresh browser profile.
        assert page.locator("#coachModalBackdrop").is_visible()
        assert "Welcome to your first IT shift" in page.locator("#coachModalBody").inner_text()
        page.click("#coachSkip")
        page.wait_for_timeout(80)
        assert page.locator("#termsPanel").count() == 1
        assert page.get_by_role("button", name="DHCP", exact=True).count() >= 1

        # 1 — Payday Panic + realistic Windows behavior
        go(page, 380, 120)
        click_text(page, "Start remote session")
        assert page.locator("#osStart").is_visible()
        assert page.locator("#osSearch").is_visible()

        open_app(page, "terminal")
        assert page.locator("#osWindowMin").is_visible()
        assert page.locator("#osWindowMax").is_visible()
        assert page.locator("#osWindowClose").is_visible()
        assert page.locator("#terminalInput").is_visible()

        # Minimize and restore from the taskbar like a normal desktop app.
        page.click("#osWindowMin")
        page.wait_for_timeout(50)
        assert page.locator("#osWindow").evaluate("el => el.classList.contains('minimized')")
        assert page.locator("#osTaskApp").is_visible()
        page.click("#osTaskApp")
        page.wait_for_timeout(50)
        assert not page.locator("#osWindow").evaluate("el => el.classList.contains('minimized')")

        # Maximize and restore.
        page.click("#osWindowMax")
        assert page.locator("#osWindow").evaluate("el => el.classList.contains('maximized')")
        page.click("#osWindowMax")
        assert not page.locator("#osWindow").evaluate("el => el.classList.contains('maximized')")

        # The app and Terminal command area must stay inside the simulated desktop.
        win_box = page.locator("#osWindow").bounding_box()
        desk_box = page.locator(".os-desktop").bounding_box()
        input_box = page.locator("#terminalInput").bounding_box()
        assert win_box["y"] >= desk_box["y"] - 1
        assert win_box["y"] + win_box["height"] <= desk_box["y"] + desk_box["height"] + 2
        assert input_box["y"] + input_box["height"] <= win_box["y"] + win_box["height"] + 1

        cmd(page, "ipconfig")
        assert "169.254.44.18" in page.locator("#terminalOut").inner_text()
        page.wait_for_timeout(80)
        assert page.locator("#coachCard").is_visible()
        assert "APIPA" in page.locator("#coachCard").inner_text()

        # Command history: Up Arrow should recall the previous command.
        page.locator("#terminalInput").press("ArrowUp")
        assert page.locator("#terminalInput").input_value() == "ipconfig"
        page.locator("#terminalInput").fill("")

        cmd(page, "ipconfig /renew")
        cmd(page, "ping 8.8.8.8")

        # Close the app, then reopen another app without leaving Remote Desktop.
        page.click("#osWindowClose")
        page.wait_for_timeout(60)
        assert page.locator("#osWindow").evaluate("el => el.classList.contains('hidden')")
        open_app(page, "browser")
        close_overlay(page)
        go(page, 380, 120)
        click_text(page, "Open Ticket Notes")
        ticket(page)
        click_text(page, "ACCEPT NEXT INCIDENT")

        # 2 — Heat Death
        go(page, 690, 120)
        click_text(page, "Start remote session")
        open_app(page, "taskmgr")
        click_text(page, "Record thermal evidence")
        close_overlay(page)
        go(page, 175, 535)
        page.click('[data-tool="power"]')
        page.click('[data-part="cpu"]')
        page.click('[data-tool="clean"]')
        page.click('[data-tool="stress"]')
        close_overlay(page)
        go(page, 690, 120)
        click_text(page, "Open Ticket Notes")
        ticket(page)
        click_text(page, "ACCEPT NEXT INCIDENT")

        # 3 — Pop-Up Plague
        go(page, 380, 315)
        click_text(page, "Start remote session")
        open_app(page, "browser")
        open_app(page, "taskmgr")
        click_text(page, "Inspect suspicious processes")
        open_app(page, "network")
        click_text(page, "Disconnect network adapter")
        open_app(page, "security")
        click_text(page, "Run approved full scan")
        click_text(page, "Quarantine detected threats")
        click_text(page, "Reboot and rescan")
        close_overlay(page)
        go(page, 380, 315)
        click_text(page, "Open Ticket Notes")
        ticket(page)
        click_text(page, "ACCEPT NEXT INCIDENT")

        # 4 — POST Mortem
        go(page, 690, 315)
        click_text(page, "Take PC to repair bench")
        go(page, 175, 535)
        page.click('[data-tool="power"]')
        page.click('[data-tool="esd"]')
        page.click('[data-part="ram"]')
        page.click('[data-tool="reseat"]')
        page.click('[data-tool="post"]')
        close_overlay(page)
        go(page, 690, 315)
        click_text(page, "Open Ticket Notes")
        ticket(page)
        click_text(page, "ACCEPT NEXT INCIDENT")

        # 5 — Printer From Hell
        go(page, 145, 315)
        click_text(page, "Start remote session")
        open_app(page, "printer")
        click_text(page, "Open print queue")
        click_text(page, "Clear stuck queue")
        open_app(page, "services")
        click_text(page, "Restart Print Spooler")
        page.wait_for_timeout(450)
        open_app(page, "printer")
        click_text(page, "Print test page")
        close_overlay(page)
        go(page, 145, 315)
        click_text(page, "Open Ticket Notes")
        ticket(page)
        click_text(page, "ACCEPT NEXT INCIDENT")

        # 6 — The Name Game
        go(page, 930, 120)
        click_text(page, "Start remote session")
        open_app(page, "terminal")
        cmd(page, "ping 10.20.50.20")
        cmd(page, "nslookup ops.northstar.local")
        open_app(page, "network")
        click_text(page, "Edit DNS settings")
        click_text(page, "Use Northstar DNS")
        open_app(page, "terminal")
        cmd(page, "nslookup ops.northstar.local")
        open_app(page, "browser")
        close_overlay(page)
        go(page, 930, 120)
        click_text(page, "Open Ticket Notes")
        ticket(page)
        click_text(page, "ACCEPT NEXT INCIDENT")

        # 7 — Pairing Panic
        go(page, 930, 315)
        click_text(page, "Take phone to Mobile Lab")
        go(page, 750, 535)
        page.click("#btSwitch")
        click_text(page, "Put headset in pairing mode")
        click_text(page, "Pair device")
        click_text(page, "Confirm pairing")
        click_text(page, "Test audio")
        close_overlay(page)
        go(page, 930, 315)
        click_text(page, "Open Ticket Notes")
        ticket(page)
        click_text(page, "ACCEPT NEXT INCIDENT")

        # 8 — Ghost in the Copilot
        go(page, 965, 530)
        click_text(page, "Open AI incident console")
        page.click('[data-ai="policy"]')
        page.click('[data-ai="classify"]')
        page.click('[data-ai="hallucination"]')
        page.click('[data-ai="verify"]')
        page.click('[data-ai="sanitize"]')
        close_overlay(page)
        go(page, 965, 530)
        click_text(page, "Open Ticket Notes")
        ticket(page)
        click_text(page, "VIEW SHIFT RESULTS")

        completed = page.evaluate("window.__TECHOPS__.state.completed.size")
        readiness = page.evaluate("window.__TECHOPS__.readiness()")
        wrong_moves = page.evaluate("window.__TECHOPS__.state.wrongMoves")
        print(f"TechOps smoke: completed={completed} readiness={readiness}% wrong_moves={wrong_moves}")
        print(f"Browser errors: {errors}")

        assert completed == 8
        assert readiness == 100
        assert wrong_moves == 0
        assert not errors
        browser.close()
finally:
    server.terminate()
    try:
        server.wait(timeout=3)
    except subprocess.TimeoutExpired:
        server.kill()