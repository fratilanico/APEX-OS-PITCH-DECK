import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
import json

client = ApiClient()

# Try visits total
result = client.call_api('SimilarWeb/get_visits_total',
    path_params={'domain': 'aiappbuddy.com'},
    query={'country': 'world', 'granularity': 'monthly', 'start_date': '2025-08', 'end_date': '2026-01'})
print("Visits:", json.dumps(result, indent=2))
with open('/home/ubuntu/research/sw_visits.json', 'w') as f:
    json.dump(result, f, indent=2)
