from flask import Flask, Blueprint, render_template
app = Flask(__name__)

# Register itself as the main route
main = Blueprint('main', __name__)

@main.route("/")
def index():
    '''
    Index page of application
    :return: Send user to index
    '''
    return render_template('index.html')

