#!/home/henrique/venvs/flask-env/bin/python 
from flask import Flask, send_from_directory, request
import os
import sys


DIR = ''
if len(sys.argv) == 2:
	DIR = sys.argv[1]
	if DIR[-1] != '/':
		DIR = DIR+'/'
		
print(DIR)

app = Flask(__name__, static_folder='.')

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_file(path):
	if os.path.exists(DIR+path) and not os.path.isdir(DIR+path):
		return send_from_directory(DIR, path)
	else:
		print('Failed', path)
	# if request.accept_mimetypes.accept_json:
			# return {"message":'rota não encontrada'}, 404
	return send_from_directory(DIR, 'index.html')

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)