from config import *
import numpy as np
from scipy.ndimage import rotate
from peca import pecas


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
	for i in range(len(elementos)):
		phase = elementos[i][2]
		peca = pecas[i]
		if phase != 0:
			peca = rotate(peca,phase, reshape=False)
			pecas[i] = peca
		MAXIMO_LARGURA_ALTURA_PECA = max(MAXIMO_LARGURA_ALTURA_PECA, peca.shape[0], peca.shape[1])
		
	matriz = np.zeros((TECIDO_ALTURA+MAXIMO_LARGURA_ALTURA_PECA,TECIDO_LARGURA+MAXIMO_LARGURA_ALTURA_PECA), dtype=np.int8)
	# para cada peça i, soma na matriz a peça deslocada da posicao i
	for peca, elemento in zip (pecas, elementos):
		y, x, phase = elemento
		
		# des[2] é o angulo em graus que a peça foi rotacionada, pode ser de 0 a 360 e de 1 em 1 grau
		matriz[y:y+peca.shape[0], x:x+peca.shape[1]] += peca

	# penaliza peças que estao fora do tecido
	outside_right = sum(matriz[:,TECIDO_LARGURA:TECIDO_LARGURA+MAXIMO_LARGURA_ALTURA_PECA])
	# outside_bottom = sum(matriz[:, TECIDO_ALTURA:TECIDO_ALTURA+MAXIMO_LARGURA_ALTURA_PECA])
	# identificar area sobreposta, onde for > 1 somar
	overlaping = sum(matriz[0:TECIDO_ALTURA, 0:TECIDO_LARGURA] > 1)
	# identificar o bottom vazio, contar as linhas que estão vazias de baixo para cima
	for y in range(TECIDO_ALTURA,0,-1):
		if sum(matriz[y, 0:TECIDO_LARGURA]) != 0:
			break
		blank_bottom += TECIDO_LARGURA4
	return blank_bottom - (outside_right + overlaping), matriz