__lbs.delivery_itinerary = (function (lbs, delivery_itinerary) {

    var
        labels,
        _StringArray,
        culture,
        calendarInit,
        isInit = 0,

        init = function () {
            $('.zone_filter').select2({
                ajax: {
                    url: '../../Zones/GetSearchZones',
                    dataType: 'json',
                    data: function (params) {
                        return {
                            name: params.term // search term
                        };
                    },
                    processResults: function (data, params) {
                        return {
                            results: data.result
                        };
                    },
                    cache: true,
                },
                placeholder: 'Zona',
                minimumInputLength: 3,
                maximumSelectionLength: 1,
                language: "es"
            });
            $('.user_filter').select2({
                ajax: {
                    url: '../../Users/GetSearchUsers',
                    dataType: 'json',
                    data: function (params) {
                        return {
                            name: params.term // search term
                        };
                    },
                    processResults: function (data, params) {
                        return {
                            results: data.result
                        };
                    },
                    cache: true,
                },
                placeholder: 'Usuario',
                minimumInputLength: 3,
                maximumSelectionLength: 1,
                language: "es"
            });
            $('.order_filter').select2({
                ajax: {
                    url: '../../Delivery/GetSearchOrders',
                    dataType: 'json',
                    data: function (params) {
                        return {
                            name: params.term // search term
                        };
                    },
                    processResults: function (data, params) {
                        return {
                            results: data.result
                        };
                    },
                    cache: true,
                },
                placeholder: 'Orden',
                minimumInputLength: 3,
                maximumSelectionLength: 1,
                language: "es"
            });
            $('.client_name_filter').select2({
                ajax: {
                    url: '../../Users/GetSearchClients',
                    dataType: 'json',
                    data: function (params) {
                        return {
                            name: params.term // search term
                        };
                    },
                    processResults: function (data, params) {
                        return {
                            results: data.result
                        };
                    },
                    cache: true,
                    allowClear: true,
                },
                placeholder: 'Nombre Cliente',
                minimumInputLength: 3,
                maximumSelectionLength: 1,
                language: culture
            });
            $('.driver_filter').select2({
                ajax: {
                    url: '../../Users/GetSearchDrivers',
                    dataType: 'json',
                    data: function (params) {
                        return {
                            name: params.term // search term
                        };
                    },
                    processResults: function (data, params) {
                        return {
                            results: data.result
                        };
                    },
                    cache: true,
                },
                placeholder: 'Chofer',
                minimumInputLength: 3,
                maximumSelectionLength: 1,
                language: "es"
            });
            calendarInit = -1;
            if ($context.loggedUser.id != 0) {
                $('.user_filter').parent().hide();
            }

            $d1 = $(".datepicker:eq(0)");
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

                    //$d2.datepicker("option", "minDate", selectedDate);
                    //$d2.datepicker("option", "maxDate", newMaxDate > today ? today : newMaxDate);				


                    //$d2.datepicker("setDate", selectedDate);
                    //$("#endDate").val(JSON.stringify([inst.selectedYear, inst.selectedMonth + 1, parseInt(inst.selectedDay), 0, 0, 0]));

                },
                onSelect: function (selectedDate, inst) {
                    $($d1.data("hidden")).val(JSON.stringify([inst.selectedYear, inst.selectedMonth + 1, parseInt(inst.selectedDay), 0, 0, 0]));
                }
            });

            $($d1.data("hidden")).val(JSON.stringify([today.getFullYear(), today.getMonth() + 1, today.getDate(), 0, 0, 0]));

            $d1.datepicker("setDate", new Date());

            calendarInformation(getQueryString());

            $("#searchDelivery").click(function () {
                calendarInformation(getQueryString());
            });
        },


        getQueryString = function () {
            var zone = $('.zone_filter').val();
            var user = $('.user_filter').val();
            if ($('.order_filter').select2('data').length != 0) {
                var order = $('.order_filter').select2('data')[0].id;
            }
            if ($('.client_name_filter').select2('data').length != 0) {
                var name = $('.client_name_filter').select2('data')[0].text;
            }
            var driver = $('.driver_filter').val();
            var date = $.datepicker.formatDate('yy-mm-dd', new Date($d1.datepicker('getDate')));
            var parameters = "?";
            if (zone) parameters += "zoneId=" + zone + "&";
            if ($context.loggedUser.id == 0) {
                if (user) parameters += "userId=" + user + "&";
            } else {
                user = $context.loggedUser.id;
                parameters += "userId=" + user + "&";
            }
            if (order) parameters += "orderId=" + order + "&";
            if (name) parameters += "clientName=" + name.replace(" ", "%20") + "&";
            if (driver) parameters += "driverId=" + driver + "&";
            if (date) parameters += "fecha=" + date + "&";
            parameters = parameters.substr(0, parameters.length - 1);
            console.log(parameters);
            calendarInit = 1;
            return parameters;
        },
        calendarInformation = function (params) {
            showLoading();
            $.ajax({
                url: '../../Delivery/GetIteneraryDeliveries' + params,
                type: 'GET',
                dataType: 'json',
                cache: false,
                data: {},
                success: (function (response) {
                    if (response.result != null) {
                        if (response.result.has_items) {
                            initCalendar(response.result.items);
                        } else {
                            alert('No se encontraron resultados');
                            hideLoading();
                        }
                    } else if (response.result.user == null) {
                        var layers = featureGroup._layers;
                        $.each(layers, function (layer) {
                            if (layer != e.target._leaflet_id.toString()) {
                                map.removeLayer(featureGroup._layers[parseInt(layer)]);
                            }
                        });
                        $("#ZoneInformation").hide();
                        $("#driver_user_Id").val("");
                        $("#driver_user_First_Name").val("");
                        $("#driver_user_Last_Name").val("");
                        $("#driver_zone_name").val("");
                        $("#driver_zone_Id").val("");
                    }
                }),
            });
        },

        initCalendar = function (Calendar) {
            if (calendarInit != -1) {
                $('#calendar').fullCalendar('destroy');
            }
            $('#calendar').fullCalendar({
                height: 400,
                hiddenDays: [7, 0], // hide Mondays, Wednesdays, and Fridays
                aspectRatio: 1,
                lang: 'es',
                timeFormat: 'H(:mm)',
                allDaySlot: false,
                minTime: '09:45:00',
                maxTime: '20:15:00',
                allDaySlot: false,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek',
                },
                slotDuration: "00:15:00",
                slotEventOverlap: false,
                defaultView: 'month',
                stick: true,
                events:
                    $.map(Calendar, function (item, i) {
                        var dateNow = new Date;
                        var event = new Object();
                        event.id = item.DeliverId;
                        var dateDelivery = item.StrDateDelivery.split(" ");
                        var dateFormat = $.datepicker.formatDate('yy-mm-dd', new Date(dateDelivery[0].split("/").reverse().join("/")));
                        event.start = new Date(dateFormat.concat(" ").concat(dateDelivery[1]));
                        event.end = new Date(dateFormat.concat(" ").concat(item.StrTimeEndDelivery));
                        event.title = item.ClientName;
                        event.editable = false;
                        event.allDay = false;
                        event.textColor = 'black'
                        if (item.status == 1 && dateNow <= event.start) {
                            event.color = '#C1B9B9'; //procesados
                        } else if (item.status == 2) {
                            event.color = '#84E47D'//Entregados
                        } else if (item.status == 3) {
                            event.color = '#F5E85C';//retrasado,parcialmente entregado
                        } else if (item.staus == 4 || event.start <= dateNow) {
                            event.color = '#F34C63';//NO entregado
                        }
                        $('#calendar').fullCalendar('renderEvent', event);
                        hideLoading();
                        return event;

                    }),
                eventClick: function (calEvent, jsEvent, view) {
                    GetDeliveryInfo(calEvent, jsEvent, view);

                }

            })
            if (calendarInit != -1) {
                $('#calendar').fullCalendar('gotoDate', $.datepicker.formatDate('yy-mm-dd', new Date($d1.datepicker('getDate'))));
                //$('#calendar').fullCalendar('changeView', 'agendaDay', {
                //    start: $.datepicker.formatDate('yy-mm-dd', new Date($d1.datepicker('getDate'))),
                //    end: '2018-06-05'
                //});
            }

        },
        GetDeliveryInfo = function (calEvent, jsEvent, view) {
            showLoading();
            $.ajax({
                url: ' ../../Delivery/GetDeliveryInfoDispatched',
                type: 'GET',
                dataType: 'json',
                cache: false,
                data: { orderId: calEvent.id },
                success: (function (response) {
                    hideLoading();
                    if (response.result != null) {
                        $("#client_ClientName").val(response.result.client.ClientName);
                        $("#client_PhoneNumber").val(response.result.client.PhoneNumber);
                        $("#client_City").val(response.result.client.City);
                        $("#client_Address").val(response.result.client.Address);
                        $("#client_CellPhoneNumber").val(response.result.client.CellPhoneNumber);
                        $("#client_email").val(response.result.client.email);
                        $("#client_SellerName").val(response.result.client.SellerName);
                        $("#Deliveries").val(response.result.Deliveries);
                        $("#driver_user_First_Name").val(response.result.driver.user.First_Name);
                        $("#driver_user_Last_Name").val(response.result.driver.user.Last_Name);
                        //$("#driver_zone_name").val(response.result.driver.zone.name);
                        //$("#driver_zone_Id").val(response.result.driver.zone.Id);
                        $("#ReferenceAddress").val(response.result.ReferenceAddress);
                        $("#ReceptorName").val(response.result.ReceptorName);
                        $("#Observations").val(response.result.Observations);
                        $("#StrDateHourDeliveryReception").val(response.result.StrDateHourDeliveryReception);
                    }
                    var aoColumns = [
                        {
                            "mDataProp": "ItemId",
                            bSortable: false
                        },
                        {
                            "mDataProp": "ProductCode",
                            bSortable: false
                        },
                        {
                            "mDataProp": "ProductName",
                            bSortable: false
                        },
                        {
                            "mDataProp": "quantity",
                            bSortable: false
                        },
                        {
                            "mDataProp": "Status",
                            bSortable: false
                        },
                    ];
                    if ($('#grid-users').length > 0) {
                        var table;
                        if (isInit == 0) {
                            table = $('#grid-users').dataTable({
                                "bFilter": false,
                                "bPaginate": true,
                                "bInfo": false,
                                "aoColumns": aoColumns,
                                "bDestroy": true,
                                "aoColumnDefs": [{
                                    "aTargets": [4],
                                    "mRender": function (date, type, full) {
                                        return (full.Status == false)
                                            ? "No entregado"
                                            : "Entregado";
                                    },
                                }],
                                "paging": true,
                                "oLanguage": {
                                    "sUrl": ["../../Content/data-tables/", culture, ".txt"].join("")
                                },
                                "fnInitComplete": function (oSettings, json) {
                                },
                            }).fnAddData(response.result.ListProducts);
                            initMapLeaftlet(response.result);
                        } else {
                            var table = $('#grid-users').dataTable();
                            table.fnClearTable();
                            table.fnAddData(response.result.ListProducts);
                            initMapLeaftlet(response.result);
                        }
                        isInit = 1;
                    }

                }),
            });
        },
        initMapLeaftlet = function (data) {
            if (isInit == 0) {
                map = L.map('map');
                mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; ' + mapLink + ' Contributors',
                    maxZoom: 18
                }).addTo(map);
            } else {

            }
            var points = data.driver.zone.Polygon;
            var featureGroup = L.featureGroup().addTo(map);
            map.eachLayer(function (layer) {
                if (layer._latlngs != undefined) {
                    map.removeLayer(layer)
                }
                if (layer._latlng != undefined) {
                    map.removeLayer(layer)
                }
            });
            if (points != "") {
                polygon = JSON.parse(points);
                var polyline = L.polyline(polygon).addTo(featureGroup);
                map.fitBounds(polyline.getBounds());
                L.marker([data.dlat, data.dlng]).addTo(map).bindPopup('<strong>Dirección Planificada</strong>').openPopup();
                L.marker([data.deliverylat, data.deliverylng]).addTo(map).bindPopup('<strong>Dirección de Entrega</strong>').openPopup();
                map.setView([data.dlat, data.dlng], 12);
            }
        };



    return {
        init: function () {
            labels = new Labels();
            culture = "es";
            init();
            //initMapLeaftlet();
        }
    };

}(__lbs.delivery_itinerary || {}));