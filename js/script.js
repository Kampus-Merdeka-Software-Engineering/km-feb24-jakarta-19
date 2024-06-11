// TOGGLE SIDEBAR
const menuBtn = document.getElementById('menu-label');
const sidebar = document.getElementsByClassName('sidebar')[0];

menuBtn.addEventListener('click', function () {
    sidebar.classList.toggle('hide');


});
// TOGGLE SIDEBAR

import datasets from "./../asset/dataset coffee shop seles.json" assert { type: "json" }
let topPerformance = []
let htmlTopPerformance = ""
let productSold = 0
let revenue = 0
let revenueByStore = []

for (let index = 0; index < datasets.length; index++) {
    const dataset = datasets[index];
    if (!topPerformance.includes(dataset.store_id)) {
        topPerformance.push(dataset.store_id)
        htmlTopPerformance += `
        <tr>
        <td>${dataset.store_location}</td>
        <td>${dataset.store_id}</td>
        </tr>
        `
    }
    productSold += Number(dataset.transaction_qty)
    revenue += Number(dataset.unit_price) * Number(dataset.transaction_qty)
    if (revenueByStore.filter(row => row.id === dataset.store_id).length > 0) {
        revenueByStore = revenueByStore.map(row => {
            if (row.id === dataset.store_id) {
                return {
                    ...row,
                    revenue: row.revenue + (Number(dataset.unit_price) * Number(dataset.transaction_qty))
                }

            }
            return row;
        })
    }
    else {
        revenueByStore.push({
            id: dataset.store_id,
            name: dataset.store_location,
            revenue: 0

        })
    }
}

// table 
let table = new DataTable('#all-table', {
    columns: [
        {
            data: 'DT_RowIndex',
            name: 'DT_RowIndex',
            defaultContent: ""
        },
        {
            data: 'transaction_id',
            name: 'transaction_id',
            orderable: true,
            searchable: true
        },
        {
            data: 'transaction_date',
            name: 'transaction_date'
        },
        {
            data: 'transaction_time',
            name: 'transaction_time'
        },
        {
            data: 'transaction_qty',
            name: 'transaction_qty'
        },
        {
            data: 'store_id',
            name: 'store_id'
        },
        {
            data: 'store_location',
            name: 'store_location'
        },
        {
            data: 'product_id',
            name: 'product_id'
        },
        {
            data: 'unit_price',
            name: 'unit_price'
        },
        {
            data: 'product_category',
            name: 'product_category'
        },
        {
            data: 'product_type',
            name: 'product_type'
        },
        {
            data: 'product_detail',
            name: 'product_detail'
        }
    ],
    data: datasets,
    order: [[1, 'asc']]
});

table
    .on('order.dt search.dt', function () {
        let i = 1;

        table
            .cells(null, 0, { search: 'applied', order: 'applied' })
            .every(function (cell) {
                this.data(i++);
            });
    })
    .draw();

document.querySelector('#bodyPerformance').innerHTML = htmlTopPerformance
document.querySelector('#sold').innerHTML = productSold
document.querySelector('#trans').innerHTML = datasets.length
document.querySelector('#rev').innerHTML = "$" + revenue.toFixed(2)

function persen(items, totalRevenue) {
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
}

// =================== PIE CHART ================

let pieChart = createChart(
    'pie-chart',
    'pie',
    revenueByStore.map(row => row.name),
    [
        {
            label: 'Data',
            data: persen(revenueByStore, revenueByStore.reduce((acc, curr) => acc + curr.revenue, 0)),
            backgroundColor:
                [
                    'rgba(0, 60, 37, 0.8)',
                    'rgba(144, 103, 63, 0.9)',
                    'rgba(191, 225, 213, 0.9)'
                ]
            ,
        }],

    {}
);

// ============= BAR CHART ==============

function getMonthIndex(dateString) {
    const date = new Date(dateString);
    return date.getMonth();
}

const salesByLocationAndMonth = {
    "Lower Manhattan": Array(12).fill(0),
    "Hell's Kitchen": Array(12).fill(0),
    "Astoria": Array(12).fill(0)
};

datasets.forEach(dataset => {
    const monthIndex = getMonthIndex(dataset.transaction_date);
    const location = dataset.store_location;

    salesByLocationAndMonth[location][monthIndex] += Number(dataset.transaction_qty);
});

const locations = Object.keys(salesByLocationAndMonth);
const months = ["January", "February", "March", "April", "May", "June"];

const datasetsForChart = locations.map(location => {
    let backgroundColor;

    if (location === "Astoria") {
        backgroundColor = 'rgba(191, 225, 213, 0.9)';
    } else if (location === "Hell's Kitchen") {
        backgroundColor = 'rgba(144, 103, 63, 0.9)';
    } else if (location === "Lower Manhattan") {
        backgroundColor = 'rgba(0, 60, 37, 0.8)';
    }
    return {
        label: location,
        data: salesByLocationAndMonth[location],
        backgroundColor: backgroundColor,
        borderColor: backgroundColor.replace('0.2', '1'),
    };
});

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

let barChart = createChartBar(
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

// ==================== BAR CHART HORIZONTAL ================

const productCategorySales = {};

datasets.forEach(dataset => {
    const category = dataset.product_category;
    const quantity = Number(dataset.transaction_qty);

    if (!productCategorySales[category]) {
        productCategorySales[category] = 0;
    }

    productCategorySales[category] += quantity;
});

const sortedCategories = Object.entries(productCategorySales)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5);

const labels = sortedCategories.map(entry => entry[0]);
const data = sortedCategories.map(entry => entry[1]);



const datasetForChart = {
    labels: labels,
    datasets: [{
        label: 'Quantity Sold',
        data: data,
        backgroundColor: 'rgba(0, 60, 37, 0.8)',
        borderColor: 'rgba(191, 225, 213, 0.5)',
        borderWidth: 1
    }]
};

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

let barChartHor = createChartHorBar(
    'bar-chart-2',
    'bar',
    datasetForChart.labels,
    datasetForChart.datasets,
    {
        indexAxis: 'y',
        responsive: true,
        scales: {
            x: {
                beginAtZero: true
            }
        }
    }
);

// ============ LINE CHART ===============

function getHour(timeString) {
    const time = timeString.split(':');
    return parseInt(time[0], 10);
}

const salesByHour = Array(24).fill(0);

datasets.forEach(dataset => {
    const hour = getHour(dataset.transaction_time);
    const quantity = Number(dataset.transaction_qty);

    salesByHour[hour] += quantity;
});

const labelsHour = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const dataLine = salesByHour;

const datasetForChartLine = {
    labels: labelsHour,
    datasets: [{
        label: 'Products Sold',
        data: dataLine,
        fill: false,
        borderColor: 'rgba(144, 103, 63, 0.9)',
        backgroundColor: 'rgba(191, 225, 213, 0.9)',
        borderWidth: 2,
        tension: 0.1
    }]
};

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

let lineChart = createChartLine(
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

// ============================ FILTER =================================

document.querySelector('#store').value = 'All Store';

document.querySelector('#store').addEventListener('change', event => {
    const value = event.target.value
    let rows = datasets

    if (value != 'All Store') {
        rows = datasets.filter(row => row.store_location === value)
    }

    const startDate = document.querySelector('#dateStart').value;
    const endDate = document.querySelector('#dateEnd').value;

    if (startDate && endDate) {
        rows = rows.filter(row => {
            const transactionDate = new Date(row.transaction_date);
            return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
        });
    } else if (startDate) {
        rows = rows.filter(row => {
            const transactionDate = new Date(row.transaction_date);
            return transactionDate >= new Date(startDate);
        });
    } else if (endDate) {
        rows = rows.filter(row => {
            const transactionDate = new Date(row.transaction_date);
            return transactionDate <= new Date(endDate);
        });
    }

    table.clear()
    table.rows.add(rows)
    table.draw()

    updateMetricsAndCharts(rows, value)
});

// ======================= Filter berdasarkan date ================================ 
document.querySelectorAll('#dateStart, #dateEnd').forEach(input => {
    input.addEventListener('change', () => {
        const startDate = new Date(document.querySelector('#dateStart').value);
        const endDate = new Date(document.querySelector('#dateEnd').value);
        let filteredRows = datasets;

        if (document.querySelector('#store').value !== 'All Store') {
            filteredRows = filteredRows.filter(row => row.store_location === document.querySelector('#store').value);
        }

        filteredRows = filteredRows.filter(row => {
            const transactionDate = new Date(row.transaction_date);
            if (document.querySelector('#dateStart').value && document.querySelector('#dateEnd').value) {
                return transactionDate >= startDate && transactionDate <= endDate;
            } else if (document.querySelector('#dateStart').value) {
                return transactionDate >= startDate
            } else if (document.querySelector('#dateEnd').value) {
                return transactionDate <= endDate
            }
            return true
        });

        updateMetricsAndCharts(filteredRows, 'All Store');
    });
});

function updateMetricsAndCharts(rows, value) {
    let topPerformance = []
    let htmlTopPerformance = ""
    let productSold = 0
    let revenue = 0
    let revenueByStore = []

    for (let index = 0; index < rows.length; index++) {
        const dataset = rows[index];
        if (!topPerformance.includes(dataset.store_id)) {
            topPerformance.push(dataset.store_id)
            htmlTopPerformance += `
        <tr>
        <td>${dataset.store_location}</td>
        <td>${dataset.store_id}</td>
        </tr>
        `
        }
        productSold += Number(dataset.transaction_qty)
        revenue += Number(dataset.unit_price) * Number(dataset.transaction_qty)
        if (revenueByStore.filter(row => row.id === dataset.store_id).length > 0) {
            revenueByStore = revenueByStore.map(row => {
                if (row.id === dataset.store_id) {
                    return {
                        ...row,
                        revenue: row.revenue + (Number(dataset.unit_price) * Number(dataset.transaction_qty))
                    }

                }
                return row;
            })
        } else {
            revenueByStore.push({
                id: dataset.store_id,
                name: dataset.store_location,
                revenue: 0
            })
        }
    }

    document.querySelector('#bodyPerformance').innerHTML = htmlTopPerformance
    document.querySelector('#sold').innerHTML = productSold
    document.querySelector('#trans').innerHTML = rows.length
    document.querySelector('#rev').innerHTML = "$" + revenue.toFixed(2)

    updatePieChart(revenueByStore, revenue, value)
    updateBarChart(rows)
    updateHorBarChart(rows)
    updateLineChart(rows)

    if (Array.isArray(rows)) {
        table.clear();
        table.rows.add(rows);
        table.draw();
    }

}

function updatePieChart(revenueByStore, revenue, value) {
    let backgroundColor = []

    if (value === 'Astoria') {
        backgroundColor.push('rgba(191, 225, 213, 0.9)')
    } else if (value === 'Lower Manhattan') {
        backgroundColor.push('rgba(0, 60, 37, 0.8)')
    } else if (value === "Hell's Kitchen") {
        backgroundColor.push('rgba(144, 103, 63, 0.9)')
    } else {
        backgroundColor = [
            'rgba(191, 225, 213, 0.9)',
            'rgba(0, 60, 37, 0.8)',
            'rgba(144, 103, 63, 0.9)']
    }

    pieChart.data.labels = revenueByStore.map(item => item.name)
    pieChart.data.datasets = [
        {
            label: 'Revenue',
            data: persen(revenueByStore, revenueByStore.reduce((acc, curr) => acc + curr.revenue, 0)),
            backgroundColor: backgroundColor
        }]

    pieChart.update()
}

function updateBarChart(rows) {
    const salesByLocationAndMonth = {
        "Lower Manhattan": Array(12).fill(0),
        "Hell's Kitchen": Array(12).fill(0),
        "Astoria": Array(12).fill(0)
    };

    rows.forEach(dataset => {
        const monthIndex = getMonthIndex(dataset.transaction_date);
        const location = dataset.store_location;

        salesByLocationAndMonth[location][monthIndex] += Number(dataset.transaction_qty);
    });

    const locations = Object.keys(salesByLocationAndMonth);
    const datasetsForChart = locations.map(location => {
        let backgroundColor;

        if (location === "Astoria") {
            backgroundColor = 'rgba(191, 225, 213, 0.9)';
        } else if (location === "Hell's Kitchen") {
            backgroundColor = 'rgba(144, 103, 63, 0.9)';
        } else if (location === "Lower Manhattan") {
            backgroundColor = 'rgba(0, 60, 37, 0.8)';
        }
        return {
            label: location,
            data: salesByLocationAndMonth[location],
            backgroundColor: backgroundColor,
            borderColor: backgroundColor.replace('0.2', '1'),
        };
    });

    barChart.data.labels = months
    barChart.data.datasets = datasetsForChart
    barChart.update()
}

function updateHorBarChart(rows) {
    const productCategorySales = {};

    rows.forEach(dataset => {
        const category = dataset.product_category;
        const quantity = Number(dataset.transaction_qty);

        if (!productCategorySales[category]) {
            productCategorySales[category] = 0;
        }

        productCategorySales[category] += quantity;
    });

    const sortedCategories = Object.entries(productCategorySales)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 5);

    const labels = sortedCategories.map(entry => entry[0]);
    const data = sortedCategories.map(entry => entry[1]);

    barChartHor.data.labels = labels
    barChartHor.data.datasets[0].data = data
    barChartHor.update()
}

function updateLineChart(rows) {
    const salesByHour = Array(24).fill(0);

    rows.forEach(dataset => {
        const hour = getHour(dataset.transaction_time);
        const quantity = Number(dataset.transaction_qty);

        salesByHour[hour] += quantity;
    });

    const dataLine = salesByHour;

    lineChart.data.labels = labelsHour
    lineChart.data.datasets[0].data = dataLine
    lineChart.update()
}