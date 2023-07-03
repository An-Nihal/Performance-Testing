/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.61428571428571, "KoPercent": 0.38571428571428573};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.45885714285714285, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4692857142857143, 500, 1500, "Get Booking After Update"], "isController": false}, {"data": [0.4905357142857143, 500, 1500, "Create Booking"], "isController": false}, {"data": [0.8825357142857143, 500, 1500, "Login"], "isController": false}, {"data": [0.20725, 500, 1500, "DeleteBooking"], "isController": false}, {"data": [0.49685714285714283, 500, 1500, "Get Booking"], "isController": false}, {"data": [0.20667857142857143, 500, 1500, "UpdateBooking"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 84000, 324, 0.38571428571428573, 1776.6980595238026, 295, 84247, 676.5, 1158.0, 1232.0, 1338.0, 578.0545711041531, 210.6925848587551, 167.79153530691946], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Booking After Update", 14000, 0, 0.0, 1223.1510000000035, 296, 43522, 1284.0, 1529.0, 1579.949999999999, 4566.799999999996, 98.63669989784056, 40.246092236322966, 18.109081621869166], "isController": false}, {"data": ["Create Booking", 14000, 0, 0.0, 1526.5762142857104, 296, 43654, 1254.5, 1515.0, 1582.0, 23773.989999999998, 98.51731441800897, 43.08340282322475, 42.121319674611385], "isController": false}, {"data": ["Login", 14000, 108, 0.7714285714285715, 2682.621642857136, 295, 84247, 309.0, 1650.0, 2884.2499999999836, 71713.0, 97.394014442141, 27.714385313330457, 24.255049923128293], "isController": false}, {"data": ["DeleteBooking", 14000, 108, 0.7714285714285715, 1931.5212857142842, 296, 31111, 2226.0, 2687.0, 2758.0, 2970.0, 98.6450399160108, 23.89356816724562, 23.20511716740768], "isController": false}, {"data": ["Get Booking", 14000, 0, 0.0, 1273.769571428578, 297, 43803, 1253.0, 1498.0, 1553.0, 4428.949999999999, 98.55892767886685, 40.214132470238724, 18.09480312854196], "isController": false}, {"data": ["UpdateBooking", 14000, 108, 0.7714285714285715, 2022.548642857131, 296, 44238, 2246.0, 2690.8999999999996, 2785.0, 4318.949999999999, 98.60335392265272, 40.10927337031546, 45.61363915486361], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to restful-booker.herokuapp.com:443 [restful-booker.herokuapp.com/3.209.172.72, restful-booker.herokuapp.com/23.22.130.173, restful-booker.herokuapp.com/54.243.238.66, restful-booker.herokuapp.com/107.22.57.98] failed: Connection timed out: connect", 108, 33.333333333333336, 0.12857142857142856], "isController": false}, {"data": ["403/Forbidden", 216, 66.66666666666667, 0.2571428571428571], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 84000, 324, "403/Forbidden", 216, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to restful-booker.herokuapp.com:443 [restful-booker.herokuapp.com/3.209.172.72, restful-booker.herokuapp.com/23.22.130.173, restful-booker.herokuapp.com/54.243.238.66, restful-booker.herokuapp.com/107.22.57.98] failed: Connection timed out: connect", 108, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 14000, 108, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to restful-booker.herokuapp.com:443 [restful-booker.herokuapp.com/3.209.172.72, restful-booker.herokuapp.com/23.22.130.173, restful-booker.herokuapp.com/54.243.238.66, restful-booker.herokuapp.com/107.22.57.98] failed: Connection timed out: connect", 108, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["DeleteBooking", 14000, 108, "403/Forbidden", 108, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["UpdateBooking", 14000, 108, "403/Forbidden", 108, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
