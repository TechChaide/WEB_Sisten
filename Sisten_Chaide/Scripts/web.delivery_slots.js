// ========================================
// MÓDULO: Selección automática de horarios con calendario
// ========================================
var __lbs = window.__lbs || {};

__lbs.delivery_slots = (function () {
    'use strict';

    var zoneId = null;
    var allSlots = [];

    function log(level, message, data) {
        var timestamp = new Date().toLocaleTimeString('es-ES');
        var style = '';
        switch (level) {
            case 'ERROR':
                style = 'color: red; font-weight: bold;';
                break;
            case 'SUCCESS':
                style = 'color: green; font-weight: bold;';
                break;
            case 'WARNING':
                style = 'color: orange; font-weight: bold;';
                break;
            case 'INFO':
                style = 'color: blue;';
                break;
            default:
                style = 'color: gray;';
                break;
        }
        var logMsg = '[' + timestamp + '] [SLOTS-' + level + '] ' + message;
        console.log('%c' + logMsg, style);
        if (data) {
            console.log('  → Datos:', data);
        }
    }

    function loadAvailableSlots(zone_id) {
        console.log('[DEBUG] loadAvailableSlots() llamado con zone_id:', zone_id);
        log('INFO', 'loadAvailableSlots() llamado', { zone_id: zone_id });
        if (!zone_id || zone_id <= 0) {
            console.log('[ERROR] Zona inválida o no definida:', zone_id);
            log('ERROR', 'Zona inválida o no definida');
            return;
        }

        zoneId = zone_id;
        console.log('[DEBUG] zoneId asignado:', zoneId);
        log('INFO', 'Iniciando carga de slots para zona', { zoneId: zoneId });

        $('#loadingMessage').show();
        $('#errorMessage').hide().html('');
        $('#calendarContainer').hide();

        var today = new Date();
        var startDate = today.toISOString().split('T')[0];
        console.log('[DEBUG] Fecha de inicio para slots:', startDate);

        log('INFO', 'Llamada AJAX preparada', {
            url: '/Delivery/GetAvailableSlots',
            zoneId: zoneId,
            startDate: startDate,
            days: 15
        });
        console.log('[DEBUG] AJAX params:', {
            zoneId: zoneId,
            startDate: startDate,
            days: 15
        });

        $.ajax({
            type: 'GET',
            url: '/Delivery/GetAvailableSlots',
            data: {
                zoneId: zoneId,
                startDate: startDate,
                days: 15
            },
            dataType: 'json',
            timeout: 15000,
            success: function (response) {
                console.log('[DEBUG] AJAX success. Raw response:', response);
                log('SUCCESS', 'Respuesta AJAX exitosa', { response: response });
                $('#loadingMessage').hide();

                if (response && response.result && response.result.length > 0) {
                    allSlots = response.result;
                    console.log('[DEBUG] Slots recibidos:', allSlots);
                    log('SUCCESS', 'Slots recibidos', { count: allSlots.length });
                    renderCalendar(allSlots);
                    $('#calendarContainer').show();
                } else {
                    console.log('[WARNING] Sin slots disponibles para la zona. Respuesta:', response);
                    log('WARNING', 'Sin slots disponibles para la zona');
                    allSlots = [];
                    $('#errorMessage').html('No hay horarios disponibles para esta zona').show();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#loadingMessage').hide();
                console.log('[ERROR] AJAX falló:', {
                    status: jqXHR.status,
                    statusText: jqXHR.statusText,
                    textStatus: textStatus,
                    errorThrown: errorThrown,
                    responseText: jqXHR.responseText
                });
                log('ERROR', 'AJAX falló', {
                    status: jqXHR.status,
                    statusText: jqXHR.statusText,
                    textStatus: textStatus,
                    errorThrown: errorThrown,
                    responseText: jqXHR.responseText
                });
                $('#errorMessage').html('Error al cargar horarios: ' + textStatus).show();
            }
        });
    }

    function renderCalendar(slots) {
        console.log('[DEBUG] renderCalendar() iniciado. slots:', slots);
        log('INFO', 'renderCalendar() iniciado', { slotsCount: slots.length });

        var hoursMap = {};
        slots.forEach(function (slot, idx) {
            console.log('[DEBUG] Procesando slot[' + idx + ']:', slot);
            var startHour = slot.HourStart;
            var hourStr = '';
            if (typeof startHour === 'object' && startHour) {
                var h = startHour.Hours || 0;
                var m = startHour.Minutes || 0;
                hourStr = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
            } else if (typeof startHour === 'string' && startHour.length >= 5) {
                hourStr = startHour.substring(0, 5);
            }
            if (hourStr) {
                hoursMap[hourStr] = true;
            }
        });

        var uniqueHours = Object.keys(hoursMap).sort();
    console.log('[DEBUG] Horas únicas detectadas:', uniqueHours);
    log('INFO', 'Horas únicas detectadas', { uniqueHours: uniqueHours });

        var html = '';
        html += '<div style="margin:0;padding:20px;background:#f8f9fa;border-radius:8px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;padding:0 10px;">';
        html += '<button type="button" class="btn btn-sm" id="prevWeek" style="background:#0055b8;color:#fff;border:none;padding:10px 20px;border-radius:4px;font-weight:600;">← Anterior</button>';
        html += '<h4 id="weekDateRange" style="margin:0;color:#0055b8;font-size:18px;font-weight:700;flex:1;text-align:center;"></h4>';
        html += '<button type="button" class="btn btn-sm" id="nextWeek" style="background:#0055b8;color:#fff;border:none;padding:10px 20px;border-radius:4px;font-weight:600;">Siguiente →</button>';
        html += '</div>';
        html += '<div style="overflow-x:auto;margin:20px 0;background:#fff;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">';
        html += '<table class="table" id="weeklyCalendar" style="margin-bottom:0;border-collapse:collapse;">';
        html += '<thead>';
        html += '<tr style="background:#0055b8;color:#fff;font-weight:600;">';
        html += '<th style="width:100px;padding:16px 8px;text-align:center;border:none;font-size:12px;letter-spacing:0.5px;">HORA</th>';
        html += '<th id="headerMon" style="width:140px;padding:16px 8px;text-align:center;border:none;font-size:13px;color:#fff;"></th>';
        html += '<th id="headerTue" style="width:140px;padding:16px 8px;text-align:center;border:none;font-size:13px;color:#fff;"></th>';
        html += '<th id="headerWed" style="width:140px;padding:16px 8px;text-align:center;border:none;font-size:13px;color:#fff;"></th>';
        html += '<th id="headerThu" style="width:140px;padding:16px 8px;text-align:center;border:none;font-size:13px;color:#fff;"></th>';
        html += '<th id="headerFri" style="width:140px;padding:16px 8px;text-align:center;border:none;font-size:13px;color:#fff;"></th>';
        html += '<th id="headerSat" style="width:140px;padding:16px 8px;text-align:center;border:none;font-size:13px;color:#fff;"></th>';
        html += '<th id="headerSun" style="width:140px;padding:16px 8px;text-align:center;border:none;font-size:13px;color:#fff;"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="weeklyBody" style="border-bottom:1px solid #e0e0e0;"></tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';

    console.log('[DEBUG] HTML generado para calendario:', html);
    $('#calendarContainer').html(html);
    $('#calendarContainer').show();

    var currentWeekStart = getMonday(new Date());
    console.log('[DEBUG] currentWeekStart:', currentWeekStart);
    renderWeek(currentWeekStart);

        $('#prevWeek').off('click').on('click', function () {
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
            renderWeek(new Date(currentWeekStart));
        });

        $('#nextWeek').off('click').on('click', function () {
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            renderWeek(new Date(currentWeekStart));
        });

        function getMonday(date) {
            var d = new Date(date);
            var day = d.getDay();
            var diff = d.getDate() - day + (day === 0 ? -6 : 1);
            d.setDate(diff);
            d.setHours(0, 0, 0, 0);
            return d;
        }

        function renderWeek(weekStartDate) {
            console.log('[DEBUG] renderWeek() para fecha:', weekStartDate);
            var dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            var monthShortNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            var weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

            for (var i = 0; i < 7; i++) {
                console.log('[DEBUG] Día de la semana:', i, 'Fecha:', new Date(weekStartDate.getTime() + i * 86400000));
                var day = new Date(weekStartDate);
                day.setDate(day.getDate() + i);
                var dayName = dayNames[i];
                var dayNum = day.getDate();
                var monthShort = monthShortNames[day.getMonth()];
                var headerHtml = '<div style="font-weight:600;font-size:14px;">' + dayName + '</div>' +
                    '<div style="font-size:18px;font-weight:700;color:#00838f;">' + dayNum + '</div>' +
                    '<div style="font-size:11px;color:rgba(255,255,255,0.9);">' + monthShort + '</div>';
                $('#header' + weekDays[i]).html(headerHtml);
            }

            var slotsByDateAndHour = {};
            allSlots.forEach(function (slot, idx) {
                console.log('[DEBUG] Slot en renderWeek[' + idx + ']:', slot);
                var dateObj = parseSlotDate(slot.DateKey);
                if (!dateObj) {
                    console.log('[WARNING] Slot sin fecha válida:', slot);
                    return;
                }
                var dateKey = dateObj.toISOString().split('T')[0];
                var hourKey = formatSlotHour(slot.HourStart);
                if (!dateKey || !hourKey) {
                    console.log('[WARNING] Slot sin dateKey u hourKey:', slot);
                    return;
                }
                if (!slotsByDateAndHour[dateKey]) {
                    slotsByDateAndHour[dateKey] = {};
                }
                slotsByDateAndHour[dateKey][hourKey] = slot;
            });

            var bodyHtml = '';
            uniqueHours.forEach(function (hour, index) {
                console.log('[DEBUG] Renderizando fila de hora:', hour);
                var isAlternate = index % 2 === 0;
                var rowBg = isAlternate ? '#f5f5f5' : '#ffffff';
                bodyHtml += '<tr style="background-color:' + rowBg + ';border-bottom:1px solid #e8e8e8;">';
                bodyHtml += '<td style="background-color:' + rowBg + ';text-align:center;font-weight:600;padding:12px 8px;color:#424242;font-size:13px;border-right:2px solid #ddd;">' + hour + '</td>';

                for (var dayOffset = 0; dayOffset < 7; dayOffset++) {
                    console.log('[DEBUG] Renderizando celda día:', dayOffset, 'Hora:', hour);
                    var cellDate = new Date(weekStartDate);
                    cellDate.setDate(cellDate.getDate() + dayOffset);
                    var dateKey = cellDate.toISOString().split('T')[0];
                    var slot = slotsByDateAndHour[dateKey] && slotsByDateAndHour[dateKey][hour] ? slotsByDateAndHour[dateKey][hour] : null;
                    console.log('[DEBUG] slot para celda:', cellId, slot);

                    var cellId = 'cell_' + dateKey + '_' + hour;
                    var cellStyle = 'padding:12px 8px;text-align:center;min-height:60px;vertical-align:middle;border-right:1px solid #f0f0f0;transition:all 0.3s ease;font-weight:600;font-size:12px;';
                    var cellClass = '';
                    var cellContent = '';

                    if (slot) {
                        console.log('[DEBUG] slot encontrado:', slot);
                        if (slot.AvailableDriverCount > 0) {
                            cellStyle += 'background-color:#d1e7f7;color:#0055b8;cursor:pointer;border:2px solid #0055b8;';
                            cellClass = 'slot-available';
                            cellContent = '<span style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0055b8;">DISPONIBLE</span>';
                        } else {
                            console.log('[DEBUG] slot ocupado:', slot);
                            cellStyle += 'background-color:#e8e8e8;color:#888;cursor:not-allowed;border:1px solid #ccc;opacity:0.6;';
                            cellContent = '<span style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;">OCUPADO</span>';
                        }
                    } else {
                        console.log('[DEBUG] slot vacío para celda:', cellId);
                        cellStyle += 'background-color:' + rowBg + ';color:#999;';
                    }

                    bodyHtml += '<td id="' + cellId + '" class="' + cellClass + '" style="' + cellStyle + '"';
                    console.log('[DEBUG] cellContent:', cellContent);
                    if (slot && slot.AvailableDriverCount > 0) {
                        bodyHtml += ' data-datekey="' + dateKey + '" data-hour="' + hour + '" data-driverid="' + (slot.AssignedDriverId || '') + '" data-drivername="' + (slot.AssignedDriverName || 'Conductor asignado') + '"';
                    }
                    bodyHtml += '>' + cellContent + '</td>';
                }

                bodyHtml += '</tr>';
            });

            console.log('[DEBUG] bodyHtml generado:', bodyHtml);
            $('#weeklyBody').html(bodyHtml);

            var start = new Date(weekStartDate);
            var end = new Date(weekStartDate);
            end.setDate(end.getDate() + 6);
            var startStr = start.getDate() + ' de ' + monthShortNames[start.getMonth()];
            var endStr = end.getDate() + ' de ' + monthShortNames[end.getMonth()];
            console.log('[DEBUG] Rango de semana:', startStr, endStr);
            $('#weekDateRange').text('📅 Semana: ' + startStr + ' - ' + endStr);

            $('.slot-available').off('click').on('click', function () {
                console.log('[DEBUG] slot-available click:', this);
                var $cell = $(this);
                var dateKey = $cell.attr('data-datekey');
                var hour = $cell.attr('data-hour');
                var driverId = $cell.attr('data-driverid');
                var driverName = $cell.attr('data-drivername');

                log('INFO', 'Slot seleccionado por el usuario', { dateKey: dateKey, hour: hour, driverId: driverId, driverName: driverName });

                if ($cell.hasClass('selected')) {
                    $cell.removeClass('selected').css({
                        backgroundColor: '#d1e7f7',
                        color: '#0055b8',
                        border: '2px solid #0055b8',
                        boxShadow: 'none'
                    }).html('<span style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0055b8;">DISPONIBLE</span>');
                } else {
                    $('.slot-available.selected').removeClass('selected').css({
                        backgroundColor: '#d1e7f7',
                        color: '#0055b8',
                        border: '2px solid #0055b8',
                        boxShadow: 'none'
                    }).html('<span style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0055b8;">DISPONIBLE</span>');

                    $cell.addClass('selected').css({
                        backgroundColor: '#0055b8',
                        color: '#fff',
                        border: '2px solid #003d82',
                        boxShadow: '0 0 12px rgba(0,85,184,0.5)'
                    }).html('<span style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">✓ SELECCIONADO</span>');
                }

                // Oculta los botones al seleccionar un slot
                $('#calendarButtons').hide();
                $('#confirmSchedule').hide();

                console.log('[DEBUG] slot seleccionado:', { dateKey, hour, driverId, driverName });
                selectSlot(dateKey, hour, hour, driverId, driverName);
            });
        }

    console.log('[DEBUG] Calendario renderizado correctamente');
    log('SUCCESS', 'Calendario renderizado correctamente');
    }

    function parseSlotDate(dateKey) {
        if (!dateKey) {
            return null;
        }
        // Soporta formato /Date(1761195600000)/ de .NET
        var match = /\/Date\((\d+)\)\//.exec(dateKey);
        if (match) {
            var ms = parseInt(match[1], 10);
            var d = new Date(ms);
            return d;
        }
        // Soporta timestamp puro
        if (/^\d+$/.test(dateKey)) {
            return new Date(parseInt(dateKey, 10));
        }
        // Soporta ISO
        var parsed = new Date(dateKey);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }
        return null;
    }

    function formatSlotHour(hourData) {
        if (typeof hourData === 'string' && hourData.length >= 5) {
            return hourData.substring(0, 5);
        }
        if (typeof hourData === 'object' && hourData) {
            var h = hourData.Hours || 0;
            var m = hourData.Minutes || 0;
            return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
        }
        return '';
    }

    function selectSlot(dateKey, hourStart, hourEnd, driverId, driverName) {
        log('INFO', 'selectSlot() llamado', { dateKey: dateKey, hourStart: hourStart, hourEnd: hourEnd, driverId: driverId, driverName: driverName });

        var fullStart = dateKey + ' ' + hourStart + ':00';
        var fullEnd = dateKey + ' ' + hourEnd + ':00';
        var driverText = driverName || 'Conductor asignado';

        $('input[name="dateDelivery"], #dateDelivery').val(fullStart);
        $('input[name="EndDelivery"], #EndDelivery').val(fullEnd);
        $('input[name="driver.user.Id"], #driver_user_Id').val(driverId || '');

        log('SUCCESS', 'Campos actualizados con la selección', {
            dateDelivery: fullStart,
            EndDelivery: fullEnd,
            driverId: driverId
        });

        showSuccess('<strong>' + driverText + '</strong> - ' + dateKey + ' de ' + hourStart + ' a ' + hourEnd);
        $('#calendarButtons').show();
        // Siempre mostrar el botón de guardar aunque no haya slots
        $('#confirmSchedule').show();
    }

    function clearSelection() {
        log('INFO', 'clearSelection() llamado');

        $('input[name="dateDelivery"], #dateDelivery').val('');
        $('input[name="EndDelivery"], #EndDelivery').val('');
        $('input[name="driver.user.Id"], #driver_user_Id').val('');

        $('.slot-available.selected').removeClass('selected').css({
            backgroundColor: '#d1e7f7',
            color: '#0055b8',
            border: '2px solid #0055b8',
            boxShadow: 'none'
        }).html('<span style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0055b8;">DISPONIBLE</span>');

        $('#calendarButtons').hide();
        $('#confirmSchedule').show();
        showInfo('Selección limpiada correctamente');
    }

    function confirmSchedule() {
        log('INFO', 'confirmSchedule() llamado');

        var dateDelivery = $('input[name="dateDelivery"]').val();
        var endDelivery = $('input[name="EndDelivery"]').val();
        var driverId = $('input[name="driver.user.Id"]').val();

        log('INFO', 'Valores a validar', {
            dateDelivery: dateDelivery,
            endDelivery: endDelivery,
            driverId: driverId
        });

        if (!dateDelivery || !endDelivery) {
            showError('Debe seleccionar un horario disponible');
            return false;
        }

        if (!driverId || driverId === '-1') {
            showError('No se pudo identificar un conductor asignado');
            return false;
        }

        $('input[name="dateDelivery"]').val(dateDelivery);
        $('input[name="EndDelivery"]').val(endDelivery);
        $('input[name="driver.user.Id"]').val(driverId);

        log('SUCCESS', 'Agendamiento listo para guardarse');
        showSuccess('✓ Horario agendado. Ahora puede guardar la entrega completa.');
        $('#calendarButtons').hide();
        return true;
    }

    function showSuccess(message) {
        log('INFO', 'Mostrando mensaje de éxito');
        var alertHtml = '<div class="alert alert-success alert-dismissible" role="alert" style="margin-top:15px;">' +
            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>✓ Éxito:</strong> ' + message + '</div>';
        $('#slotsPanel').prepend(alertHtml);
        setTimeout(function () {
            $('#slotsPanel .alert-success').fadeOut(function () { $(this).remove(); });
        }, 5000);
    }

    function showError(message) {
        log('ERROR', 'Mostrando mensaje de error');
        var alertHtml = '<div class="alert alert-danger alert-dismissible" role="alert" style="margin-top:15px;">' +
            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>✗ Error:</strong> ' + message + '</div>';
        $('#slotsPanel').prepend(alertHtml);
        setTimeout(function () {
            $('#slotsPanel .alert-danger').fadeOut(function () { $(this).remove(); });
        }, 5000);
    }

    function showInfo(message) {
        log('INFO', 'Mostrando mensaje informativo');
        var alertHtml = '<div class="alert alert-info alert-dismissible" role="alert" style="margin-top:15px;">' +
            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>ℹ️ Info:</strong> ' + message + '</div>';
        $('#slotsPanel').prepend(alertHtml);
        setTimeout(function () {
            $('#slotsPanel .alert-info').fadeOut(function () { $(this).remove(); });
        }, 5000);
    }

    return {
        loadAvailableSlots: loadAvailableSlots,
        confirmSchedule: confirmSchedule,
        clearSelection: clearSelection,
        init: function () {
            log('INFO', 'Módulo inicializado');
        }
    };
})();

// ========================================
// INTEGRACIÓN CON EL FORMULARIO
// ========================================
$(document).ready(function () {
    console.log('%c[SLOTS] Documento listo, esperando detección de zona...', 'color: blue; font-weight: bold;');

    var lastZoneId = 0;
    var checkCount = 0;
    var zoneCheckInterval = setInterval(function () {
        checkCount++;
        var currentZoneId = parseInt($('#driver_zone_Id').val(), 10) || 0;
        if (!currentZoneId) {
            currentZoneId = parseInt($('input[name="driver.zone.Id"]').val(), 10) || 0;
        }

        if (checkCount % 10 === 0) {
            console.log('[SLOTS] Revisión #' + checkCount + ' - zoneId actual: ' + currentZoneId + ' (previo: ' + lastZoneId + ')');
        }

        if (currentZoneId > 0 && currentZoneId !== lastZoneId) {
            console.log('%c[SLOTS] Zona detectada: ' + currentZoneId, 'color: green; font-weight: bold;');
            lastZoneId = currentZoneId;
            __lbs.delivery_slots.loadAvailableSlots(currentZoneId);
        }
    }, 500);

    $(window).on('beforeunload', function () {
        clearInterval(zoneCheckInterval);
    });

    $(document).on('click', '#clearSchedule', function (e) {
        e.preventDefault();
        __lbs.delivery_slots.clearSelection();
    });

    $(document).on('click', '#confirmSchedule', function (e) {
        e.preventDefault();
        if (__lbs.delivery_slots.confirmSchedule()) {
            var form = $('#MyForm');
            if (form.length) {
                form.submit();
            }
        }
    });
});
