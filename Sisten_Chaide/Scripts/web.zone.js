__lbs.zone = (function (lbs, zone) {

    var
        labels,
        _StringArray,
        labels,
        culture,
        d1,
        d2,
        initPickers = function () {
            //$d1 = $("#datetimepicker1");
            //$d2 = $("#datetimepicker2");

            // $.datepicker.setDefaults($.datepicker.regional[culture]);
            var d1Change = 0;
            var d2Change = 0;
            var today = new Date();
            $('#datetimepicker1').datetimepicker({
                format: 'LT',
                ignoreReadonly: true,
                format: 'HH:mm',
                disabledTimeIntervals: [[moment({ h: 0 }), moment({ h: 5 })], [moment({ h: 22, m: 30 }), moment({ h: 24 })]],
                enabledHours: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                stepping: 15
            });

            $('#datetimepicker2').datetimepicker({
                format: 'LT',
                ignoreReadonly: true,
                format: 'HH:mm',
                disabledTimeIntervals: [[moment({ h: 0 }), moment({ h: 5 })], [moment({ h: 22, m: 30 }), moment({ h: 24 })]],
                enabledHours: [ 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                stepping: 15
            });

            $("#datetimepicker1").on("dp.change", function (e) {
        //        if (d2Change == 0) {
                    var hour = e.date.format().split('T')[1].split('-')[0];
                    var endTime = addMinutesToTime(hour, 480);
                    var dateFormat = $.datepicker.formatDate('yy-mm-dd', new Date(e.date.format()));
                    var endHour = new Date(dateFormat.concat(" ").concat(endTime));
            //        d2Change = 0;
         //           d1Change = -1;
                    $('#datetimepicker2').data("DateTimePicker").minDate(endHour);
                    $('#strCalendarInitHour').val(dateFormat.concat(" ").concat(hour));
      //          }

            });
            $("#datetimepicker2").on("dp.change", function (e) {
        //        if (d1Change == 0) {
                    var hour = e.date.format().split('T')[1].split('-')[0];
                    var endTime = addMinutesToTime(hour, -60);
                    var dateFormat = $.datepicker.formatDate('yy-mm-dd', new Date(e.date.format()));
                    var endHour = new Date(dateFormat.concat(" ").concat(endTime));
                    var endDateFormat = $.datepicker.formatDate('yy-mm-dd hh:mm', endHour);
                    $('#datetimepicker1').data("DateTimePicker").maxDate(endDateFormat);
            //        d1Change = 0;
           //         d2Change = -1;
                    $('#srtCalendarEndHour').val(dateFormat.concat(" ").concat(hour));
          //      }
            //    d1Change = 0;





           /*   if (d1Change == -1) $('#datetimepicker1').data("DateTimePicker").maxDate(endHour);
                d1Change = 0;*/
            });


            $('#datepickerFr').datetimepicker({
                ignoreReadonly: true,
                format: 'DD/MM/YYYY',
            });

            $('#datepickerTo').datetimepicker({
                ignoreReadonly: true,
                format: 'DD/MM/YYYY',
                useCurrent: false,
            });

            if ($('#lockCalendar').val()=="True") {
                $('#viewCalendar').show();
            }
            else {
                $('#viewCalendar').hide();
            }

            $('#switch-1').on("change", function () {
                var status = $(this).prop('checked');
                if (this.checked) {
                    $('#viewCalendar').show();
                    $('#lockCalendar').val("False");
                }
                else {
                    $('#viewCalendar').hide();
                    $('#lockCalendar').val("True");
                    $('#strCalendarFromLock').val("");
                    $('#strCalendarToLock').val("");
                }
            }); 


            $("#datepickerFr").on("dp.change", function (e) {
                endDate = new Date(e.date);
                endDate.setDate(endDate.getDate() + 1);
                $('#datepickerTo').data("DateTimePicker").minDate(endDate);
                $('#strCalendarFromLock').val(endDate);
            });
            $("#datepickerTo").on("dp.change", function (e) {
                beginDate = new Date(e.date);
                beginDate.setDate(beginDate.getDate() - 1);
                $('#datepickerFr').data("DateTimePicker").maxDate(beginDate);
                $('#strCalendarToLock').val(beginDate);
            });
            $('#interval').on('input', function (e) {
                if (e.currentTarget.value > 121) {
                    $('#interval').val(e.currentTarget.value.substring(0, e.currentTarget.value.length - 1));
                }
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
        initMapBox = function () {
            var points = $("#Polygon").val();
            if (points != "") {
                polygon = JSON.parse(points);
                L.mapbox.accessToken = 'pk.eyJ1IjoiaWxpbWExOTg5IiwiYSI6IjJhYzliOWYwNWU3Y2JhMDBkMmZhZWVmZTFhMzdlOWJiIn0.yjsO8QL9YyBq5_D_4bRUGw';
                var map = L.mapbox.map('map', 'mapbox.streets')
                    .setView([polygon[0].lat, polygon[0].lng], 17)
                    .addControl(L.mapbox.geocoderControl('mapbox.places'));
            } else {
                L.mapbox.accessToken = 'pk.eyJ1IjoiaWxpbWExOTg5IiwiYSI6IjJhYzliOWYwNWU3Y2JhMDBkMmZhZWVmZTFhMzdlOWJiIn0.yjsO8QL9YyBq5_D_4bRUGw';
                var map = L.mapbox.map('map', 'mapbox.streets')
                    //.setView([38.89449828140372, -77.03941583633423], 17)
                    .addControl(L.mapbox.geocoderControl('mapbox.places'));
                //if (navigator.geolocation) {
                //  navigator.geolocation.getCurrentPosition(showPosition);
                //} else {
                //}

                //function showPosition(position) {
                //  map.setView([position.coords.latitude, position.coords.longitude], 20);
                //}
                map.setView([-0.1862504, -78.5706249], 12);
            }


            L.control.locate().addTo(map);
            var polygon;

            var featureGroup = L.featureGroup().addTo(map);
            if (points != "") {
                polygon = JSON.parse(points);
                var polyline = L.polyline(polygon).addTo(featureGroup);
            }

            var drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: featureGroup
                },
                draw: {
                    polygon: true,
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    marker: false
                }
            }).addTo(map);


            map.on('draw:created', function (e) {
                featureGroup.addLayer(e.layer);
                var type = e.layerType;
                var layer = e.layer;
                var latLngs;
                if (type === 'circle') {
                    latLngs = layer.getLatLng();
                    _StringArray = JSON.stringify(latLngs);
                } else {
                    latLngs = layer.getLatLngs();
                    latLngs.push(latLngs[0]);
                }

                _StringArray = JSON.stringify(latLngs);

                $("#Polygon").val(_StringArray);
                $("#Userid").val($("#id").val());
            });


            map.on('draw:edited', function (e) {
                _StringArray = [];
                var layers = e.layers;
                layers.eachLayer(function (layer) {
                    latLngs = layer.getLatLngs();
                    latLngs.push(latLngs[0]);
                    _StringArray = JSON.stringify(latLngs);

                    $("#Polygon").val(_StringArray);
                    $("#Userid").val($("#id").val());
                });
            });
        },
        initMapLeaftlet = function () {
            //$d1.datepicker("setDate", new Date());
            //$d2.datepicker("setDate", new Date());

            var points = $("#Polygon").val();
            var map;
            if (points != "") {
                polygon = JSON.parse(points);
                map = L.map('map');
                map.setView([polygon[0].lat, polygon[0].lng], 12);
                mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: 18
                }).addTo(map);
            } else {
                map = L.map('map');
                mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: 18
                }).addTo(map);
                map.setView([-0.1862504, -78.5706249], 12);
                //map.locate({ setView: true });
            }

            L.easyButton({
                states: [
                    {
                        stateName: 'unloaded',
                        icon: 'fa-location-arrow',
                        title: 'load image',
                        onClick: function (control) {
                            control.state("loading");
                            control._map.on('locationfound', function (e) {
                                this.setView(e.latlng, 17);
                                control.state('loaded');
                            });
                            control._map.on('locationerror', function () {
                                control.state('error');
                            });
                            control._map.locate();
                        }
                    }, {
                        stateName: 'loading',
                        icon: 'fa-spinner fa-spin'
                    }, {
                        stateName: 'loaded',
                        icon: 'fa-thumbs-up'
                    }, {
                        stateName: 'error',
                        icon: 'fa-frown-o',
                        title: 'location not found'
                    }
                ]
            }).addTo(map);

            var osmGeocoder = new L.Control.OSMGeocoder({
                collapsed: false,
                position: 'topright',
                text: 'Buscar',
            });
            map.addControl(osmGeocoder);

            var polygon;
            var featureGroup = L.featureGroup().addTo(map);
            if (points != "") {
                polygon = JSON.parse(points);
                var polyline = L.polyline(polygon).addTo(featureGroup);
                map.fitBounds(polyline.getBounds());
            }

            var drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: featureGroup
                },
                draw: {
                    polygon: true,
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    marker: false
                }
            }).addTo(map);

            map.on('draw:created', function (e) {
                featureGroup.addLayer(e.layer);
                var type = e.layerType;
                var layer = e.layer;
                var latLngs;
                if (type === 'circle') {
                    latLngs = layer.getLatLng();
                    _StringArray = JSON.stringify(latLngs);
                } else {
                    latLngs = layer.getLatLngs();
                    latLngs.push(latLngs[0]);
                }
                var a = latLngs.map(function (latLngs) {
                    return [latLngs.lng, latLngs.lat].join(' ')
                }).join();
                $("#PolygonGeo").val(a);
                _StringArray = JSON.stringify(latLngs);
                $("#Polygon").val(_StringArray);
                $("#Userid").val($("#id").val());
            });
            map.on('draw:edited', function (e) {
                _StringArray = [];
                var layers = e.layers;
                layers.eachLayer(function (layer) {
                    latLngs = layer.getLatLngs();
                    latLngs.push(latLngs[0]);
                    _StringArray = JSON.stringify(latLngs);
                    $("#Polygon").val(_StringArray);
                    $("#Userid").val($("#id").val());
                });
                var a = latLngs.map(function (latLngs) {
                    return [latLngs.lng, latLngs.lat].join(' ')
                }).join();
                $("#PolygonGeo").val(a);
            });
        };

    return {
        init: function () {
            labels = new Labels();
            culture = "es";
            initPickers();
            initMapLeaftlet();
        }
    };

}(__lbs.users || {}));