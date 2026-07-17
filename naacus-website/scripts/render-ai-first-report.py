#!/usr/bin/env python3
import json
import html
import pathlib
import sys
from datetime import datetime


def read_json(path: pathlib.Path):
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def badge(pass_fail: bool) -> str:
    if pass_fail:
        return '<span class="badge pass">PASS</span>'
    return '<span class="badge fail">FAIL</span>'


def render(report: dict) -> str:
    checks = report.get('checks', [])
    passed = report.get('passed', 0)
    failed = report.get('failed', 0)
    total = len(checks)
    generated = html.escape(report.get('generatedAt', ''))
    objective = html.escape(report.get('objective', ''))
    overall_pass = failed == 0

    rows = []
    for check in checks:
        check_name = html.escape(check.get('name', 'Unnamed check'))
        check_detail = html.escape(check.get('detail', ''))
        check_pass = bool(check.get('pass', False))
        rows.append(
            f"""
            <tr>
              <td>{badge(check_pass)}</td>
              <td>{check_name}</td>
              <td>{check_detail}</td>
            </tr>
            """.strip()
        )

    now = datetime.utcnow().isoformat() + 'Z'

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AI-First Eval Report</title>
  <style>
    :root {{
      --bg: #f7f9fc;
      --card: #ffffff;
      --text: #1c2834;
      --muted: #5a6b7b;
      --border: #d9e2ec;
      --pass: #147a40;
      --pass-bg: #e8f7ef;
      --fail: #b42318;
      --fail-bg: #fdeceb;
      --accent: #0f4c81;
    }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
    }}
    .wrap {{
      max-width: 1080px;
      margin: 32px auto;
      padding: 0 16px;
    }}
    .card {{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 16px rgba(15, 76, 129, 0.08);
      margin-bottom: 16px;
    }}
    h1 {{
      margin: 0 0 8px;
      font-size: 28px;
      color: var(--accent);
    }}
    .meta {{
      color: var(--muted);
      font-size: 14px;
      line-height: 1.6;
    }}
    .summary {{
      display: grid;
      grid-template-columns: repeat(4, minmax(100px, 1fr));
      gap: 10px;
      margin-top: 14px;
    }}
    .stat {{
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      background: #fcfdff;
    }}
    .stat .k {{
      display: block;
      font-size: 12px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }}
    .stat .v {{
      display: block;
      margin-top: 4px;
      font-size: 22px;
      font-weight: 700;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
    }}
    th, td {{
      border-bottom: 1px solid var(--border);
      text-align: left;
      padding: 10px;
      vertical-align: top;
      font-size: 14px;
    }}
    th {{
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
    }}
    .badge {{
      display: inline-block;
      border-radius: 999px;
      padding: 2px 10px;
      font-size: 12px;
      font-weight: 600;
    }}
    .pass {{
      color: var(--pass);
      background: var(--pass-bg);
    }}
    .fail {{
      color: var(--fail);
      background: var(--fail-bg);
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <section class="card">
      <h1>AI-First Eval Report</h1>
      <div class="meta">
        <div><strong>Generated:</strong> {generated}</div>
        <div><strong>Rendered:</strong> {html.escape(now)}</div>
        <div><strong>Objective:</strong> {objective}</div>
      </div>
      <div class="summary">
        <div class="stat"><span class="k">Result</span><span class="v">{ 'PASS' if overall_pass else 'FAIL' }</span></div>
        <div class="stat"><span class="k">Total Checks</span><span class="v">{total}</span></div>
        <div class="stat"><span class="k">Passed</span><span class="v">{passed}</span></div>
        <div class="stat"><span class="k">Failed</span><span class="v">{failed}</span></div>
      </div>
    </section>

    <section class="card">
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Check</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {''.join(rows)}
        </tbody>
      </table>
    </section>
  </div>
</body>
</html>
"""


def main(argv):
    if len(argv) != 3:
        print('Usage: render-ai-first-report.py <input-json> <output-html>', file=sys.stderr)
        return 2

    input_json = pathlib.Path(argv[1])
    output_html = pathlib.Path(argv[2])

    if not input_json.exists():
      print(f'Input report not found: {input_json}', file=sys.stderr)
      return 2

    report = read_json(input_json)
    output_html.parent.mkdir(parents=True, exist_ok=True)
    output_html.write_text(render(report), encoding='utf-8')

    print(f'HTML report written to {output_html}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv))
