
from flask import Flask, request, render_template
from flask_classful import FlaskView,route
from request import send_lambda_request
import json

app = Flask(__name__)
"""
class HomeView(FlaskView):
    default_methods = ['GET', 'POST']
    def index(self):
        return render_template("index.html")
    ###bug###
    def my_form_post():
        text = request.form['text']
        processed_text = text.upper()
        return render_template("index.html", text = processed_text)
#HomeView.register(app)
"""

def get_result(response):
    if response == 'null':
        return "Wrong input!, please try again!"
    #return population
    else:
        json_acceptable_string = response.replace("'", "\"")
        result_json = json.loads(json_acceptable_string)
        html_result = f"City: {result_json['city']}\n  Location: {result_json['loc']}  \nPopulation: {result_json['pop']}"
    #{'_id': '01036', 'city': 'HAMPDEN', 'loc': [-72.431823, 42.064756], 'pop': 4709, 'state': 'MA'}
        return html_result

@app.route('/')
def my_form():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def my_form_post():
    text = request.form['text']
    api_response = send_lambda_request(text.upper())
    result = get_result(api_response)
    #print("got input text:", processed_text)
    return render_template('index.html', value=result)  




if __name__ == "__main__":
    app.run(host='0.0.0.0', port = 5000, debug=True)
