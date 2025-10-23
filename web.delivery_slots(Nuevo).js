// ========================================
// MÓDULO: Selección automática de horarios con calendario
// ========================================
var __lbs = window.__lbs || {};

__lbs.delivery_slots = (function () {
    'use strict';

    var zoneId = null;
    var allSlots = [];

    // ========== FUNCIÓN DE LOG ==========
    function log(level, message, data) {
        var timestamp = new Date().toLocaleTimeString('es-ES');
        var style = '';
        
        switch(level) {
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
        }
        
        var logMsg = '[' + timestamp + '] [SLOTS-' + level + '] ' + message;
        console.log('%c' + logMsg, style);
        
        if (data) {
            console.log('  → Datos:', data);
        }
    }

    // ========== CARGAR HORARIOS DISPONIBLES ==========
    function loadAvailableSlots(zone_id) {
        log('INFO', 'loadAvailableSlots() llamado', { zone_id: zone_id });
        
        if (!zone_id || zone_id <= 0) {
            log('ERROR', 'Zona inválida');
            return;
        }

        zoneId = zone_id;
        log('INFO', 'Iniciando carga de slots para zona', { zoneId: zoneId });

        // Mostrar indicador de carga
        $('#loadingMessage').show();
        $('#errorMessage').hide().html('');
        $('#calendarContainer').hide();

        // Calcular fechas: hoy + 15 días
        var today = new Date();
        var startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        log('INFO', 'Parámetros AJAX', { 
            url: '/Delivery/GetAvailableSlots',
            zoneId: zoneId, 
            startDate: startDate, 
            days: 15 
        });

        // AJAX al backend - 15 días de disponibilidad
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
                log('SUCCESS', 'AJAX exitoso', { responseLength: response ? response.result?.length : 0 });
                log('INFO', 'Respuesta completa del servidor', response);
                
                $('#loadingMessage').hide();

                if (response && response.result && response.result.length > 0) {
                    log('SUCCESS', 'Se encontraron slots', { count: response.result.length });
                    allSlots = response.result;
                    renderCalendar(response.result);
                    $('#calendarContainer').show();
                } else {
                    log('WARNING', 'Sin slots disponibles');
                    $('#errorMessage').html('No hay horarios disponibles para esta zona').show();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#loadingMessage').hide();
                log('ERROR', 'AJAX falló', { 
                    textStatus: textStatus, 
                    errorThrown: errorThrown,
                    status: jqXHR.status,
                    statusText: jqXHR.statusText,
                    responseText: jqXHR.responseText
                });
                $('#errorMessage').html('Error al cargar horarios: ' + textStatus).show();
            }
        });
    }

    // ========== RENDERIZAR CALENDARIO SEMANAL ==========
    function renderCalendar(slots) {
        log('INFO', 'renderCalendar() iniciado', { slotsCount: slots.length });
        
        // Extraer horas únicas y ordenarlas
        var hoursMap = {};
        slots.forEach(function(slot) {
            var startHour = slot.HourStart;
            var hourStr = '';
            if (typeof startHour === 'object' && startHour) {
                var h = startHour.Hours || 0;
                var m = startHour.Minutes || 0;
                hourStr = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
            } else if (typeof startHour === 'string') {
                hourStr = startHour.substring(0, 5);
            }
            hoursMap[hourStr] = true;
        });
        
        var uniqueHours = Object.keys(hoursMap).sort();
        log('INFO', 'Horas disponibles encontradas', { count: uniqueHours.length, hours: uniqueHours });

        // HTML del calendario semanal - DISEÑO MEJORADO
        var html = '<div style="margin: 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">';
        
        // Encabezado con rango de fechas y navegación
        html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding: 0 10px;">';
        html += '<button type="button" class="btn btn-sm" id="prevWeek" style="background-color: #0055b8; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.3s;">← Anterior</button>';
        html += '<h4 id="weekDateRange" style="margin: 0; color: #0055b8; font-size: 18px; font-weight: 700; flex: 1; text-align: center;"></h4>';
        html += '<button type="button" class="btn btn-sm" id="nextWeek" style="background-color: #0055b8; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.3s;">Siguiente →</button>';
        html += '</div>';
        
        // Tabla semanal
        html += '<div style="overflow-x: auto; margin: 20px 0; background: white; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">';
        html += '<table class="table" id="weeklyCalendar" style="margin-bottom: 0; border-collapse: collapse;">';
        html += '<thead>';
        html += '<tr style="background-color: #0055b8; color: white; font-weight: 600;">';
        html += '<th style="width: 100px; padding: 16px 8px; text-align: center; border: none; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">HORA</th>';
        html += '<th id="headerMon" style="width: 140px; padding: 16px 8px; text-align: center; border: none; font-size: 13px; font-weight: 600; color: white;"></th>';
        html += '<th id="headerTue" style="width: 140px; padding: 16px 8px; text-align: center; border: none; font-size: 13px; font-weight: 600; color: white;"></th>';
        html += '<th id="headerWed" style="width: 140px; padding: 16px 8px; text-align: center; border: none; font-size: 13px; font-weight: 600; color: white;"></th>';
        html += '<th id="headerThu" style="width: 140px; padding: 16px 8px; text-align: center; border: none; font-size: 13px; font-weight: 600; color: white;"></th>';
        html += '<th id="headerFri" style="width: 140px; padding: 16px 8px; text-align: center; border: none; font-size: 13px; font-weight: 600; color: white;"></th>';
        html += '<th id="headerSat" style="width: 140px; padding: 16px 8px; text-align: center; border: none; font-size: 13px; font-weight: 600; color: white;"></th>';
        html += '<th id="headerSun" style="width: 140px; padding: 16px 8px; text-align: center; border: none; font-size: 13px; font-weight: 600; color: white;"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="weeklyBody" style="border-bottom: 1px solid #e0e0e0;"></tbody>';
        html += '</table>';
        html += '</div>';
        
        html += '</div>';
        
        $('#calendarContainer').html(html);
        
        // Mostrar el contenedor del calendario
        $('#calendarContainer').show();
        
        // Semana actual
        var currentWeekStart = getMonday(new Date());
        
        // Función para obtener el lunes de una semana
        function getMonday(date) {
            var d = new Date(date);
            var day = d.getDay();
            var diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        }
        
        // Función para renderizar la semana
        function renderWeek(weekStartDate) {
            var dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            var monthShortNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            
            // Actualizar encabezados
            for (var i = 0; i < 7; i++) {
                var day = new Date(weekStartDate);
                day.setDate(day.getDate() + i);
                var dayName = dayNames[i];
                var dayNum = day.getDate();
                var monthShort = monthShortNames[day.getMonth()];
                var headerText = '<div style="font-weight: 600; font-size: 14px;">' + dayName + '</div><div style="font-size: 18px; font-weight: 700; color: #00838f;">' + dayNum + '</div><div style="font-size: 11px; color: rgba(255,255,255,0.9);">' + monthShort + '</div>';
                
                $('#header' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]).html(headerText);
            }
            
            // Crear estructura de datos: {fecha -> {hora -> slot}}
            var slotsByDateAndHour = {};
            allSlots.forEach(function(slot) {
                var timestamp = parseInt(slot.DateKey.replace(/\D/g, ''));
                var dateObj = new Date(timestamp);
                var dateKey = dateObj.toISOString().split('T')[0];
                
                var startHour = slot.HourStart;
                var hourStr = '';
                if (typeof startHour === 'object' && startHour) {
                    var h = startHour.Hours || 0;
                    var m = startHour.Minutes || 0;
                    hourStr = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
                } else if (typeof startHour === 'string') {
                    hourStr = startHour.substring(0, 5);
                }
                
                if (!slotsByDateAndHour[dateKey]) {
                    slotsByDateAndHour[dateKey] = {};
                }
                slotsByDateAndHour[dateKey][hourStr] = slot;
            });
            
            // Renderizar filas por hora
            var html = '';
            uniqueHours.forEach(function(hour, hourIndex) {
                var isAlternate = hourIndex % 2 === 0;
                var rowBg = isAlternate ? '#f5f5f5' : '#ffffff';
                
                html += '<tr style="background-color: ' + rowBg + '; border-bottom: 1px solid #e8e8e8;">';
                html += '<td style="background-color: ' + rowBg + '; text-align: center; font-weight: 600; padding: 12px 8px; color: #424242; font-size: 13px; border-right: 2px solid #ddd;">' + hour + '</td>';
                
                // Para cada día de la semana
                for (var dayOffset = 0; dayOffset < 7; dayOffset++) {
                    var cellDate = new Date(weekStartDate);
                    cellDate.setDate(cellDate.getDate() + dayOffset);
                    var dateKey = cellDate.toISOString().split('T')[0];
                    
                    var slot = null;
                    if (slotsByDateAndHour[dateKey] && slotsByDateAndHour[dateKey][hour]) {
                        slot = slotsByDateAndHour[dateKey][hour];
                    }
                    
                    var cellId = 'cell_' + dateKey + '_' + hour;
                    var cellStyle = 'padding: 12px 8px; text-align: center; min-height: 60px; vertical-align: middle; border-right: 1px solid #f0f0f0; transition: all 0.3s ease; font-weight: 600; font-size: 12px;';
                    
                    if (slot) {
                        // Ocupado o disponible
                        if (slot.AvailableDriverCount > 0) {
                            cellStyle += ' background-color: #d1e7f7; color: #0055b8; cursor: pointer; border: 2px solid #0055b8; font-weight: 600;';
                        } else {
                            cellStyle += ' background-color: #e8e8e8; color: #888; cursor: not-allowed; border: 1px solid #ccc; opacity: 0.6;';
                        }
                    } else {
                        cellStyle += ' background-color: ' + rowBg + '; color: #999;';
                    }
                    
                    var cellClass = slot && slot.AvailableDriverCount > 0 ? 'slot-available' : '';
                    var cellContent = '';
                    
                    if (slot) {
                        if (slot.AvailableDriverCount > 0) {
                            cellContent = '<span style="display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0055b8;">DISPONIBLE</span>';
                        } else {
                            cellContent = '<span style="display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666;">OCUPADO</span>';
                        }
                    }
                    
                    html += '<td id="' + cellId + '" style="' + cellStyle + '" class="' + cellClass + '" ';
                    if (slot && slot.AvailableDriverCount > 0) {
                        html += 'data-datekey="' + dateKey + '" data-hour="' + hour + '" data-driverid="' + slot.AssignedDriverId + '" data-drivername="' + slot.AssignedDriverName + '" data-hourlast="' + hour + '"';
                    }
                    html += '>' + cellContent + '</td>';
                }
                html += '</tr>';
            });
            
            $('#weeklyBody').html(html);
            
            // Actualizar rango de fechas
            var startDate = new Date(weekStartDate);
            var endDate = new Date(weekStartDate);
            endDate.setDate(endDate.getDate() + 6);
            var startStr = startDate.getDate() + ' de ' + monthShortNames[startDate.getMonth()];
            var endStr = endDate.getDate() + ' de ' + monthShortNames[endDate.getMonth()];
            $('#weekDateRange').text('📅 Semana: ' + startStr + ' - ' + endStr);
            
            // Event listeners para celdas disponibles
            $('.slot-available').off('click').on('click', function() {
                var cellId = $(this).attr('id');
                var dateKey = $(this).attr('data-datekey');
                var hour = $(this).attr('data-hour');
                var driverId = $(this).attr('data-driverid');
                var driverName = $(this).attr('data-drivername');
                
                log('INFO', 'Celda clickeada', { dateKey, hour, driverId, driverName });
                
                // Marcar como seleccionado
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected').css({
                        'background-color': '#d1e7f7',
                        'color': '#0055b8',
                        'border': '2px solid #0055b8'
                    }).html('<span style="display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0055b8;">DISPONIBLE</span>');
                } else {
                    $('.slot-available.selected').removeClass('selected').css({
                        'background-color': '#d1e7f7',
                        'color': '#0055b8',
                        'border': '2px solid #0055b8'
                    }).html('<span style="display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0055b8;">DISPONIBLE</span>');
                    
                    $(this).addClass('selected').css({
                        'background-color': '#0055b8',
                        'color': '#fff',
                        'border': '2px solid #003d82',
                        'box-shadow': '0 0 12px rgba(0, 85, 184, 0.5)'
                    }).html('<span style="display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">✓ SELECCIONADO</span>');
                }
                
                // Guardar selección
                selectSlot(dateKey, hour, hour, driverId, driverName);
            });
            
            // Hover effects
            $('.slot-available').on('mouseenter', function() {
                if (!$(this).hasClass('selected')) {
                    $(this).css('box-shadow', '0 0 15px rgba(0, 85, 184, 0.4)');
                }
            }).on('mouseleave', function() {
                if (!$(this).hasClass('selected')) {
                    $(this).css('box-shadow', 'none');
                }
            });
        }
        
        // Navegar semanas
        $('#prevWeek').off('click').on('click', function() {
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
            renderWeek(new Date(currentWeekStart));
        }).on('mouseenter', function() {
            $(this).css('background-color', '#003d82');
        }).on('mouseleave', function() {
            $(this).css('background-color', '#0055b8');
        });
        
        $('#nextWeek').off('click').on('click', function() {
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            renderWeek(new Date(currentWeekStart));
        }).on('mouseenter', function() {
            $(this).css('background-color', '#003d82');
        }).on('mouseleave', function() {
            $(this).css('background-color', '#0055b8');
        });
        
        $('#todayBtn').off('click').on('click', function() {
            currentWeekStart = getMonday(new Date());
            renderWeek(new Date(currentWeekStart));
        }).on('mouseenter', function() {
            $(this).css('background-color', '#5a5a5a');
        }).on('mouseleave', function() {
            $(this).css('background-color', '#999');
        });
        
        // Renderizar semana inicial
        renderWeek(currentWeekStart);
        
        log('SUCCESS', 'Calendario semanal renderizado');
    }

    // ========== SELECCIONAR UN SLOT ==========
    function selectSlot(dateKey, hourStart, hourEnd, driverId, driverName) {
        log('INFO', 'selectSlot() llamado', { dateKey, hourStart, hourEnd, driverId, driverName });

        var startTime = hourStart;
        var endTime = hourEnd;
        var fullStart = dateKey + ' ' + startTime + ':00';
        var fullEnd = dateKey + ' ' + endTime + ':00';

        log('INFO', 'Valores a asignar', { fullStart, fullEnd, driverId });

        // Pre-llenar campos del formulario
        // CORRECCIÓN: Usar nombres exactos de atributos HTML
        $('input[name="dateDelivery"]').val(fullStart);
        $('input[name="EndDelivery"]').val(fullEnd);
        $('input[name="driver.user.Id"]').val(driverId);  // CORRECCIÓN: Nombre exacto del hidden field

        log('SUCCESS', 'Campos pre-llenados correctamente', {
            dateDelivery: fullStart,
            EndDelivery: fullEnd,
            'driver.user.Id': driverId
        });

        // Mostrar confirmación
        var msg = '<strong>' + driverName + '</strong> - ' + dateKey + ' de ' + startTime + ' a ' + endTime;
        showSuccess(msg);

        // Mostrar botones de calendario
        $('#calendarButtons').show();
    }

    // ========== LIMPIAR SELECCIÓN ==========
    function clearSelection() {
        log('INFO', 'clearSelection() llamado');
        
        $('#dateDelivery').val('');
        $('#EndDelivery').val('');
        $('#driver_user_Id').val('');
        
        // Limpiar estilos de selección en el calendario
        $('.slot-available.selected').removeClass('selected').css({
            'background-color': '#d1e7f7',
            'color': '#0055b8',
            'border': '2px solid #0055b8'
        }).html('<span style="display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0055b8;">DISPONIBLE</span>');
        
        $('#calendarButtons').hide();
        
        // Mostrar alerta
        showInfo('Selección limpiada correctamente');
    }

    // ========== CONFIRMAR AGENDAMIENTO ==========
    function confirmSchedule() {
        log('INFO', 'confirmSchedule() llamado');
        
        var dateDelivery = $('#dateDelivery').val();
        var endDelivery = $('#EndDelivery').val();
        var driverId = $('#driver_user_Id').val();
        
        log('INFO', 'Datos a guardar', { dateDelivery, endDelivery, driverId });
        
        // Validar que hay selección
        if (!dateDelivery || !endDelivery || !driverId) {
            showError('Debe seleccionar un horario disponible');
            return;
        }
        
        // Aquí se puede hacer un AJAX para guardar en la BD
        // Por ahora solo registramos el éxito
        log('SUCCESS', 'Agendamiento confirmado', {
            dateDelivery: dateDelivery,
            endDelivery: endDelivery,
            driverId: driverId
        });
        
        showSuccess('✓ Horario agendado exitosamente. Ahora puede guardar la entrega completa.');
        
        // Ocultar botones
        $('#calendarButtons').hide();
    }

    // ========== UTILIDADES ==========
    function showSuccess(message) {
        log('INFO', 'Mostrando alerta de éxito');
        
        var alertHtml = '<div class="alert alert-success alert-dismissible" role="alert" style="margin-top: 15px;">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>✓ Éxito:</strong> ' + message + '</div>';
        
        $('#slotsPanel').prepend(alertHtml);
        
        setTimeout(function () {
            $('#slotsPanel .alert-success').fadeOut(function () { $(this).remove(); });
        }, 5000);
    }

    function showError(message) {
        log('ERROR', 'Mostrando alerta de error');
        
        var alertHtml = '<div class="alert alert-danger alert-dismissible" role="alert" style="margin-top: 15px;">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>✗ Error:</strong> ' + message + '</div>';
        
        $('#slotsPanel').prepend(alertHtml);
        
        setTimeout(function () {
            $('#slotsPanel .alert-danger').fadeOut(function () { $(this).remove(); });
        }, 5000);
    }

    function showInfo(message) {
        log('INFO', 'Mostrando alerta informativa');
        
        var alertHtml = '<div class="alert alert-info alert-dismissible" role="alert" style="margin-top: 15px;">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>ℹ️ Info:</strong> ' + message + '</div>';
        
        $('#slotsPanel').prepend(alertHtml);
        
        setTimeout(function () {
            $('#slotsPanel .alert-info').fadeOut(function () { $(this).remove(); });
        }, 5000);
    }

    // ========== API PÚBLICA ==========
    // ========== GUARDAR AGENDAMIENTO ==========
    function confirmSchedule() {
        log('INFO', 'confirmSchedule() - Guardando agendamiento');
        
        // Leer valores usando NAME CORRECTOS
        var dateDelivery = $('input[name="dateDelivery"]').val();
        var endDelivery = $('input[name="EndDelivery"]').val();
        var driverId = $('input[name="driver.user.Id"]').val();  // CORRECCIÓN: Usar el nombre exacto
        
        console.log('%c=== CONFIRMACIÓN DE AGENDAMIENTO ===', 'color: #FF6B00; font-size: 14px; font-weight: bold;');
        console.log('dateDelivery:', dateDelivery);
        console.log('endDelivery:', endDelivery);
        console.log('driver.user.Id:', driverId);
        
        // DEBUG: MOSTRAR TODOS LOS CAMPOS DEL FORMULARIO
        console.log('%c=== TODOS LOS INPUTS DEL FORMULARIO ===', 'color: #0055B8; font-weight: bold;');
        var allInputs = {};
        $('#MyForm').find('input').each(function() {
            var name = $(this).attr('name');
            var value = $(this).val();
            allInputs[name] = value;
            console.log('[' + name + '] = ' + (value ? value : '(vacío)'));
        });
        
        // Validar que se haya seleccionado un slot
        if (!dateDelivery || dateDelivery.trim() === '') {
            log('ERROR', 'No hay fecha seleccionada');
            alert('❌ Por favor selecciona un horario disponible primero');
            return false;
        }
        
        if (!driverId || driverId.trim() === '' || driverId === '-1') {
            log('ERROR', 'No hay conductor seleccionado');
            alert('❌ Por favor selecciona un horario disponible primero');
            return false;
        }
        
        log('SUCCESS', 'Datos validados, enviando formulario', { dateDelivery, endDelivery, driverId });
        
        // Obtener el formulario
        var form = $('#MyForm');
        if (form.length === 0) {
            log('ERROR', 'Formulario no encontrado');
            alert('❌ Error: No se encontró el formulario');
            return false;
        }
        
        // RE-ASIGNAR LOS VALORES JUSTO ANTES DE ENVIAR
        // Asegurar que están frescos en el DOM
        $('input[name="dateDelivery"]').val(dateDelivery);
        $('input[name="EndDelivery"]').val(endDelivery);
        $('input[name="driver.user.Id"]').val(driverId);
        
        console.log('%c=== VERIFICACIÓN FINAL ANTES DE ENVIAR ===', 'color: #228B22; font-weight: bold;');
        console.log('dateDelivery:', $('input[name="dateDelivery"]').val());
        console.log('endDelivery:', $('input[name="EndDelivery"]').val());
        console.log('driver.user.Id:', $('input[name="driver.user.Id"]').val());
        
        // DEBUG: Serializar el formulario para ver qué se envía
        var serialized = form.serialize();
        console.log('%c=== FORMULARIO SERIALIZADO (LO QUE SE ENVÍA) ===', 'color: #FF1493; font-weight: bold; font-size: 13px;');
        console.log(serialized);
        
        // GUARDAR EN LOCALSTORAGE PARA QUE PERSISTA DESPUÉS DE RECARGA
        var formData = {
            timestamp: new Date().toLocaleTimeString('es-ES'),
            serialized: serialized,
            inputs: allInputs
        };
        localStorage.setItem('lastFormSubmission', JSON.stringify(formData));
        console.log('%c✓ Datos guardados en localStorage', 'color: green; font-weight: bold;');
        
        console.log('%c>>> ENVIANDO FORMULARIO AHORA <<<', 'color: red; font-size: 13px; font-weight: bold; animation: blink 1s;');
        
        // Pequeño delay para que veas los logs (500ms)
        setTimeout(function() {
            form.submit();
        }, 500);
        
        return false; // Prevenir submit doble
    }
    
    // ========== LIMPIAR SELECCIÓN ==========
    function clearSelection() {
        log('INFO', 'clearSelection() - Cancelando selección');
        
        // Limpiar campos - usando NOMBRES EXACTOS
        $('input[name="dateDelivery"]').val('');
        $('input[name="EndDelivery"]').val('');
        $('input[name="driver.user.Id"]').val('');  // CORRECCIÓN: Nombre exacto
        
        // Remover estilo de selección en el calendario
        $('.slot-available.selected').removeClass('selected').css({
            'background-color': '#d1e7f7',
            'color': '#0055b8',
            'border': '2px solid #0055b8'
        }).html('<span style="display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0055b8;">DISPONIBLE</span>');
        
        $('#calendarButtons').hide();
        
        log('SUCCESS', 'Selección cancelada correctamente');
    }

    return {
        loadAvailableSlots: loadAvailableSlots,
        confirmSchedule: confirmSchedule,
        clearSelection: clearSelection,
        init: function () { log('INFO', 'Módulo inicializado'); }
    };
})();

// ========================================
// INTEGRACIÓN CON FORMULARIO
// ========================================
$(document).ready(function () {
    console.log('%c[SLOTS] ========== DOCUMENTO LISTO ==========', 'color: blue; font-weight: bold;');
    console.log('[SLOTS] Esperando detección de zona...');

    // Monitorear cuando se llena el ID de zona
    // (Esto sucede después de GetDriverByPoint)
    var lastZoneId = 0;
    var checkCount = 0;
    
    var zoneCheckInterval = setInterval(function () {
        checkCount++;
        var currentZoneId = parseInt($('#driver_zone_Id').val()) || 0;
        
        // Cada 10 checks (5 segundos) mostrar debug
        if (checkCount % 10 === 0) {
            console.log('[SLOTS] Check #' + checkCount + ' - currentZoneId: ' + currentZoneId + ', lastZoneId: ' + lastZoneId);
        }
        
        if (currentZoneId > 0 && currentZoneId !== lastZoneId) {
            console.log('%c[SLOTS] ★ ZONA DETECTADA: ' + currentZoneId, 'color: green; font-weight: bold;');
            lastZoneId = currentZoneId;
            __lbs.delivery_slots.loadAvailableSlots(currentZoneId);
        }
    }, 500);
    
    // Limpiar interval si se navega a otra página
    $(window).on('beforeunload', function () {
        clearInterval(zoneCheckInterval);
    });

    // ========== MANEJADORES DE BOTONES DEL CALENDARIO ==========
    $(document).on('click', '#clearSchedule', function(e) {
        e.preventDefault();
        __lbs.delivery_slots.clearSelection();
    });

    $(document).on('click', '#confirmSchedule', function(e) {
        e.preventDefault();
        __lbs.delivery_slots.confirmSchedule();
    });
});
