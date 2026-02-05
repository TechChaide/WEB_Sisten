__lbs.delivery = (function (lbs, delivery) {

    var
        banned_total = new Array(),
        labels,
        culture,
        _isFirsLoad = 0,
        _no_local_stored = -1,
        d1,
        d2,
        name,
        bindGridActions = function () {
            $(".delete-delivery").click(function () {
                var that = this;
                var r = confirm(labels[culture].delivery_delete_confirm);
                if (r == true) {
                    $.doPost("Delivery/DeleteDelivery", { deliveryId: $(that).data("delivery") });
                } else {

                }
            });
        },
        draw_orders_grid = function () {
            showLoading();
            $d1 = $(".datepicker:eq(0)");
            $d2 = $(".datepicker:eq(1)");
            $zoneName = $(".zoneName");

            $.datepicker.setDefaults($.datepicker.regional[culture]);

            var today = new Date();

            $d1.datepicker({
                dateFormat: "dd-mm-yy",
                changeMonth: true,
                changeYear: true,
                //maxDate: today,
                onClose: function (selectedDate, inst) {

                    //var newMaxDate = $d1.datepicker("getDate");
                    //newMaxDate.setMonth(newMaxDate.getMonth() + maxMonthRange);

                    $d2.datepicker("option", "minDate", selectedDate);
                    //$d2.datepicker("option", "maxDate", newMaxDate > today ? today : newMaxDate);				


                    //$d2.datepicker("setDate", selectedDate);
                    //$("#endDate").val(JSON.stringify([inst.selectedYear, inst.selectedMonth + 1, parseInt(inst.selectedDay), 0, 0, 0]));

                },
                onSelect: function (selectedDate, inst) {
                    $($d1.data("hidden")).val(JSON.stringify([inst.selectedYear, inst.selectedMonth + 1, parseInt(inst.selectedDay), 0, 0, 0]));
                }
            });

            // $($d1.data("hidden")).val(JSON.stringify([today.getFullYear(), today.getMonth() + 1, today.getDate(), 0, 0, 0]));

            $d2.datepicker({
                dateFormat: "dd-mm-yy",
                changeMonth: true,
                changeYear: true,
                //minDate: "+0d",
                //maxDate: "+3M",
                onSelect: function (selectedDate, inst) {
                    $($d2.data("hidden")).val(JSON.stringify([inst.selectedYear, inst.selectedMonth + 1, parseInt(inst.selectedDay), 0, 0, 0]));
                }
            });

            //$($d2.data("hidden")).val(JSON.stringify([today.getFullYear(), today.getMonth() + 1, today.getDate(), 23, 59, 59]));

            //$d1.datepicker("setDate", new Date());
            //$d2.datepicker("setDate", new Date().addDays(7));
            var aoColumns = [
                {
                    "mDataProp": "Deliveries",
                    bSortable: false
                },
                {
                    "mDataProp": "OrderNumber",
                    bSortable: false
                },
                {
                    "mDataProp": "DriverName",
                    bSortable: false
                },
                {
                    "mDataProp": "StrDateDelivery",
                    bSortable: false
                },
                {
                    "mDataProp": "ClientName",
                    bSortable: false
                },
                {
                    "mDataProp": "ZoneName",
                    bSortable: false
                },
                {
                    "mDataProp": "actions",
                    bSortable: false
                }
            ];
            if ($('#grid-orders').length > 0) {
                var table = $('#grid-orders').dataTable({
                    "sAjaxSource": window.path("Delivery/GetGenerateDeliveries"),
                    "columns": aoColumns,
                    "bFilter": true,
                    "bPaginate": true,
                    "paging": true,
                    "bDestroy": true,
                    "columnDefs": [
                        {
                            "targets": [6],
                            "render": function (oObj, type, row, meta) {
                                if ((row.logged_user_id == row.UserId || row.logged_user_id == 0)) {
                                    var d = $('<p>').append(
                                        $('<div>').addClass('btn-group btn-group-sm')
                                            .append($('<a>').addClass('btn btn-sm btn-default dropdown-toggle').attr('data-toggle', 'dropdown')
                                                .append(labels[culture].options)
                                                .append($('<span>').addClass('caret'))
                                            )
                                            .append($('<ul>').addClass('dropdown-menu pull-right').attr('role', 'menu')
                                                .append($('<li>').append($('<a href=\"/Delivery/EditDelivery?DeliveryId= ' + row.DeliverId + '\"></a>').text(labels[culture].edit_delivery)))
                                                .append($('<li>').append($('<a>').addClass('delete-delivery').attr('href', '#').attr('data-delivery', row.DeliverId).text(labels[culture].delete_delivery)))
                                            )
                                    );
                                    return d.html();
                                } else {
                                    var d = "";
                                    return d;
                                }

                            }
                        }
                    ],
                    "iDisplayLength": 10,
                    "bProcessing": true,
                    "bServerSide": true,
                    //"sPaginationType": "bootstrap",
                    "pagingType": "numbers",
                    "oLanguage": {
                        "sUrl": ["../../Content/data-tables/", culture, ".txt"].join("")
                    },
                    "fnInitComplete": function (oSettings, json) {
                        $('#grid-orders').dataTable().fnSetFilteringEnterPress();
                    },
                    "fnServerParams": function (aoData) {
                        if (_isFirsLoad == 1) {
                            d1 = $.datepicker.formatDate('yy-mm-dd', new Date($d1.datepicker('getDate')));
                            d2 = $.datepicker.formatDate('yy-mm-dd', new Date($d2.datepicker('getDate')));
                            name = $('#zoneName option:selected').val();
                            aoData.push({ "name": "initDate", "value": d1 });
                            aoData.push({ "name": "endDate", "value": d2 });
                            aoData.push({ "name": "zone_id", "value": name });
                        }

                    },
                    "bStateSave": true,
                    "stateLoadParams": function (oSettings, oData) {
                        if (_no_local_stored == -1) {
                            $d1.datepicker("setDate", new Date());
                            $d2.datepicker("setDate", new Date().addDays(7));
                        } else {
                            $d1.datepicker("setDate", new Date(oData.time));
                            var d1 = $.datepicker.formatDate('yy-mm-dd', new Date(oData.time).addDays(1));
                            $d1.datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", d1))
                            $d2.datepicker("setDate", new Date(oData.columns[6].search.search));
                            var d2 = $.datepicker.formatDate('yy-mm-dd', new Date(oData.columns[6].search.search).addDays(1));
                            $d2.datepicker("setDate", $.datepicker.parseDate("yy-mm-dd", d2))
                            $('#zoneName').val(oData.columns[5].search.search).change();
                        }
                    
                    },
                    "stateLoadCallback": function (settings, callback) {
                        if (localStorage.getItem("dataTables_filterSettings") != null) {
                            _isFirsLoad = 1;
                            _no_local_stored = 0;
                            callback(JSON.parse(localStorage.getItem("dataTables_filterSettings")));
                        } else {
                            _no_local_stored = -1;
                            callback(JSON.parse(localStorage.getItem("dataTables_filterSettings")));
                        }
                    },
                    "stateSaveParams": function (settings, data) {
                        // save the filter settings without connecting it to a unique url
                        if (_no_local_stored != -1) {
                            d1 = $.datepicker.formatDate('yy-mm-dd', new Date($d1.datepicker('getDate')));
                            d2 = $.datepicker.formatDate('yy-mm-dd', new Date($d2.datepicker('getDate')));
                            data.columns[5].search.search = $('#zoneName option:selected').val();
                            data.columns[6].search.search = d2;
                            data.time = d1;
                            localStorage.setItem("dataTables_filterSettings", JSON.stringify(data));
                        }
                    },
                    fnDrawCallback: function () {
                        bindGridActions();
                        hideLoading();
                    }
                });
            }
            bindGridActions();
            $("#searchDelivery").click(function () {
                _isFirsLoad = 1;
                _no_local_stored = 0,
                    table.fnDraw();
            });

            function updateDataFilter() {
                var stored = JSON.parse(localStorage.getItem("dataTables_filterSettings"));
            }
        };







    return {
        init: function () {
            labels = new Labels();
            culture = "es";
            showLoading();
            $.ajax({
                url: ' ../../Zones/GetZoneList',
                type: 'GET',
                dataType: 'json',
                cache: false,
                data: {},
                success: (function (response) {
                    if (response.result != null) {
                        for (var i = 0; i < response.result.items.length; i++) {
                            $("#zoneName").append("<option value = " + response.result.items[i].Id + ">" + response.result.items[i].name + "</option>");
                        }
                        hideLoading();
                    }
                    draw_orders_grid();
                }),
            });
            $(document).ready(function () {
            });
        }
    };

}(__lbs.delivery || {}));
Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}