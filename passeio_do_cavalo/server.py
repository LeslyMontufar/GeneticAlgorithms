#!/home/lesly/genetic/venv/bin/python3
from main import main


from flask import Flask, request, send_from_directory
from flask_sock import Sock
from threading import Thread
import json, time

app = Flask(__name__, static_folder='front')
sock = Sock(app)

clients = {} # dicionario

@sock.route('/ws') # abre a conexao socket
def websocket(ws):
	token = request.args.get("token")
	if not token:
		raise Exception("Token ausente na conexão WebSocket")
	clients[token] = ws
	try:
		while True:
			msg = ws.receive()
			if msg is None:
				break
	except:
		pass  # desconectado ou erro de socket
	finally:
		clients.pop(token, None)

@app.route('/start', methods=['POST'])
def start():
	data = request.get_json()
	token = request.args.get("token")
	if not token or token not in clients:
		raise Exception("Socket não encontrado para token")
	ws = clients[token]
	def update(obj:dict):
		ws.send(json.dumps(obj))
	def close():
		ws.close()
	Thread(target=main, args=(data,  update, close)).start()
	return "started", 200


@app.route('/')
@app.route('/<path:filename>')
@app.route('/js/<path:filename>')
def serve_js(filename='index.html'):
	return send_from_directory('front', filename)


if __name__ == '__main__':
	app.run("0.0.0.0", port=5000)
