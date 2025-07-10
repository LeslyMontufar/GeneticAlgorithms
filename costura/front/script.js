// script.js
document.addEventListener('DOMContentLoaded', () => {
    const PIECES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const MAX_SQUARES = 10;
    const form = document.getElementById('tetris-form');

    // gera quadradinhos
    PIECES.forEach(p => {
        const container = document.querySelector(`.piece[data-piece="${p}"] .squares`);
        for (let i = 0; i < MAX_SQUARES; i++) {
            const sq = document.createElement('div');
            sq.classList.add('square');
            sq.addEventListener('click', () => sq.classList.toggle('active'));
            container.appendChild(sq);
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const counts = {};
        PIECES.forEach(p => {
            const active = document.querySelectorAll(`.piece[data-piece="${p}"] .square.active`).length;
            counts[p] = active;
        });
        // variáveis recebidas em const
        const userName = name;
        const tetrisCounts = counts;
        console.log({ userName, tetrisCounts });
        // aqui você pode enviar via AJAX ou processar os dados
        alert(`Nome: ${userName}\nContagens: ${JSON.stringify(tetrisCounts)}`);
    });
});
