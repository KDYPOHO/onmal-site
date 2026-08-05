#!/usr/bin/env python3
"""Merge translated values into i18n/*.json without reformatting the files.

Why line-based instead of json.load + json.dump: these files carry blank-line
grouping and a hand-kept key order that a dumper would flatten.  A reformat
turns a 30-line change into a 30-file rewrite, and then nobody can read the
diff.  (PowerShell's ConvertTo-Json is worse still - it escapes every non-ASCII
character to \\uXXXX and destroys all 30 files.)

Input: a UTF-8 JSON payload

    {
      "layout": [ ["anchor.key", ["new.key.a", "new.key.b"]], ... ],
      "langs":  { "en": {"key": "value", ...}, "ja": {...}, ... }
    }

Existing keys are replaced in place.  Keys listed in "layout" are inserted
right after their anchor line, in the order given.  A key that is neither
present nor in the layout is an error - silent appends are how key order rots.

Every file is parsed with json.loads before it is written.  Nothing is written
if any file fails.
"""

import json
import re
import sys
from pathlib import Path


def entry_re(key):
    # Values in these files are always one line.  Anchor to start-of-line so a
    # key never matches inside another key's value.
    return re.compile(r'^([ \t]*)"' + re.escape(key) + r'":[ \t]*(.*?)(,?)[ \t]*$', re.M)


def apply_to_text(text, values, layout, filename):
    problems = []

    # 1. Replace what is already there.
    pending = dict(values)
    for key in list(pending):
        pat = entry_re(key)
        m = pat.search(text)
        if not m:
            continue
        if len(pat.findall(text)) > 1:
            problems.append("%s: key %s appears more than once" % (filename, key))
            continue
        encoded = json.dumps(pending.pop(key), ensure_ascii=False)
        text = text[:m.start()] + '%s"%s": %s%s' % (m.group(1), key, encoded, m.group(3)) + text[m.end():]

    if not pending:
        return text, problems

    # 2. Insert the rest after their anchors, keeping the layout order.
    for anchor, keys in layout:
        wanted = [k for k in keys if k in pending]
        if not wanted:
            continue
        m = entry_re(anchor).search(text)
        if not m:
            problems.append("%s: anchor %s not found" % (filename, anchor))
            continue
        if not m.group(3):
            problems.append("%s: anchor %s is the last entry of a block - pick another"
                            % (filename, anchor))
            continue
        lines = ['  "%s": %s,' % (k, json.dumps(pending.pop(k), ensure_ascii=False))
                 for k in wanted]
        text = text[:m.end()] + "\n" + "\n".join(lines) + text[m.end():]

    for key in pending:
        problems.append("%s: key %s is new but has no layout anchor" % (filename, key))
    return text, problems


def main():
    if len(sys.argv) != 3:
        print("usage: merge-i18n.py <payload.json> <i18n-dir>")
        return 2

    payload = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    i18n = Path(sys.argv[2])
    layout = [(a, ks) for a, ks in payload.get("layout", [])]

    problems = []
    staged = {}
    for lang, values in payload["langs"].items():
        path = i18n / (lang + ".json")
        if not path.exists():
            problems.append("no such file: %s" % path)
            continue
        text = path.read_text(encoding="utf-8")
        text, probs = apply_to_text(text, values, layout, path.name)
        problems.extend(probs)
        try:
            parsed = json.loads(text)
        except ValueError as exc:
            problems.append("%s: result is not valid JSON: %s" % (path.name, exc))
            continue
        for key, want in values.items():
            if parsed.get(key) != want:
                problems.append("%s: %s did not land" % (path.name, key))
        staged[path] = text

    if problems:
        print("REFUSED - nothing written")
        for p in problems:
            print("  x " + p)
        return 1

    for path, text in staged.items():
        # newline="" keeps the LF endings these files already use; encoding
        # without BOM is what check-i18n.ps1 requires (RFC 8259).
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(text)
    print("ok - %d files, %d keys each"
          % (len(staged), max(len(v) for v in payload["langs"].values())))
    return 0


if __name__ == "__main__":
    sys.exit(main())
