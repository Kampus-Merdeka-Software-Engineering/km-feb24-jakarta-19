function createChart(element, type, label, datasets, options) {
    const ctx = document.getElementById(element);

    const chart = new Chart(ctx, {

        type: type,
        data: {
            labels: label,
            datasets: datasets
        },
        options: options
    });
    return chart;

}
let pieChart = createChart(
    'pie-chart',
    'doughnut',
    ['astoria', 'hell kitchen', 'lower mahmantt'],
    [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
    }],

    {
        // maintainAspectRatio: false,
        // scales:{
        //     y : {
        //         beginAtZero:true
        //     }
        // }
    }
);

let barChart = createChart(
    'bar-chart',
    'bar',
    ['Juni', 'Mei', 'April', 'Maret', 'Februari', 'Januari'],
    [{

        label: 'My First Dataset',
        data: [200, 80, 100, 20, 40, 50],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(25, 355, 76)'
        ],
    },
    {
        label: 'My First Dataset',
        data: [300, 50, 100, 10, 29, 90],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
    },
    {
        label: 'My First Dataset',
        data: [300, 50, 100, 10, 29, 90],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
    }

    ],

    {
    
    }
);

let barChart2 = createChart(
    'bar-chart-2',
    'bar',
    ['Packaged chocolate', 'branded', 'loose tea', 'coffee beans','flavours'],
    [{
        label: 'My First Dataset',
        data: [20, 230, 100, 70, 40],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(35, 105, 36)',
            'rgb(5, 205, 26)'
        ],
    }],

    {
        indexAxis: 'y',
    }
);

let table = new DataTable('#table', {
    // config options...
});


