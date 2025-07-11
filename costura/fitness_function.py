from config import *
import numpy as np
from scipy.ndimage import rotate
from peca import pecas



def fitness_function_no_rotation(elementos):
	"""
	Calcula a aptidao de um individuo.

	O individuo é representado por uma lista de elementos, onde cada elemento
	é uma lista de 3 elementos: [x, y, graus]. X e Y representam a posição
	onde a peça deve ser desenhada, e graus representa a rotação em graus
	que a peça deve ser rotacionada.

	A aptidao é calculada como um valor negativo, baseado em dois fatores:

	1. A quantidade de peças que estão fora do tecido. Quanto mais peças
	estiverem fora do tecido, menor a aptidao do individuo.
	2. A quantidade de sobreposições. Quanto mais sobreposições houver, menor
	a aptidao do individuo.

	Quanto mais a aptidao for negativa, pior o individuo.

	Parameters
	----------
	elementos : list of list of int
		Representa o individuo, com as 3 informações: y, x e phase

	Returns
	-------
	int
		Aptidao do individuo
	"""
	# cria uma matriz com 0 (numpy) do tamanho do tecido
	MAXIMO_LARGURA_ALTURA_PECA = 0

	matrizes = [None] * len(elementos)
	for i in range(len(elementos)):
		phase = elementos[i][2]
		matrizes[i] = pecas[i]['matrix']
		if phase != 0 and not pecas[i]['direction']:
			matrizes[i] = rotate(matrizes[i],phase, reshape=True)
		MAXIMO_LARGURA_ALTURA_PECA = max(MAXIMO_LARGURA_ALTURA_PECA,matrizes[i].shape[0],matrizes[i].shape[1])
		
	tecido = np.zeros((TECIDO_ALTURA+MAXIMO_LARGURA_ALTURA_PECA,TECIDO_LARGURA+MAXIMO_LARGURA_ALTURA_PECA), dtype=np.int8)

	# para cada peça i, soma na matriz a peça deslocada da posicao i
	for peca, mat, elemento in zip (pecas,matrizes, elementos):
		y, x, phase = elemento
		# des[2] é o angulo em graus que a peça foi rotacionada, pode ser de 0 a 360 e de 1 em 1 grau
		tecido[y:y+mat.shape[0], x:x+mat.shape[1]] += mat

	# penaliza peças que estao fora do tecido
	outside_right = tecido[:,TECIDO_LARGURA:TECIDO_LARGURA+MAXIMO_LARGURA_ALTURA_PECA].sum()
	
	outside_bottom = tecido[TECIDO_ALTURA:TECIDO_ALTURA+MAXIMO_LARGURA_ALTURA_PECA,:].sum()
	# outside_bottom = sum(matriz[:, TECIDO_ALTURA:TECIDO_ALTURA+MAXIMO_LARGURA_ALTURA_PECA])
	# identificar area sobreposta, onde for > 1 somar
	overlaping = (tecido[0:TECIDO_ALTURA, 0:TECIDO_LARGURA] > 1).sum()
	max_lines = 0
	# identificar o bottom vazio, contar as linhas que estão vazias de baixo para cima
	for y in range(TECIDO_ALTURA+1,0,-1):
		if sum(tecido[y, 0:TECIDO_LARGURA]) != 0:
			break
		max_lines += 1
	blank_bottom =  max_lines
	return blank_bottom - (outside_right*1000 + overlaping*1000 + outside_bottom*1000), tecido

def fitness_function(elementos):
	"""
	Calcula a aptidao de um individuo.

	O individuo é representado por uma lista de elementos, onde cada elemento
	é uma lista de 3 elementos: [x, y, graus]. X e Y representam a posição
	onde a peça deve ser desenhada, e graus representa a rotação em graus
	que a peça deve ser rotacionada.

	A aptidao é calculada como um valor negativo, baseado em dois fatores:

	1. A quantidade de peças que estão fora do tecido. Quanto mais peças
	estiverem fora do tecido, menor a aptidao do individuo.
	2. A quantidade de sobreposições. Quanto mais sobreposições houver, menor
	a aptidao do individuo.

	Quanto mais a aptidao for negativa, pior o individuo.

	Parameters
	----------
	elementos : list of list of int
		Representa o individuo, com as 3 informações: y, x e phase

	Returns
	-------
	int
		Aptidao do individuo
	"""
	# cria uma matriz com 0 (numpy) do tamanho do tecido
	MAXIMO_LARGURA_ALTURA_PECA = 0

	matrizes = [None] * len(elementos)
	for i in range(len(elementos)):
		phase = elementos[i][2]
		matrizes[i] = pecas[i]['matrix']
		if phase != 0:
			matrizes[i] = rotate(mat,phase, reshape=True)
		MAXIMO_LARGURA_ALTURA_PECA = max(MAXIMO_LARGURA_ALTURA_PECA,matrizes[i].shape[0],matrizes[i].shape[1])
		
	tecido = np.zeros((TECIDO_ALTURA+MAXIMO_LARGURA_ALTURA_PECA,TECIDO_LARGURA+MAXIMO_LARGURA_ALTURA_PECA), dtype=np.int8)

	rotation_punish = 0
	# para cada peça i, soma na matriz a peça deslocada da posicao i
	for peca, mat, elemento in zip (pecas,matrizes, elementos):
		y, x, phase = elemento
		if peca['direction']:
			rotation_punish += abs(peca['angle'] - phase)
		# des[2] é o angulo em graus que a peça foi rotacionada, pode ser de 0 a 360 e de 1 em 1 grau
		tecido[y:y+mat.shape[0], x:x+mat.shape[1]] += mat

	# penaliza peças que estao fora do tecido
	outside_right = sum(tecido[:,TECIDO_LARGURA:TECIDO_LARGURA+MAXIMO_LARGURA_ALTURA_PECA])
	# outside_bottom = sum(matriz[:, TECIDO_ALTURA:TECIDO_ALTURA+MAXIMO_LARGURA_ALTURA_PECA])
	# identificar area sobreposta, onde for > 1 somar
	overlaping = sum(tecido[0:TECIDO_ALTURA, 0:TECIDO_LARGURA] > 1)
	# identificar o bottom vazio, contar as linhas que estão vazias de baixo para cima
	for y in range(TECIDO_ALTURA,0,-1):
		if sum(tecido[y, 0:TECIDO_LARGURA]) != 0:
			break
		blank_bottom += TECIDO_LARGURA
	return blank_bottom - (outside_right + overlaping+rotation_punish), tecido