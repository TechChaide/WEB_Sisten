__lbs.delivery_order = (function (lbs, delivery_order) {

    var
        labels,
        _StringArray,
        culture,
        _addDate = "0",
        bandglobal = "",
        isMapIniti,
        _countItem = 0,
        _countItemChk = 0,
        _idItem = 0,
        isInit = 0,
        _myArray = new Array();
    _myArrayQ = new Array();

    init = function () {
        var aux = jQuery('#vendedor').val();
        if (aux != null) {
            if (aux.indexOf("resiflex") == 0) {

                $("#client_ClientName").prop('readonly', false);
                $("#client_PhoneNumber").prop('readonly', false);
                $("#client_City").prop('readonly', false);
                $("#client_Address").prop('readonly', false);
                $("#client_email").prop('readonly', false);
                $("#client_CellPhoneNumber").prop('readonly', false);
            }
        }
        

        //$("#map").hide();
        $("#ZoneInformation").hide();
        $('#SaveDelivery').hide();
        $('#OrderNumber').keydown(function (event) {
            if ($.inArray(event.keyCode, [46, 8, 9, 27, 110, 190]) !== -1 || (event.keyCode == 65 && (event.ctrlKey === true || event.metaKey === true)) || (event.keyCode >= 35 && event.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
                if (event.keyCode == '13') {
                    if ($('#OrderNumber').val() != "") {
                        var $btn = $("#searchOrder").button('loading');
                        initSearch();
                    } else {
                        $('#modalTitle').html("Ingrese número de orden");
                        $('#modalBody').html("Ejm: 987654");
                        $('#fullCalModal').modal();
                    }

                }
            }


        });

        //funcion pierde foco textbox nombre para usuarios resiflex (Agrega codigo de cliente para visualizacion del calendario)
    /*    jQuery('#client_ClientName').blur(function () {
            var aux = jQuery('#client_ClientName').val();
            var aux2 = jQuery('#vendedor').val();

            if (aux2.indexOf("resiflex") == 0) {
                if (aux.indexOf("(0005077468)") == -1) {
                    aux = aux + " (0005077468)";
                    $('#client_ClientName').val(aux);
                }
                //remplazar seller name con el del usuario logeado
                aux = jQuery('#vendedor').val();
                $('#client_SellerName').val(aux);
         

        });   }*/
        //remplazar seller name con el del usuario logeado para resiflex
        $(window).scroll(function () {
            var aux2 = jQuery('#vendedor').val();
            if (aux2 != undefined) {
                if (aux2.indexOf("resiflex") == 0) {
                    var aux = jQuery('#vendedor').val();
                    $('#client_SellerName').val(aux);
                }
            }
           
        });

        //evento para disparar la busqueda por cedula para usuarios resiflex
        jQuery('#cedula').on('input', function () {
            if (jQuery('#cedula').val().length == 10) {
                var x = LlamarCedulaResiflex(jQuery('#cedula').val());
            }
            else {
                $("#client_ClientName").prop('readonly', false);
                $("#client_PhoneNumber").prop('readonly', false);
                $("#client_City").prop('readonly', false);
                $("#client_Address").prop('readonly', false);
                $("#client_email").prop('readonly', false);
                $("#client_CellPhoneNumber").prop('readonly', false);
                $("#ReferenceAddress").prop('readonly', false);

                $("#client_ClientName").val("");
                $("#client_PhoneNumber").val("");
                $("#client_City").val("");
                $("#client_Address").val("");
                $("#client_email").val("");
                $("#client_CellPhoneNumber").val("");
                $("#ReferenceAddress").val("");

            }
                
            });
            

        function LlamarCedulaResiflex(id) {
            var id = $("#cedula").val();
            var retorno = 0;
            $.ajax({
                url: ' ../../Delivery/GetPedidoResiflex',
                type: 'GET',
                dataType: 'json',
                cache: false,
                data: { id: id },
                success: (function (response) {
                    if (response.result.client != null) {
                        $("#client_ClientName").val(response.result.client.ClientName);
                        $("#client_PhoneNumber").val(response.result.client.PhoneNumber);
                        $("#client_City").val(response.result.client.City);
                        $("#client_Address").val(response.result.client.Address);
                        $("#client_email").val(response.result.client.email);
                        $("#client_CellPhoneNumber").val(response.result.client.CellPhoneNumber);
                        $("#ReferenceAddress").val(response.result.ReferenceAddress);
                        $('#client_SellerName').val(jQuery('#vendedor').val());

                        if (band != "1") {
                            $("#client_ClientName").prop('readonly', true);
                            $("#client_PhoneNumber").prop('readonly', true);
                            $("#client_City").prop('readonly', true);
                            $("#client_Address").prop('readonly', true);
                            $("#client_email").prop('readonly', true);
                            $("#client_CellPhoneNumber").prop('readonly', true);
                            $("#ReferenceAddress").prop('readonly', true);
                        }
                        retorno = 1; 
                    }
                    
                })
            });

            return retorno;
        }



        $('#driverInfo').hide();
        $("#searchOrder").click(function () {
            if ($('#OrderNumber').val() != "") {
                var $btn = $("#searchOrder").button('loading');
                initSearch();
            } else {
                $('#modalTitle').html("Ingrese número de orden");
                $('#modalBody').html("Ejm: 987654");
                $('#fullCalModal').modal();
            }
        });
    },

        initSearch = function () {

        $("#cedula").prop('readonly', false);
        $("#client_ClientName").prop('readonly', false);
        $("#client_PhoneNumber").prop('readonly', false);
        $("#client_City").prop('readonly', false);
        $("#client_Address").prop('readonly', false);
        $("#client_email").prop('readonly', false);
        $("#client_CellPhoneNumber").prop('readonly', false);
        $("#ReferenceAddress").prop('readonly', false);

            var id = $("#OrderNumber").val();
            _countItem = 0;
            _idItem = 0;
            showLoading();
            $.ajax({
                url: ' ../../Delivery/GetOrderInfo',
                type: 'GET',
                dataType: 'json',
                cache: false,
                data: { id: id },
                success: (function (response) {
                    if (response.result.client != null) {
                        $("#client_ClientName").val(response.result.client.ClientName);
                        $("#client_PhoneNumber").val(response.result.client.PhoneNumber);
                        $("#client_City").val(response.result.client.City);
                        $("#client_Address").val(response.result.client.Address);
                        $("#client_CodeClient").val(response.result.client.CodeClient);
                        $("#client_email").val(response.result.client.email);
                        $("#client_CellPhoneNumber").val(response.result.client.CellPhoneNumber);
                        $("#client_SellerName").val(response.result.client.SellerName);
                        $("#Deliveries").val(response.result.Deliveries);
                        $("#cedula").val(response.result.client.ruc_ci);
                        $("#ReferenceAddress").val(response.result.ReferenceAddress);


                                if (response.result.client.ruc_ci != "") {
                                    $("#cedula").prop('readonly', true);
                                    $("#client_ClientName").prop('readonly', true);
                                    $("#client_PhoneNumber").prop('readonly', true);
                                    $("#client_City").prop('readonly', true);
                                    $("#client_Address").prop('readonly', true);
                                    $("#client_email").prop('readonly', true);
                                    $("#client_CellPhoneNumber").prop('readonly', true);

                                    //control de bloqueos de campos para usuarios resiflex
                                    var aux2 = jQuery('#vendedor').val();
                                    if (aux2 != undefined) {
                                        if (aux2.indexOf("resiflex") == 0) {
                                            $("#ReferenceAddress").prop('readonly', true);
                                        }
                                    }
                                } else {
                                    bandglobal = "1";
                                    $("#cedula").prop('readonly', false);
                                    $("#client_ClientName").prop('readonly', false);
                                    $("#client_PhoneNumber").prop('readonly', false);
                                    $("#client_City").prop('readonly', false);
                                    $("#client_Address").prop('readonly', false);
                                    $("#client_email").prop('readonly', false);
                                    $("#client_CellPhoneNumber").prop('readonly', false);
                                    $("#ReferenceAddress").prop('readonly', false);
                                }
          

                        $.ajax({
                            url: ' ../../Delivery/GetItemInfo',
                            type: 'GET',
                            dataType: 'json',
                            cache: false,
                            data: { id: id },
                            success: (function (response) {								
                                if (response.aaData != null) {
                                    var aoColumns = [
                                        {
                                            "mDataProp": "OrderNumber",
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
                                                if (type != "type") {
                                                    if (_idItem != 0) {
                                                        _countItem++;
                                                    }
                                                    _idItem = full.ItemId;
                                                }
                                                return (full.quantity > 1)
                                                    ? '<input id="ListProducts_' + _countItem + '" type="number" autocomplete="off" name="intervalTime" class="form-control" min="1" max="' + full.quantity + '" value="' + full.quantity + '" />'
                                                    : '<input id="ListProducts_' + _countItem + '" type="number" autocomplete="off" readonly name="intervalTime" class="form-control" min="1" max="' + full.quantity + '" value="' + full.quantity + '" />';
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
                                            "mDataProp": "Status",
                                            bSortable: false,
                                            "sClass": "statusItem",
                                            "mRender": function (date, type, full) {
                                                return (full.Dispatched == false)
                                                    ? '<input id="ListProducts_' + _countItem + '" type="checkbox" value="' + full.Dispatched + '" class="itemCheck">'
                                                    : '<input id="ListProducts_' + _countItem + '" type="checkbox" value="' + full.Dispatched + '" class="itemCheck"  checked="checked">';
                                            },
                                        },
                                    ];
									
                                    if ($('#grid-users').length > 0) {
                                        if (isInit == 0) {
                                            $('#grid-users').dataTable({
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
                                                    _myArray = new Array(_countItem);
                                                    _myArrayQ = new Array(_countItem);
                                                    for (var i = 0; i <= _countItem; i++) {
                                                        _myArray[i] = false
                                                        _myArrayQ[i] = 0;
                                                    };
                                                    var theParent = $("#grid-users").find("td.statusItem");
                                                    var elements = theParent.find("input");
                                                    var elementsChk = theParent.find("input");
                                                    var elementsTxt = elementsChk.filter('.form-control');
                                                    for (var i = 0; i < elements.length; i++) {
                                                        var childElement = $(elements[i]);
                                                        childElement.click(onClickItem);
                                                        childElement.off('keyup keydown keypress');
                                                        childElement.bind('keypress', function (e) {
                                                            e.preventDefault();
                                                        });
                                                    }
                                                    for (var i = 0; i < elementsTxt.length; i++) {
                                                        //if (childElement.hasClass('form-control')) {
                                                        _myArrayQ[i] = parseInt(elementsTxt[i].value);
                                                        //}
                                                    }
                                                    $("#StatusItem").val(_myArray.toString());
                                                    $("#ItemDispatch").val(_myArrayQ.toString());
                                                },
                                            }).fnAddData(response.aaData);
                                        } else {
                                            var table = $('#grid-users').dataTable();
                                            table.fnClearTable();
                                            table.fnAddData(response.aaData);
                                            _myArray = new Array(_countItem);
                                            _myArrayQ = new Array(_countItem);
                                            for (var i = 0; i <= _countItem; i++) {
                                                _myArray[i] = false;
                                                _myArrayQ[i] = 0;
                                            };
                                            var theParent = $("#grid-users").find("td.statusItem");
                                            var elements = theParent.find("input");
                                            var elementsChk = theParent.find("input");
                                            var elementsTxt = elementsChk.filter('.form-control');
                                            for (var i = 0; i < elements.length; i++) {
                                                var childElement = $(elements[i]);
                                                childElement.click(onClickItem);
                                                childElement.off('keyup keydown keypress');
                                                childElement.bind('keypress', function (e) {
                                                    e.preventDefault();
                                                });
                                            };
                                            for (var i = 0; i < elementsTxt.length; i++) {
                                                //if (childElement.hasClass('form-control')) {
                                                _myArrayQ[i] = parseInt(elementsTxt[i].value);
                                                //}
                                            }
                                            $("#StatusItem").val(_myArray.toString());
                                            $("#ItemDispatch").val(_myArrayQ.toString());

                                        };
                                        isInit = 1;
                                    }
                                }
	                            if (isMapIniti == undefined) {
                                    initMapLeaftlet(function () {
                                        $('#loadingmessage').hide();
                                        $("#searchOrder").button('reset');
                                        $("#map").show();
                                        isMapIniti = 1;
                                        hideLoading();
                                    });
                                } else {
                                    $("#searchOrder").button('reset');
                                    hideLoading();
                                }
                                hideLoading();
                            })

                        });
						
                    } else {
                        $("#searchOrder").button('reset');
                        $('#modalTitle').html("Número de Pedido");
                        $('#modalBody').html("La Orden ingresada no existe");
                        $('#fullCalModal').modal();
                        hideLoading();
                    }
                }),
            });
        },
        onClickItem = function (e) {

            if ($(e.currentTarget).hasClass('form-control')) {
                if ($(e.currentTarget).hasClass('form-control')) {
                    var item = e.currentTarget.id.toString().split("_");
                    _myArrayQ[item[1]] = parseInt(e.currentTarget.value);
                }
            } else {
                if ($(e.currentTarget).is(':checked') == true) {
                    var item = e.currentTarget.id.toString().split("_");
                    _myArray[item[1]] = true;
                } else {
                    var item = e.currentTarget.id.toString().split("_");
                    _myArray[item[1]] = false;

                }
            }

  
            //$("#" + e.currentTarget.id).val($(e.currentTarget).value);
            $("#StatusItem").val(_myArray.toString());
            $("#ItemDispatch").val(_myArrayQ.toString());
            e.stopPropagation();
            if (ShowLoginButton() && $('#dateDelivery').val() != "")
                $('#SaveDelivery').show();
            else
                $('#SaveDelivery').hide();
        },
        ShowLoginButton = function () {
            var itemsDispatched = $("#StatusItem").val().split(",")
            for (i = 0; i <= itemsDispatched.length; i++) {
                if (itemsDispatched[i] == "true")
                    return true
                else continue;
            };
            return false;
        },
        initDriverSelect = function () {
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
            $('#driverInfo').show();
            $('.driver_filter').on("select2:select", function (e) {
                $('#calendar').fullCalendar('destroy');
            });
            $('.driver_filter').on("select2:select", function (e) {
                $('#calendar').fullCalendar('destroy');
                var parameters = "?";
                var driver = $('.driver_filter').val();
                if (driver) parameters += "driverId=" + driver + "&";
                parameters = parameters.substr(0, parameters.length - 1);
                $("#driver_user_Id").val(driver);
                showLoading();
                _addDate = 0;
                $.ajax({
                    url: '../../Delivery/GetIteneraryDeliveries' + parameters,
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    data: {},
                    success: (function (response) {
                        var zoneid = $("#driver_zone_Id").val();
                        //cambio para ocultar el calendario usuarios resiflex zonas fuera de UIO y GYE
                        if (zoneid == '70' || zoneid == '72') {
                            hideLoading();
                            $('#calendar').fullCalendar('destroy');
                            _changeZone = 1;
                            $('#SaveDelivery').show();
                        }
                        else {
                            if (response.result != null) {
                                if (response.result.has_items) {
                                    hideLoading();
                                    $('#calendar').fullCalendar('destroy');
                                    _changeZone = 1;
                                    initCalendar(response.result.items);
                                } else {
                                    hideLoading();
                                    //alert('No se encontraron resultados');
                                    $('#calendar').fullCalendar('destroy');
                                    _changeZone = 1;
                                    initCalendar(response.result.items);
                                }
                            }
                        }
                    }),
                });
            });
        },

        initCalendar = function (Calendar) {
            showLoading();
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
            slotEventOverlap: true,
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
                right: 'month,agendaWeek',
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
                        event.end = new Date(dateFormat.concat(" ").concat(item.StrTimeEndDelivery));
                        event.title = item.ClientName;
                        event.editable = false;
                        event.allDay = false;
                        $('#calendar').fullCalendar('renderEvent', event);
                        return event;

                    }),
                eventAfterAllRender: function () {
                    hideLoading();
                },
                eventRenderWait: 300,
                eventClick: function (calEvent, jsEvent, view) {
                    var features = $context.loggedUser.features;
                    if (features.find(x => x === 'DELI0005') != undefined) {
                        var mydate = calEvent.start.format().split("T");
                        var initialDay = $.datepicker.formatDate('yy-mm-dd', new Date(calEvent.start.format()));
                        var dateCompare = new Date(initialDay.concat(" ").concat(mydate[1]));
                        if (dateCompare < new Date()) {
                            $('#modalTitle').html("Número de Pedido");
                            $('#modalBody').html("No se pueden agregar eventos para días anteriores");
                            $('#fullCalModal').modal();
                            return;
                        }

                        //// Agregar prohibir franja horaria
                        var aux = new Date(calEvent.end.format('YYYY-MM-DD HH:mm:ss'));
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

                      /*  if (dateCompare.getMinutes() == "45" && dateCompare.getHours() == "18" && duracion >= 45) {
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


                    /*    if (dateCompare.getHours() == "12" && dateCompare.getMinutes() == "45") {
                            $('#modalTitle').html("Número de Pedido");
                            $('#modalBody').html("No se pueden agendar entregas de 12:45 a 13:30zzzzz");
                            $('#fullCalModal').modal();
                            return;
                        }
                        if (dateCompare.getHours() == "18" && dateCompare.getMinutes() == "45") {
                            $('#modalTitle').html("Número de Pedido");
                            $('#modalBody').html("No se pueden agendar entregas de 18:45 a 19:30zzzzzzz");
                            $('#fullCalModal').modal();
                            return;
                        }*/

                        if (_addDate == "0") {
                            $('#Title').html("Agendar Entrega");
                            var clientName = $('#client_ClientName').val()
                            var dateDelivery = calEvent.start.format().split("T");
                            var event = new Object();
                            event.id = "0000";
                            var dateFormat = $.datepicker.formatDate('yy-mm-dd', new Date(calEvent.start.format()));
                            endTime = addMinutesToTime(dateDelivery[1], 45);
           
                            event.start = new Date(dateFormat.concat(" ").concat(dateDelivery[1]));
                            event.end = new Date(dateFormat.concat(" ").concat(endTime));
                            event.title = clientName;
                            event.editable = true;
                            event.allDay = false;
                            $('#calendar').fullCalendar('renderEvent', event, true);
                            _addDate = "1";
                            $('#dateDelivery').val(dateFormat.concat(" ").concat(dateDelivery[1]))
                            if (ShowLoginButton())
                                $('#SaveDelivery').show();
                        } else {
                            if (ShowLoginButton())
                                $('#SaveDelivery').show();
                            $('#modalTitle').html("Agendar Entrega");
                            $('#modalBody').html("Arrastre el evento agendado para moverlo");
                            $('#fullCalModal').modal();
                        }
                    } else {
                        $('#modalTitle').html("Entrega a: " + calEvent.title);
                        var date = new Date(calEvent.start.format().replace("T", " "))
                        $('#modalBody').html("Fecha y Hora de Entrega: " + date.toLocaleString());
                        $('#fullCalModal').modal();
                    }

            },
                dayClick: function (date, jsEvent, view) {
                    var mydate = date.format().split("T");
                    var initialDay = $.datepicker.formatDate('yy-mm-dd', new Date(date.format()));
                    var dateCompare = new Date(initialDay.concat(" ").concat(mydate[1]));
                    if (dateCompare < new Date()) {
                        $('#modalTitle').html("Número de Pedido");
                        $('#modalBody').html("No se pueden agregar eventos para días anteriores");
                        $('#fullCalModal').modal();
                        return;
                    }

    
                    if (_addDate == "0") {
                        $('#Title').html("Agendar Entrega");
                        var clientName = $('#client_ClientName').val()
                        var dateDelivery = date.format().split("T");
                        var event = new Object();
                        event.id = "0000";
                        var dateFormat = $.datepicker.formatDate('yy-mm-dd', new Date(date.format()));

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

                        function TraeInfo(codMaterial,cantidad) { 
                            var resultado = "";
                            $.ajax({
                                async: false, //Esta es la clave.
                                url: ' ../../Delivery/Horarios',
                                type: 'GET',
                                dataType: 'json',
                                cache: false,
                                data: { codMaterial: codMaterial},
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

                        endTime = endTime.concat(":00");

                    //    Endate = 
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
                            $('#modalBody').html("No se pueden agendar entregas en la Franja horaria de 12:45 a 13:30 la duración de su pedido es: " + duracion+ " minutos.");
                            $('#fullCalModal').modal();
                            return;
                        }

                        ///franja prohibida de la tarde

                     /*   if (dateCompare.getMinutes() == "45" && dateCompare.getHours() == "18" && duracion >= 45) {
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
                        event.start = new Date(dateFormat.concat(" ").concat(dateDelivery[1]));
                        event.end = new Date(dateFormat.concat(" ").concat(endTime));
                        event.title = clientName;
                        event.editable = true;
                        event.allDay = false;
                        $('#calendar').fullCalendar('renderEvent', event, true);
                        _addDate = "1";
                        $('#dateDelivery').val(dateFormat.concat(" ").concat(dateDelivery[1]))
                        $('#EndDelivery').val(dateFormat.concat(" ").concat(endTime))
                        if (ShowLoginButton())
                            $('#SaveDelivery').show();
                    } else {
                        if (ShowLoginButton())
                            $('#SaveDelivery').show();
                        $('#modalTitle').html("Agendar Entrega");
                        $('#modalBody').html("Arrastre el evento agendado para moverlo");
                        $('#fullCalModal').modal();
                    }

                },
                eventDrop: function (event, delta, revertFunc) {

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

                  /* if (dateCompare.getMinutes() == "45" && dateCompare.getHours() == "18" && duracion >= 45) {
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
                   
                 /*ANtigua validacion de franjas horarias
                  *
                  * if (dateCompare.getHours() == "12" && dateCompare.getMinutes() == "45") {
                        $('#modalTitle').html("Número de Pedido");
                        $('#modalBody').html("No se pueden agendar entregas de 12:45 a 13:30cccccc");
                        $('#fullCalModal').modal();
                        revertFunc();
                        return;
                    }
                    if (dateCompare.getHours() == "18" && dateCompare.getMinutes() == "45") {
                        $('#modalTitle').html("Número de Pedido");
                        $('#modalBody').html("No se pueden agendar entregas de 18:45 a 19:30ccccc");
                        $('#fullCalModal').modal();
                        revertFunc();
                        return;
                    }
                    */

                    var dateDelivery = event.start.format('YYYY-MM-DD HH:mm:ss');
                    dateDelivery = dateDelivery.split(" ");
                    var dateFormatDrop = $.datepicker.formatDate('yy-mm-dd', new Date(event.start.format()));
                    var date = dateFormatDrop.concat(" ").concat(dateDelivery[1]);
                    $('#dateDelivery').val(date)
                }
            });
        },
        initMapLeaftlet = function (callback) {
            var map = L.map('map');
            mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: 18
            }).addTo(map);
            map.setView([-0.186250423435435, -78.5706249345435435], 12);
            map.invalidateSize();

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

            var featureGroup = L.featureGroup().addTo(map);


            var drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: featureGroup
                },
                draw: {
                    polygon: false,
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    marker: true
                }
            }).addTo(map);

            var polygon;

            map.on('draw:created', function (e) {
                featureGroup.addLayer(e.layer);
                var type = e.layerType;
                var layer = e.layer;
                var latLng = layer.getLatLng();
                var a = [latLng.lng, latLng.lat].join(' ');
                $("#PolygonGeo").val(a);
                layer.dragging.enable(true);
                layer.on('dragend', function (e) {
                    showLoading();
                    latLng = e.target.getLatLng();
                    var a = [latLng.lng, latLng.lat].join(' ');
                    $('#calendar').fullCalendar('destroy');
                    $(".driver_filter").select2('val', 'All');
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
                                initDriverSelect();
                                hideLoading();
                            } else if (response.result == null) {
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
                                hideLoading();
                            }
                        }),
                    });
                });
                showLoading();
                $.ajax({
                    url: ' ../../Delivery/GetZoneByPoint',
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    data: { point: a },
                    success: (function (response) {
                        if (response.result != null) {
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
                            initDriverSelect();
                            hideLoading();
                        } else if (response.result == null) {
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
                            hideLoading();
                        }
                    }),
                });
            });

            map.on('draw:edited', function (e) {
                var layers = e.layers;
                $('#calendar').fullCalendar('destroy');
                $(".driver_filter").select2('val', 'All');
                layers.eachLayer(function (layer) {
                    var latLng = layer.getLatLng();
                    var a = [latLng.lng, latLng.lat].join(' ');
                    $("#PolygonGeo").val(a);
                    showLoading();
                    $.ajax({
                        url: ' ../../Delivery/GetZoneByPoint',
                        type: 'GET',
                        dataType: 'json',
                        cache: false,
                        data: { point: a },
                        success: (function (response) {
                            if (response.result != null) {
                                initDriverSelect();
                                $("#lng").val(latLng.lng);
                                $("#lat").val(latLng.lat);
                                $("#ZoneInformation").show();
                                $("#driver_zone_name").val(response.result.name);
                                $("#driver_zone_Id").val(response.result.Id);
                                if (response.result.Polygon != null) {
                                    var polygon = response.result.zone.Polygon;
                                    polygon = JSON.parse(polygon);
                                    var polyline = L.polyline(polygon).addTo(featureGroup);
                                    map.fitBounds(polyline.getBounds());
                                }
                                initDriverSelect();
                                hideLoading();
                            } else if (response.result == null) {
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
                                hideLoading();
                            }
                        }),
                    });
                });
            });

            callback();
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
            $(window).keydown(function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                }
            });

        }
    };

}(__lbs.delivery_order || {}));