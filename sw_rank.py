import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
import json

client = ApiClient()
result = client.call_api('SimilarWeb/get_global_rank', path_params={'domain': 'aiappbuddy.com'})
print(json.dumps(result, indent=2))
with open('/home/ubuntu/research/sw_rank.json', 'w') as f:
    json.dump(result, f, indent=2)
