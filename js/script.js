// TOGGLE SIDEBAR
const menuBtn = document.getElementsByClassName('menu-btn')[0];
const mainSect = document.getElementsByClassName('main-section')[0];
const aside = document.getElementsByTagName('aside')[0];

menuBtn.addEventListener('click', function(e) {
    aside.classList.toggle('hide');
})

document.addEventListener('click', (e) => {
    if (!aside.contains(e.target) && !menuBtn.contains(e.target)) {
        aside.classList.add('hide');
    }
});
// TOGGLE SIDEBAR


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
    // console.log(dataset)

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


// Helper function to get month name from date
function getMonthName(dateString) {
    const date = new Date(dateString);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[date.getMonth()];
}

// Helper function to get month index from date
function getMonthIndex(dateString) {
    const date = new Date(dateString);
    return date.getMonth();
}

// Aggregating the data
const salesByLocationAndMonth = {
    "Astoria": Array(12).fill(0),
    "Hell's Kitchen": Array(12).fill(0),
    "Lower Manhattan": Array(12).fill(0)
};

datasets.forEach(dataset => {
    const monthIndex = getMonthIndex(dataset.transaction_date);
    const location = dataset.store_location;

    salesByLocationAndMonth[location][monthIndex] += Number(dataset.transaction_qty);
});

// Preparing data for Chart.js
const locations = Object.keys(salesByLocationAndMonth);
const months = ["January", "February", "March", "April", "May", "June"];

const datasetsForChart = locations.map(location => {
    return {
        label: location,
        data: salesByLocationAndMonth[location],
        backgroundColor: getRandomColor() // Function to generate random colors for each location
    };
});

// Function to generate random colors
function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}

// Function to create a chart
function createChartBar(element, type, labels, datasets, options) {
    const ctx = document.getElementById(element).getContext('2d');
    return new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: options
    });
}

// Initialize the chart in your HTML
document.addEventListener('DOMContentLoaded', function() {
    const barChart = createChartBar(
        'bar-chart',
        'bar',
        months,
        datasetsForChart,
        {
            responsive: true,
            scales: {
                x: {
                    stacked: false,
                },
                y: {
                    stacked: false,
                    beginAtZero: true
                }
            }
        }
    );
});


// let barChart = createChart(
//     'bar-chart',
//     'bar',
//     ['January', 'February', 'March', 'April', 'May', 'June'],
//     [{

//         label: 'My First Dataset',
//         data: [200, 80, 100, 20, 40, 50],
//         backgroundColor: [
//             'rgb(255, 99, 132)',
//             'rgb(54, 162, 235)',
//             'rgb(255, 205, 86)',
//             'rgb(25, 355, 76)',
//             'rgb(255, 205, 86)',
//             'rgb(255, 99, 132)'
//         ],
//     },
//     {
//         label: 'My First Dataset',
//         data: [300, 50, 100, 10, 29, 90],
//         backgroundColor: [
//             'rgb(255, 99, 132)',
//             'rgb(54, 162, 235)',
//             'rgb(255, 205, 86)'
//         ],
//     },
//     {
//         label: 'My First Dataset',
//         data: [300, 50, 100, 10, 29, 90],
//         backgroundColor: [
//             'rgb(255, 99, 132)',
//             'rgb(54, 162, 235)',
//             'rgb(255, 205, 86)'
//         ],
//     }

//     ],

//     {
    
//     }
// );

// ==================== BAR CHART HORIZONTAL ================

// Aggregating the data by product category
const productCategorySales = {};

datasets.forEach(dataset => {
    const category = dataset.product_category;
    const quantity = Number(dataset.transaction_qty);

    if (!productCategorySales[category]) {
        productCategorySales[category] = 0;
    }

    productCategorySales[category] += quantity;
});

// Sorting and selecting the top 5 product categories with the smallest quantities sold
const sortedCategories = Object.entries(productCategorySales)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5);

// Preparing data for Chart.js
const labels = sortedCategories.map(entry => entry[0]);
const data = sortedCategories.map(entry => entry[1]);

const datasetForChart = {
    labels: labels,
    datasets: [{
        label: 'Quantity Sold',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
};

// Function to create a chart
function createChartHorBar(element, type, labels, datasets, options) {
    const ctx = document.getElementById(element).getContext('2d');
    return new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: options
    });
}

// Initialize the chart in your HTML
document.addEventListener('DOMContentLoaded', function() {
    const barChart = createChartHorBar(
        'bar-chart-2',
        'bar',
        datasetForChart.labels,
        datasetForChart.datasets,
        {
            indexAxis: 'y', // This makes the bar chart horizontal
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    );
});

// let barChart2 = createChart(
//     'bar-chart-2',
//     'bar',
//     ['Packaged chocolate', 'branded', 'loose tea', 'coffee beans','flavours'],
//     [{
//         label: 'My First Dataset',
//         data: [20, 230, 100, 70, 40],
//         backgroundColor: [
//             'rgb(255, 99, 132)',
//             'rgb(54, 162, 235)',
//             'rgb(255, 205, 86)',
//             'rgb(35, 105, 36)',
//             'rgb(5, 205, 26)'
//         ],
//     }],

//     {
//         indexAxis: 'y',
//     }
// );

// ============ LINE CHART ===============

// Helper function to get hour from time
function getHour(timeString) {
    const time = timeString.split(':');
    return parseInt(time[0], 10); // Extract hour as an integer
}

// Aggregating the data by hour
const salesByHour = Array(24).fill(0); // Initialize an array with 24 zeros for 24 hours

datasets.forEach(dataset => {
    const hour = getHour(dataset.transaction_time);
    const quantity = Number(dataset.transaction_qty);

    salesByHour[hour] += quantity;
});

// Preparing data for Chart.js
const labelsHour = Array.from({ length: 24 }, (_, i) => `${i}:00`); // Labels from 0:00 to 23:00
const dataLine = salesByHour;

const datasetForChartLine = {
    labels: labelsHour,
    datasets: [{
        label: 'Products Sold',
        data: dataLine,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
    }]
};

// Function to create a chart
function createChartLine(element, type, labels, datasets, options) {
    const ctx = document.getElementById(element).getContext('2d');
    return new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: options
    });
}

// Initialize the chart in your HTML after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const lineChart = createChartLine(
        'line-chart',
        'line',
        datasetForChartLine.labels,
        datasetForChartLine.datasets,
        {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    );
});

// let lineChart = createChart(
//     'line-chart',
//     'line',
//     ['Packaged chocolate', 'branded', 'loose tea', 'coffee beans','flavours'],
//     [{
//         label: 'My First Dataset',
//         data: [20, 230, 100, 70, 40],
//         fill: false,
//         backgroundColor: [
//             'rgb(255, 99, 132)',
//             'rgb(54, 162, 235)',
//             'rgb(255, 205, 86)',
//             'rgb(35, 105, 36)',
//             'rgb(5, 205, 26)'
//         ],
//     }],
// );

let table = new DataTable('#table', {
    // config options...
});

