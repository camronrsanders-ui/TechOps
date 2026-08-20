from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text()
css = (ROOT / "styles.css").read_text()
js = (ROOT / "game.js").read_text()
html = html.replace('<link rel="stylesheet" href="styles.css" />', f"<style>{css}</style>")
html = html.replace('<script src="game.js"></script>', f"<script>{js}</script>")


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
    page.wait_for_timeout(50)


def cmd(page, text):
    page.locator("#terminalInput").fill(text)
    page.locator("#terminalInput").press("Enter")
    page.wait_for_timeout(50)


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


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.set_default_timeout(5000)
    errors = []
    page.on("console", lambda msg: errors.append(("console", msg.type, msg.text)) if msg.type == "error" else None)
    page.on("pageerror", lambda exc: errors.append(("pageerror", "error", str(exc))))
    page.set_content(html, wait_until="domcontentloaded")

    assert page.title() == "TechOps — First Shift Playtest"
    assert page.evaluate("window.__TECHOPS__.missions.length") == 8
    page.click("#newGameBtn")
    page.wait_for_timeout(100)

    # 1 — Payday Panic
    go(page, 380, 120)
    click_text(page, "Start remote session")
    open_app(page, "terminal")
    cmd(page, "ipconfig")
    cmd(page, "ipconfig /renew")
    cmd(page, "ping 8.8.8.8")
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
