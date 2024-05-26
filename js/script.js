import datasets from "./../asset/dataset coffee shop selas.json" assert {
    type : "json"
}
let topPerformance = []
let htmlTopPerformance = ""
let ProductSold = 0
let revenue = 0
let revenueByStore = []

for (let index = 0; index < datasets.length; index++) {
    const dataset = datasets[index];
    if (!topPerformance.includes(dataset.store_id) ) {
        topPerformance.push(dataset.store_id)
        htmlTopPerformance += `
        <tr>
        <td>${dataset.store_location}</td>
        <td>${dataset.store_id}</td>
        </tr>
        `
    }
    ProductSold += Number(dataset.transaction_qty)
    revenue += Number(dataset.unit_price) * Number(dataset.transaction_qty)
    if (revenueByStore.filter(row=> row.id === dataset.store_id).length > 0 ) {
        revenueByStore= revenueByStore.map(row => {
            if (row.id === dataset.store_id) {
                return {
                    ...row,
                    revenue: row.revenue + (Number(dataset.unit_price) * Number(dataset.transaction_qty))
                }
                
            }
            return row;
        })
    }
    else{
        revenueByStore.push({
            id: dataset.store_id,
            name: dataset.store_location,
            revenue: 0

        })
    }
    console.log(dataset)

    document.querySelector('#colom').innerHTML += `
    <tr>
    <td>${index +1}</td>
    <td>${dataset.transaction_id}</td>
    <td>col-3</td>
    <td>col-4</td>
    <td>col-5</td>
    <td>col-6</td>
    <td>col-7</td>
    <td>col-8</td>
    </tr>`
}
console.log(revenueByStore)
document.querySelector('#top').innerHTML = htmlTopPerformance
document.querySelector('#sold').innerHTML = ProductSold
document.querySelector('#trans').innerHTML= datasets.length
document.querySelector('#rev').innerHTML = revenue

function persen(items,totalRevenue){
    let hasil = []
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        hasil.push(
           (item.revenue / totalRevenue * 100).toFixed(1)
        )
    }
    return hasil
}



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

};

// =================== PIE CHART ================

let pieChart = createChart(
    'pie-chart',
    'doughnut',
    revenueByStore.map(row=> row.name),
    // ["Astoria", "Hell's Kitchen", "Lower Manhattan"],
    [
        {
        label: 'trafic source',
        data: persen(revenueByStore, revenue),
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

// ============= BAR CHART ==============

let barChart = createChart(
    'bar-chart',
    'bar',
    ['January', 'February', 'March', 'April', 'May', 'June'],
    [{

        label: 'My First Dataset',
        data: [200, 80, 100, 20, 40, 50],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(25, 355, 76)',
            'rgb(255, 205, 86)',
            'rgb(255, 99, 132)'
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

// ==================== BAR CHART HORIZONTAL ================

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

// ============ LINE CHART ===============

let lineChart = createChart(
    'line-chart',
    'line',
    ['Packaged chocolate', 'branded', 'loose tea', 'coffee beans','flavours'],
    [{
        label: 'My First Dataset',
        data: [20, 230, 100, 70, 40],
        fill: false,
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(35, 105, 36)',
            'rgb(5, 205, 26)'
        ],
    }],
);

let table = new DataTable('#table', {
    // config options...
});


