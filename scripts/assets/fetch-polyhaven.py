#!/usr/bin/env python3
"""Retrieve the selected Poly Haven props/fabrics through the catalog helper (resumable)."""
import json, os, subprocess
SKILL = '/home/ubuntu/skills/game-asset-catalog/scripts/retrieve.py'
CACHE = '/home/ubuntu/.cache/game-assets'
G1 = '/tmp/manus-game-assets-4CCPUB/game-assets-access-e5a7c3bf-a760-435b-a9b7-dcdfc3982e26.json'
G2 = '/tmp/manus-game-assets-GKE1Op/game-assets-access-6469cc8a-769f-4d7e-a9dd-7178eb504284.json'
plan = json.load(open('/tmp/ph-plan.json'))
os.chdir('/home/ubuntu/aegisrun')
for base, members in plan.items():
    pid = base.split('polyhaven-')[-1]
    dest = f'assets/source/polyhaven/{pid}'
    if os.path.isdir(dest) and len([f for f in os.listdir(dest) if not f.startswith('.')]) >= len(members):
        print('skip', pid, flush=True)
        continue
    grant = G2 if pid in ('marble_bust_01', 'crepe_satin', 'cotton_jersey', 'caban') else G1
    sel = f'/tmp/sel/ph-{pid}.json'
    json.dump(members, open(sel, 'w'))
    r = subprocess.run(['python3', SKILL, 'retrieve', '--grant-file', grant, '--archive-path', base + '/assets.zip',
                        '--members-file', sel, '--cache-dir', CACHE, '--destination', dest,
                        '--max-total-bytes', str(268435456)], capture_output=True, text=True, timeout=600)
    out = r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr[-300:]
    try:
        d = json.loads(out)
        print(pid, d.get('ok'), d.get('fileCount'), d.get('member', ''), d.get('code', ''), flush=True)
    except Exception:
        print(pid, 'RAW', out[-300:], flush=True)
print('PH_DONE', flush=True)
