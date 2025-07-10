async function geneticAlgorithm(obj, fnc_update_progress) {
	const token = "lesly" + Math.random().toString(36).substring(2);
	const ws = new WebSocket(`ws://${location.host}/ws?token=${token}`)
	let global_resolve = null;
	let global_error = null;
	const promessa = new Promise((resolve, error) => { global_resolve = resolve; global_error = error; })
	ws.onmessage = function (event) {
		// backend me enviou algo
		// transforma a string em objeto
		const data = JSON.parse(event.data)
		// verifica se finalizou
		if (data.finished == true) {
			global_resolve(data)
			return;
		}
		// precisa atualizar o front
		fnc_update_progress(data);
	};

	ws.onerror = (err) => {
		global_error(err);
	}
	ws.onopen = () => {
		fetch(`/start?token=${token}`, {
			method: 'POST', body: JSON.stringify(obj), headers: {
				'Content-Type': 'application/json'
			}
		})
			.catch(err => {
				console.error("Erro ao iniciar processamento", err)
				ws.close()
				global_error(err)
			})
	}
	return await promessa;
}

