import os, csv, sys
from collections import Counter

root = r'E:\echowebsite-wechat\dist\build\mp-weixin'
out_path = r'E:\echowebsite-wechat\bundle-report.csv'

if not os.path.exists(root):
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('MISSING,' + root)
    sys.exit(1)

files = []
for dirpath, _, filenames in os.walk(root):
    for f in filenames:
        p = os.path.join(dirpath, f)
        files.append((os.path.getsize(p), p))
files.sort(reverse=True)

total = sum(s for s, _ in files)
exts = Counter()
for size, p in files:
    ext = os.path.splitext(p)[1] or '(none)'
    exts[ext] += size

dirs = {}
for size, p in files:
    rel = os.path.relpath(p, root)
    top = rel.split(os.sep)[0]
    dirs[top] = dirs.get(top, 0) + size

with open(out_path, 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['category', 'name', 'size_kb'])
    w.writerow(['TOTAL', 'TOTAL', round(total / 1024, 1)])
    for ext, s in sorted(exts.items(), key=lambda x: -x[1]):
        w.writerow(['EXT', ext, round(s / 1024, 1)])
    for d, s in sorted(dirs.items(), key=lambda x: -x[1]):
        w.writerow(['DIR', d, round(s / 1024, 1)])
    for size, p in files[:50]:
        w.writerow(['FILE', p.replace(root, ''), round(size / 1024, 1)])

print('ok')
