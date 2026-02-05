__lbs.delivery_edit = (function (lbs, delivery_edit) {
    var
        labels,
        _StringArray,
        culture,
        _addDate = "0",
        isMapIniti,
        _countItem = 0,
        _idItem = 0,
        _evetEdit = 0,
        _eventInfo,
        _eventExist = 0,
        _changeZone = 0,
        _dateEdit,

        init = function () {
            showLoading();
            $("#map").hide();


            var id = $("#DeliveryId").val();
            $('#loadingmessage').show();

            $.ajax({
                url: ' ../../Delivery/GetDeliveryInfo',
                type: 'GET',
                dataType: 'json',
                cache: false,
                data: { orderId: id },
                success: (function (response) {
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
                        $("#driver_zone_name").val(response.result.driver.zone.name);
                        $("#driver_zone_Id").val(response.result.driver.zone.Id);
                        $("#driver_user_Id").val(response.result.driver.user.Id);
                        initDriverSelect(1);
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
                            "mDataProp": "quantityD",
                            bSortable: false,
                            "sClass": "statusItem",
                            "mRender": function (date, type, full) {
                                //var id = _countItem + 1;
                                if (type != "type") {
                                    if (_idItem != 0) {
                                        _countItem++;
                                    }
                                    _idItem = full.ItemId;
                                }
                                //var quantityD = (full.quantityD == -1) ? full.quantity : full.quantityD;
                                return (full.quantity > 1)
                                    ? '<input id="ListProducts_' + _countItem + '" type="number" autocomplete="off" name="intervalTime" class="form-control" min="1" max="' + full.quantity + '" value="' + full.quantityD + '" />'
                                    : '<input id="ListProducts_' + _countItem + '" type="number" autocomplete="off" readonly name="intervalTime" class="form-control" min="1" max="' + full.quantity + '" value="' + full.quantityD + '" />';
                            },
                        },
                        {
                            "mDataProp": "Status",
                            bSortable: false,
                            "mRender": function (date, type, full) {
                                return (full.Status == false)
                                    ? "No entregado"
                                    : "Entregado"
                            },
                        },
                        {
                            "mDataProp": "Dispatched",
                            bSortable: false,
                            "sClass": "statusItem",
                            "mRender": function (date, type, full) {
                                return (full.Dispatched == false)
                                    ? '<input id="ListProducts_' + _countItem + '" type="checkbox" value="' + full.Dispatched + '" class="itemCheck">'
                                    : '<input id="ListProducts_' + _countItem + '" type="checkbox" value="' + full.Dispatched + '" class="itemCheck"  checked="checked">';
                                ListProducts[j].Dispatched
                            },
                        },
                    ];
                    if ($('#grid-users').length > 0) {
                        var table;
                        table = $('#grid-users').dataTable({
                            "bFilter": false,
                            "bPaginate": false,
                            "bInfo": false,
                            "aoColumns": aoColumns,
                            "bDestroy": true,
                            "paging": false,
                            "oLanguage": {
                                "sUrl": ["../../Content/data-tables/", culture, ".txt"].join("")
                            },
                            "fnInitComplete": function (oSettings, json) {
                            },
                        }).fnAddData(response.result.ListProducts);
                        hideLoading();
                        initMapLeaftlet(response.result);

                    }
                    var theParent = $("#grid-users").find("td.statusItem");
                    var elements = theParent.find("input");
                    var elementsTxt = elements.filter('.form-control');
                    for (var i = 0; i < elements.length; i++) {
                        var childElement = $(elements[i]);
                        childElement.click(onClickItem);
                        childElement.off('keyup keydown keypress');
                        childElement.bind('keypress', function (e) {
                            e.preventDefault();
                        });
                    }
                    for (var i = 0; i < elementsTxt.length; i++) {
                        elementsTxt[i].value
                        //$("#" + elementsTxt[i].id + "__quantity").val($(e.currentTarget).val());
                    }
                }),

            });
        },
        onClickItem = function (e) {
            if ($(e.currentTarget).hasClass('form-control')) {
                $("#" + e.currentTarget.id + "__quantityD").val($(e.currentTarget).val());
            } else {
                if ($(e.currentTarget).is(':checked') == true) {
                    $("#" + e.currentTarget.id + "__Dispatched").val("true")
                } else {
                    $("#" + e.currentTarget.id + "__Dispatched").val("false")
                }
            }

            e.stopPropagation();
            if (ShowLoginButton() && $('#dateDelivery').val() != "")
                $('#SaveDelivery').show();
            else
                $('#SaveDelivery').hide();
        },
        ShowLoginButton = function () {
            var elements = $('#grid-users').children("tbody").children().length;
            for (i = 0; i <= elements; i++) {
                if ($("#ListProducts_" + i + "__Dispatched").val() == "True")
                    return true
                else continue;
            };
            return false;
        },
        initDriverSelect = function (firstLoad) {
            var zoneId = parseInt($("#driver_zone_Id").val());
            $('.driver_filter').select2({
                ajax: {
                    url: '../../Users/GetAllDriversZone',
                    dataType: 'json',
                    data: { zoneId: zoneId },
                    processResults: function (data) {
                        // Tranforms the top-level key of the response object from 'items' to 'results'
                        return {
                            results: data.result
                        };
                    }
                },
                placeholder: 'Chofer',
                minimumInputLength: 0,
                maximumSelectionLength: 1,
                language: "es"
            });
            //$('.driver_filter').val('').trigger('change');
            if (firstLoad == 1) {
                $('.driver_filter').append($("<option/>", {
                    value: $("#driver_user_Id").val(),
                    text: $("#driver_user_First_Name").val() + ' ' + $("#driver_user_Last_Name").val(),
                    selected: true
                }));
                var parameters = "?";
                var driver = $("#driver_user_Id").val();
                if (driver) parameters += "driverId=" + driver + "&";
                parameters = parameters.substr(0, parameters.length - 1);
                $("#driver_user_Id").val(driver);
                getDeliveriesDriver(parameters);
            }

            var zoneId = parseInt($("#driver_zone_Id").val());
            $('.driver_filter').select2({
                ajax: {
                    url: '../../Users/GetAllDriversZone',
                    dataType: 'json',
                    data: { zoneId: zoneId },
                    processResults: function (data) {
                        // Tranforms the top-level key of the response object from 'items' to 'results'
                        return {
                            results: data.result
                        };
                    }
                },
                placeholder: 'Chofer',
                minimumInputLength: 0,
                maximumSelectionLength: 1,
                language: "es"
            });
            //$('.driver_filter').val('').trigger('change');
            $('#driverInfo').show
            $('.driver_filter').on("select2:select", function (e) {
                var parameters = "?";
                var driver = $('.driver_filter').val();
                if (driver) parameters += "driverId=" + driver + "&";
                parameters = parameters.substr(0, parameters.length - 1);
                $("#driver_user_Id").val(driver);
                _changeZone = 1;
                showLoading();
                getDeliveriesDriver(parameters);
            });
        },
        getDeliveriesDriver = function (params) {
            $.ajax({
                url: '../../Delivery/GetIteneraryDeliveries' + params,
                type: 'GET',
                dataType: 'json',
                cache: false,
                data: {},
                success: (function (response) {
                    if (response.result != null) {
                        if (response.result.has_items) {
                            hideLoading();
                            $('#calendar').fullCalendar('destroy');
                            _changeZone = 1;
                            initCalendar(response.result.items);
                        } else {
                            $('#calendar').fullCalendar('destroy');
                            _changeZone = 1;
                            hideLoading();
                            initCalendar(response.result.items);
                        }
                    }
                }),
            });
        }
        initCalendar = function (Calendar) {
        _evetEdit = 0;
        var currentDateEvent = null;
        if (ShowLoginButton())
            $('#SaveDelivery').show();
        else $('#SaveDelivery').hide();
        $('#calendar').fullCalendar({
            height: 250,
            hiddenDays: [7, 0], // hide Mondays, Wednesdays, and Fridays
            aspectRatio: 0.2,
            lang: 'es',
            timeFormat: 'H(:mm)',
            allDaySlot: false,
            minTime: '09:45:00',
            maxTime: '20:15:00',
            allDaySlot: false,
            slotDuration: "00:15:00",
            slotEventOverlap: false,
            eventOverlap: function (stillEvent, movingEvent) {
                var features = $context.loggedUser.features;
                if (features.find(x => x === 'DELI0005') != undefined) {
                    return true;
                } else return false;
            },
            snapDuration: "00:45:00",
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'agendaWeek',
            },
            defaultView: 'agendaWeek',
            stick: true,
            events:
                $.map(Calendar, function (item, i) {
                    _addDate = 0;
                    var dateNow = new Date;
                    var event = new Object();
                    event.id = item.DeliverId;
                    var dateDelivery = item.StrDateDelivery.split(" ");
                    var dateFormat = $.datepicker.formatDate('yy-mm-dd', new Date(dateDelivery[0].split("/").reverse().join("/")));
                    event.start = new Date(dateFormat.concat(" ").concat(dateDelivery[1]));

                    var dateDeliveryEnd = item.StrTimeEndDelivery;
                    event.end = new Date(dateFormat.concat(" ").concat(dateDeliveryEnd));


                    //////////////cambios para consulta de horarios

                    var data = [];

                    //Reference the Table.
                    var grid = document.getElementById("grid-users");
                    var rows = grid.rows;
                    //Reference the CheckBoxes in Table.
                    var checkBoxes = grid.getElementsByTagName("INPUT");

                    //Loop through the CheckBoxes.
                    var j = 1;
                    for (var i = 1; i < rows.length; i++) {
                        if (checkBoxes[j].checked) {
                            data.push([rows[i].cells[1].innerHTML, rows[i].cells[3].innerHTML]);
                        }
                        j = j + 2;
                    }

                    function TraeInfo(codMaterial, cantidad) {
                        var resultado = "";
                        $.ajax({
                            async: false, //Esta es la clave.
                            url: ' ../../Delivery/Horarios',
                            type: 'GET',
                            dataType: 'json',
                            cache: false,
                            data: { codMaterial: codMaterial },
                            success: (function (response) {
                                resultado = "x";
                                if (response.result != null) {

                                    if (cantidad == "1") {
                                        resultado = response.result.Horarios1;
                                    }
                                    else {
                                        resultado = response.result.Horarios2;
                                    }
                                } else if (response.result == null) {
                                    resultado = "0";
                                }
                            }),
                        });

                        return resultado;
                    }

                    var retorno = 0;
                    for (var i = 0; i < data.length; i++) {
                        /* var aux = parseInt(TraeInfo(data[i][0], data[i][1]));
                         retorno = retorno + aux;*/
                        var band = TraeInfo(data[i][0], data[i][1]);
                        if (band != null) {
                            retorno += parseInt(band);
                        }
                    }
                    //   alert(data[0][0] + "-----" + data[0][1]);
                    //   alert(aux);
                    var duracion = 45;
                    if (retorno != 0) {

                        if (retorno == 2) {
                            duracion = 90;
                        }
                        if (retorno >= 3) {
                            duracion = 135;
                        }
                    }
                    if (event.end == null || event.end == "") {
                        endTime = addMinutesToTime(dateDelivery[1], duracion);
                        event.end = endTime;
                    }


                   // event.end = new Date(dateFormat.concat(" ").concat(item.StrTimeEndDelivery));
                    event.title = item.ClientName;
                    event.editable = false;
                    event.allDay = false;
                    var id = $("#DeliveryId").val();
                    if (item.DeliverId == id) {
                        _eventExist = 1;
                        _changeZone = 0;
                        event.editable = true;
                        event.droppable = true;
                        _evetEdit = 1;
                        currentDateEvent = event.start;
                        var timeSend = event.start.toTimeString().split(" ")
                        var date = dateFormat.concat(" ").concat(timeSend[0]);
                        $('#dateDelivery').val(date);


                        //Guardar el valor de end date en la variable para la modificación 

                        var timeSend2 = event.end.toTimeString().split(" ")
                        var date2 = dateFormat.concat(" ").concat(timeSend2[0]);
                        $('#EndDelivery').val(date2);


                /*        if (dateDeliveryEnd.length == 7) {
                            dateDeliveryEnd = "0"+dateDeliveryEnd;
                        }


                        $('#EndDelivery').val(dateFormat.concat(" ").concat(dateDeliveryEnd));*/



                        _dateEdit = date;
                        _eventInfo = event;
                    }
                    $('#calendar').fullCalendar('renderEvent', event);
                    return event;

                }),
            eventClick: function (calEvent, jsEvent, view) {
                $('#modalTitle').html("Entrega a: " + calEvent.title);
                var date = new Date(calEvent.start.format().replace("T", " "))
                $('#modalBody').html("Fecha y Hora de Entrega: " + date.toLocaleString());
                $('#fullCalModal').modal();

            },
            dayClick: function (date, jsEvent, view) {

                if (_addDate == "0" && _evetEdit == 0) {
                    var mydate = date.format().split("T");
                    var initialDay = $.datepicker.formatDate('yy-mm-dd', new Date(date.format()));
                    var dateCompare = new Date(initialDay.concat(" ").concat(mydate[1]));
                    if (dateCompare < new Date()) {
                        $('#modalTitle').html("Número de Pedido");
                        $('#modalBody').html("No se pueden agregar eventos para días anteriores");
                        $('#fullCalModal').modal();
                        return;
                    }


                    //////////////cambios para consulta de horarios

                    var data = [];

                    //Reference the Table.
                    var grid = document.getElementById("grid-users");
                    var rows = grid.rows;
                    //Reference the CheckBoxes in Table.
                    var checkBoxes = grid.getElementsByTagName("INPUT");

                    //Loop through the CheckBoxes.
                    var j = 1;
                    for (var i = 1; i < rows.length; i++) {
                        if (checkBoxes[j].checked) {
                            data.push([rows[i].cells[1].innerHTML, rows[i].cells[3].innerHTML]);
                        }
                        j = j + 2;
                    }

                    function TraeInfo(codMaterial, cantidad) {
                        var resultado = "";
                        $.ajax({
                            async: false, //Esta es la clave.
                            url: ' ../../Delivery/Horarios',
                            type: 'GET',
                            dataType: 'json',
                            cache: false,
                            data: { codMaterial: codMaterial },
                            success: (function (response) {
                                resultado = "x";
                                if (response.result != null) {

                                    if (cantidad == "1") {
                                        resultado = response.result.Horarios1;
                                    }
                                    else {
                                        resultado = response.result.Horarios2;
                                    }
                                } else if (response.result == null) {
                                    resultado = "0";
                                }
                            }),
                        });

                        return resultado;
                    }

                    var retorno = 0;
                    for (var i = 0; i < data.length; i++) {
                        /* var aux = parseInt(TraeInfo(data[i][0], data[i][1]));
                         retorno = retorno + aux;*/
                        var band = TraeInfo(data[i][0], data[i][1]);
                        if (band != null) {
                            retorno += parseInt(band);
                        }
                    }
                    //   alert(data[0][0] + "-----" + data[0][1]);
                    //   alert(aux);
                    var duracion = 45;
                    if (retorno == 2) {
                        duracion = 90;
                    }
                    if (retorno >= 3) {
                        duracion = 135;
                    }
                    endTime = addMinutesToTime(dateDelivery[1], duracion);

                    //// Agregar prohibir franja horaria

                    ///franja prohibida de la mañana
                    var Franja = "SI";
                    if (dateCompare.getMinutes() == "45" && dateCompare.getHours() == "12" && duracion >= 45) {
                        Franja = "NO";
                    }
                    if (dateCompare.getHours() == "12" && duracion >= 90) {
                        Franja = "NO";
                    }
                    if ((dateCompare.getHours() == "12" || dateCompare.getHours() == "11") && duracion >= 135) {
                        Franja = "NO";
                    }

                    if (Franja == "NO") {
                        $('#modalTitle').html("Número de Pedido");
                        $('#modalBody').html("No se pueden agendar entregas en la Franja horaria de 12:45 a 13:30 la duración de su pedido es: " + duracion + " minutos.");
                        $('#fullCalModal').modal();
                        return;
                    }

                    ///franja prohibida de la tarde

               /*     if (dateCompare.getMinutes() == "45" && dateCompare.getHours() == "18" && duracion >= 45) {
                        Franja = "NO";
                    }
                    if (dateCompare.getHours() == "18" && duracion >= 90) {
                        Franja = "NO";
                    }
                    if ((dateCompare.getHours() == "18" || dateCompare.getHours() == "17") && duracion >= 135) {
                        Franja = "NO";
                    }

                    if (Franja == "NO") {
                        $('#modalTitle').html("Número de Pedido");
                        $('#modalBody').html("No se pueden agendar entregas en la Franja horaria de 18:45 a 19:30 la duración de su pedido es: " + duracion + " minutos.");
                        $('#fullCalModal').modal();
                        return;
                    }*/

                        ///////////////////////




                    /*

                    if (dateCompare.getHours() == "12" && dateCompare.getMinutes() == "45") {
                        $('#modalTitle').html("Número de Pedido");
                        $('#modalBody').html("No se pueden agendar entregas de 12:45 a 13:30vvvvvv");
                        $('#fullCalModal').modal();
                        return;
                    }
                    if (dateCompare.getHours() == "18" && dateCompare.getMinutes() == "45") {
                        $('#modalTitle').html("Número de Pedido");
                        $('#modalBody').html("No se pueden agendar entregas de 18:45 a 19:30vvvvvvv");
                        $('#fullCalModal').modal();
                        return;
                    }
                    */



                    $('#Title').html("Agendar Entrega");
                    var clientName = $('#client_ClientName').val()
                    var dateDelivery = date.format().split("T");


                    var event = new Object();
                    event.id = "0000";
                    var dateFormat = $.datepicker.formatDate('yy-mm-dd', new Date(date.format()));
                    endTime = addMinutesToTime(dateDelivery[1], 45);
                    event.start = new Date(dateFormat.concat(" ").concat(dateDelivery[1]));
                    event.end = new Date(dateFormat.concat(" ").concat(endTime));
                    event.title = clientName;
                    event.editable = true;
                    event.allDay = false;
                    $('#calendar').fullCalendar('renderEvent', event, true);
                    _addDate = "1";
                    $('#dateDelivery').val(dateFormat.concat(" ").concat(dateDelivery[1]));
                    if (ShowLoginButton())
                        $('#SaveDelivery').show();
                } else {
                    if (ShowLoginButton())
                        $('#SaveDelivery').show();
                    $('#modalTitle').html("Agendar Entrega");
                    $('#modalBody').html("Arrastre el evento agendado para moverlo");
                    $('#fullCalModal').modal();
                }

            }, eventDrop: function (event, delta, revertFunc) {
                var dateCompare = new Date(event.start.format('YYYY-MM-DD HH:mm:ss'));
                if (dateCompare < new Date()) {
                    $('#modalTitle').html("Número de Pedido");
                    $('#modalBody').html("No se pueden agregar eventos para días anteriores");
                    $('#fullCalModal').modal();
                    revertFunc();
                    return;
                }


                //// Agregar prohibir franja horaria
                var aux = new Date(event.end.format('YYYY-MM-DD HH:mm:ss'));
                var duracion = aux - dateCompare;
                duracion = (duracion / 60) / 1000;
                //alert(duracion);

                ///franja prohibida de la mañana
                var Franja = "SI";
                if (dateCompare.getMinutes() == "45" && dateCompare.getHours() == "12" && duracion >= 45) {
                    Franja = "NO";
                }
                if (dateCompare.getHours() == "12" && duracion >= 90) {
                    Franja = "NO";
                }
                if ((dateCompare.getHours() == "12" || dateCompare.getHours() == "11") && duracion >= 135) {
                    Franja = "NO";
                }

                if (Franja == "NO") {
                    $('#modalTitle').html("Número de Pedido");
                    $('#modalBody').html("No se pueden agendar entregas en la Franja horaria de 12:45 a 13:30 la duración de su pedido es: " + duracion + " minutos.");
                    $('#fullCalModal').modal();
                    revertFunc();
                    return;
                }

                ///franja prohibida de la tarde

            /*    if (dateCompare.getMinutes() == "45" && dateCompare.getHours() == "18" && duracion >= 45) {
                    Franja = "NO";
                }
                if (dateCompare.getHours() == "18" && duracion >= 90) {
                    Franja = "NO";
                }
                if ((dateCompare.getHours() == "18" || dateCompare.getHours() == "17") && duracion >= 135) {
                    Franja = "NO";
                }

                if (Franja == "NO") {
                    $('#modalTitle').html("Número de Pedido");
                    $('#modalBody').html("No se pueden agendar entregas en la Franja horaria de 18:45 a 19:30 la duración de su pedido es: " + duracion + " minutos.");
                    $('#fullCalModal').modal();
                    revertFunc();
                    return;
                }*/

                        ///////////////////////

/*
                if (dateCompare.getHours() == "12" && dateCompare.getMinutes() == "45") {
                    $('#modalTitle').html("Número de Pedido");
                    $('#modalBody').html("No se pueden agendar entregas de 12:45 a 13:30bbbbbbb");
                    $('#fullCalModal').modal();
                    return;
                }
                if (dateCompare.getHours() == "18" && dateCompare.getMinutes() == "45") {
                    $('#modalTitle').html("Número de Pedido");
                    $('#modalBody').html("No se pueden agendar entregas de 18:45 a 19:30bbbbbbb");
                    $('#fullCalModal').modal();
                    return;
                }
                */



                var dateDelivery = event.start.format('YYYY-MM-DD HH:mm:ss');
                dateDelivery = dateDelivery.split(" ");
                var dateFormatDrop = $.datepicker.formatDate('yy-mm-dd', new Date(event.start.format()));
                var date = dateFormatDrop.concat(" ").concat(dateDelivery[1]);
                $('#dateDelivery').val(date);
//nuevo campo al mover el calendario guardar el end delivery
                var dateFormatDropE = $.datepicker.formatDate('yy-mm-dd', new Date(event.end.format()));
                var arrE = event.end.format().split('T');
                var dateE = dateFormatDropE.concat(" ").concat(arrE[1]);
                //"2020-09-05 2020-09-05T10:30:00"
                $('#EndDelivery').val(dateE);
            }
        })
        if ((_eventExist == 1) && (_changeZone == 1)) {
            $('#dateDelivery').val(_dateEdit);
            _changeZone = 0;
            currentDateEvent = _eventInfo.start;
            $('#calendar').fullCalendar("renderEvent", _eventInfo, true);
        };
        if (currentDateEvent != null) {
            $('#calendar').fullCalendar('gotoDate', currentDateEvent);
        }

    },
        initMapLeaftlet = function (data) {
            $("#map").show();
            map = L.map('map');
            mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: 18
            }).addTo(map);


            //var geocoder = new google.maps.Geocoder();
            //function googleGeocoding(text, callResponse) {
            //    geocoder.geocode({ address: text }, callResponse);
            //}


            function formatJSON(rawjson) {
                var json = {},
                    key, loc, disp = [];
                for (var i in rawjson) {
                    key = rawjson[i].formatted_address;

                    loc = L.latLng(rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng());

                    json[key] = loc;	//key,value format
                }
                return json;
            }
            map.addControl(new L.Control.Search({
                //sourceData: googleGeocoding,
                //formatData: formatJSON,
                url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat', 'lon'],
                markerLocation: false,
                autoType: true,
                autoCollapse: true,
                minLength: 2,
                zoom: 25
            }));
            var points = data.driver.zone.Polygon;
            var featureGroup = L.featureGroup().addTo(map);

            if (points != "") {
                //polygon = JSON.parse(points);
                //var polyline = L.polyline(polygon).addTo(featureGroup);
                //map.fitBounds(polyline.getBounds());
                marker = new L.marker([data.dlat, data.dlng], { draggable: 'true' }).addTo(map);
                var a = [data.dlng, data.dlat].join(' ');
                showLoading();
                $.ajax({
                    url: ' ../../Delivery/GetZoneByPoint',
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    data: { point: a },
                    success: (function (response) {
                        if (response.result != null) {
                            if (response.result.Polygon != null) {
                                $("#lng").val(data.dlng);
                                $("#lat").val(data.dlat);
                                $("#ZoneInformation").show();
                                $("#driver_zone_Id").val(response.result.Id);
                                $("#driver_zone_name").val(response.result.name);
                                var polygon = response.result.Polygon;
                                polygon = JSON.parse(polygon);
                                var polyline = L.polyline(polygon).addTo(featureGroup);
                                map.fitBounds(polyline.getBounds());
                                //marker = new L.marker([data.dlat, data.dlng], { draggable: 'true' }).addTo(map);
                            }
                            hideLoading();
                            initDriverSelect(0);
                            //initCalendar(response.result.Calendar);
                        }
                    }),
                });
            }

            var featureGroup = L.featureGroup().addTo(map);


            var polygon;



            marker.on('dragend', function (e) {
                //layer.dragging.enable(true);
                //layer.on('dragend', function (e) {
                latLng = e.target.getLatLng();
                var a = [latLng.lng, latLng.lat].join(' ');
                showLoading();
                $('#calendar').fullCalendar('destroy');
                $.ajax({
                    url: ' ../../Delivery/GetZoneByPoint',
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    data: { point: a },
                    success: (function (response) {
                        if (response.result != null) {
                            var layers = featureGroup._layers;
                            $.each(layers, function (layer) {
                                if (layer != e.target._leaflet_id.toString()) {
                                    map.removeLayer(featureGroup._layers[parseInt(layer)]);
                                }
                            });
                            $("#lng").val(latLng.lng);
                            $("#lat").val(latLng.lat);
                            $("#ZoneInformation").show();
                            $("#driver_zone_name").val(response.result.name);
                            $("#driver_zone_Id").val(response.result.Id);
                            if (response.result.Polygon != null) {
                                var polygon = response.result.Polygon;
                                polygon = JSON.parse(polygon);
                                var polyline = L.polyline(polygon).addTo(featureGroup);
                                map.fitBounds(polyline.getBounds());
                            }
                            initDriverSelect(0);
                            hideLoading();
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
            });



        },
        addMinutesToTime = function (time, minsAdd) {
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            };
            var bits = time.split(':');
            var mins = bits[0] * 60 + +bits[1] + +minsAdd;
            return z(mins % (24 * 60) / 60 | 0) + ':' + z(mins % 60);
        },
        getDriverInfoByPoint = function (callback, a) {
            $.ajax({
                url: ' ../../Delivery/GetDriverByPoint',
                type: 'GET',
                dataType: 'json',
                cache: false,
                data: { point: a },
                success: (function (response) {
                    callback(response);
                }),
            });
        };

    return {
        init: function () {
            labels = new Labels();
            culture = "es";
            init();
            //initCalendar();

        }
    };

}(__lbs.delivery_edit || {}));