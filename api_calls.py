#!/usr/bin/env python

import sys
import requests

r = requests.get('https://data.healthcare.gov/resource/qhp-landscape-individual-market-medical.json?state=VA', headers={'X-App-Token': sys.argv[1]})
print r.status_code
print r.text