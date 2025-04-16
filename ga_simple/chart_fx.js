google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Determinístico');
    
    var rows = [];
    for (var x = 0; x <= 4; x += 0.05) {
        rows.push([x, 10+x*Math.sin(4*x)+3*Math.sin(2*0.8)]);
    }
    data.addRows(rows);

    var options = {
        title: 'Gráfico de f(x) = 10+x*sin(4*x)+3*sin(2*y) , para y=0.8',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: { title: 'X' },
        vAxis: { title: 'Simple Example' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}