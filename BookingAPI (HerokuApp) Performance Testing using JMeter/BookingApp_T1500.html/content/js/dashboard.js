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

    var data = {"OkPercent": 99.13, "KoPercent": 0.87};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3818666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3590333333333333, 500, 1500, "Get Booking After Update"], "isController": false}, {"data": [0.38963333333333333, 500, 1500, "Create Booking"], "isController": false}, {"data": [0.8675333333333334, 500, 1500, "Login"], "isController": false}, {"data": [0.14806666666666668, 500, 1500, "DeleteBooking"], "isController": false}, {"data": [0.3891, 500, 1500, "Get Booking"], "isController": false}, {"data": [0.13783333333333334, 500, 1500, "UpdateBooking"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90000, 783, 0.87, 1991.8886111111278, 295, 84268, 856.0, 1508.0, 1766.0, 1948.0, 544.6260537001289, 200.59917848454774, 157.6818712991903], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Booking After Update", 15000, 0, 0.0, 1350.1351333333348, 297, 43860, 1323.0, 1604.0, 1645.0, 8375.909999999998, 92.71736039856103, 37.830994940336375, 16.981371681877462], "isController": false}, {"data": ["Create Booking", 15000, 0, 0.0, 1827.0964666666623, 297, 43933, 1319.0, 1608.0, 1696.0, 24181.85, 92.68298711088592, 40.49113945815981, 39.62697318217768], "isController": false}, {"data": ["Login", 15000, 261, 1.74, 3244.764066666688, 295, 84268, 309.0, 1872.699999999999, 4501.899999999998, 84130.99, 91.6696713947846, 28.37715247072682, 22.606618273355906], "isController": false}, {"data": ["DeleteBooking", 15000, 261, 1.74, 2115.9765333333335, 296, 44266, 2294.0, 2830.0, 2904.0, 3132.9699999999993, 92.8005345310789, 22.48143699307708, 21.776104597029146], "isController": false}, {"data": ["Get Booking", 15000, 0, 0.0, 1279.0974666666655, 297, 43758, 1280.0, 1597.0, 1638.0, 2171.0, 92.71162974683544, 37.82844543457031, 16.980322101448156], "isController": false}, {"data": ["UpdateBooking", 15000, 261, 1.74, 2134.262000000001, 297, 45631, 2304.5, 2887.0, 2951.0, 3149.9799999999996, 92.71621421154131, 37.56935245257566, 42.83643623596895], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to restful-booker.herokuapp.com:443 [restful-booker.herokuapp.com/3.209.172.72, restful-booker.herokuapp.com/23.22.130.173, restful-booker.herokuapp.com/54.243.238.66, restful-booker.herokuapp.com/107.22.57.98] failed: Connection timed out: connect", 261, 33.333333333333336, 0.29], "isController": false}, {"data": ["403/Forbidden", 522, 66.66666666666667, 0.58], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90000, 783, "403/Forbidden", 522, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to restful-booker.herokuapp.com:443 [restful-booker.herokuapp.com/3.209.172.72, restful-booker.herokuapp.com/23.22.130.173, restful-booker.herokuapp.com/54.243.238.66, restful-booker.herokuapp.com/107.22.57.98] failed: Connection timed out: connect", 261, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 15000, 261, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to restful-booker.herokuapp.com:443 [restful-booker.herokuapp.com/3.209.172.72, restful-booker.herokuapp.com/23.22.130.173, restful-booker.herokuapp.com/54.243.238.66, restful-booker.herokuapp.com/107.22.57.98] failed: Connection timed out: connect", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["DeleteBooking", 15000, 261, "403/Forbidden", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["UpdateBooking", 15000, 261, "403/Forbidden", 261, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
