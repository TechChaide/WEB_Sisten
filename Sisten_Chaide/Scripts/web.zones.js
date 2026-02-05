__lbs.zones = (function (lbs, zones) {

    var
        banned_total = new Array(),
        labels,
        culture,
        bindGridActions = function() {
            $(".delete-zone").click(function() {
                var that = this;
                //window.confirm(labels[culture].user_delete_confirm, function() {
                var r = confirm(labels[culture].zone_delete_confirm);
                if (r == true) {
                    $.doPost("Zones/DeleteZone", { zoneId: $(that).data("zone") });
                } else {

                }

                //});
            });
        },
        draw_zone_grid = function() {
            var aoColumns = [
                {
                    "mDataProp": "Id",
                    bSortable: false
                },
                {
                    "mDataProp": "name",
                    bSortable: false
                },
                {
                    "mDataProp": "CreationDateStr",
                    bSortable: false
                },
                {
                    "mDataProp": "actions",
                    bSortable: false
                }
            ];

            if ($('#grid-zones').length > 0) {
                $('#grid-zones').dataTable({
                    "sAjaxSource": window.path("Zones/GetZones"),
                    "aoColumns": aoColumns,
                    "aoColumnDefs": [
                        {
                            "aTargets": [3],
                            "fnRender": function(oObj) {
                                var d = $('<p>').append(
                                    $('<div>').addClass('btn-group btn-group-sm')
                                    .append($('<a>').addClass('btn btn-sm btn-default dropdown-toggle').attr('data-toggle', 'dropdown')
                                        .append(labels[culture].options)
                                        .append($('<span>').addClass('caret'))
                                    )
                                    .append($('<ul>').addClass('dropdown-menu pull-right').attr('role', 'menu')
                                        .append(oObj.aData.isDriver != false ? $('<li>').append($('<a href=\"/Zones/EditZone?zoneID= ' + oObj.aData.Id + '\"></a>').text(labels[culture].editZone)) : '')
                                        .append(oObj.aData.logged_user_id != oObj.aData.Id ? $('<li>').append($('<a>').addClass('delete-zone').attr('href', '#').attr('data-zone', oObj.aData.Id).text(labels[culture].delete_zone)) : '')
                                    )
                                );
                                return d.html();
                            }
                        }
                    ],
                    "iDisplayLength": 25,
                    "bProcessing": true,
                    "bServerSide": true,
                    "sPaginationType": "bootstrap",
                    "oLanguage": {
                        "sUrl": ["../../Content/data-tables/", culture, ".txt"].join("")
                    },
                    "fnInitComplete": function(oSettings, json) {
                        $('#grid-zones').dataTable().fnSetFilteringEnterPress();
                    },
                    fnDrawCallback: function() {
                        bindGridActions();
                    }
                });
            }
            bindGridActions();
        };
    



    return {
        init: function () {
            labels = new Labels();
            culture = "es";
            draw_zone_grid();
        }
    };

}(__lbs.zones || {}));