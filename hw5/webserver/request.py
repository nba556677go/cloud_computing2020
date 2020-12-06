import requests
import json

URL = "https://cyu5jgvlak.execute-api.us-east-1.amazonaws.com/default/getDBdata"


def send_lambda_request(params, api=URL):
    #url:aws api
    try:
        params = {'city' : params}
        #print(params)
        r = requests.get(url=api, params=params)
        data = r.text
    except Exception as error:
        data = str(error)

    return data

if __name__ == '__main__':
    result = send_lambda_request('Hsdfsdfsf')
    print(result)
    print(result == 'null')
    json_acceptable_string = result.replace("'", "\"")
    d = json.loads(json_acceptable_string)
    #print(result.type)
    #print(result['pop'])
  #  print(d)
 #   print(d['pop'])


