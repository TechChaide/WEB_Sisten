__lbs.zone_assing_driver = (function (lbs, zone_assing_driver) {

    var
      banned_total = new Array(),
      labels,
      culture,
      bindGridActions = function () {
          $(".delete-users").click(function () {
              var that = this;
              window.confirm(labels[culture].user_delete_confirm, function () {
                  $.doPost("Users/Delete", { userID: $(that).data("user") });
              });
          });
      },
      draw_user_grid = function () {
          var aoColumns = [
             //{
             //  "mDataProp": "Id",
             //  bSortable: false
             //},
            {
                "mDataProp": "First_Name",
                bSortable: false
            },
            {
                "mDataProp": "Last_Name",
                bSortable: false
            },
            {
                "mDataProp": "User_Name",
                bSortable: false
            },
            {
                "mDataProp": "actions",
                bSortable: false
            }
          ];

          if ($('#grid-users').length > 0) {
              $('#grid-users').dataTable({
                  "sAjaxSource": window.path("Zones/GetDrivers"),
                  "aoColumns": aoColumns,
                  "aoColumnDefs": [
                    {
                        "aTargets": [3],
                        "fnRender": function (oObj) {
                            var d = $('<p>').append(
                              $('<div>').addClass('btn-group btn-group-sm')
                              .append($('<a>').addClass('btn btn-sm btn-default dropdown-toggle').attr('data-toggle', 'dropdown')
                                .append(labels[culture].options)
                                .append($('<span>').addClass('caret'))
                              )
                              .append($('<ul>').addClass('dropdown-menu pull-right').attr('role', 'menu')
                                //.append($('<li>').append($('<a href=\"/users/Edit?userID= ' + oObj.aData.Id + '\"></a>').text(labels[culture].edit_user)))
                                //.append(oObj.aData.logged_user_id != oObj.aData.Id ? $('<li>').append($('<a>').addClass('delete-users').attr('href', '#').attr('data-user', oObj.aData.Id).text(labels[culture].delete_user)) : '')
                                .append(oObj.aData.isDriver != false ? $('<li>').append($('<a href=\"/Zones/AssingDriverZone?userID= ' + oObj.aData.Id + '\"></a>').text(labels[culture].assing_zone)) : '')
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
                  "fnInitComplete": function (oSettings, json) {
                      $('#grid-users').dataTable().fnSetFilteringEnterPress();
                  },
                  fnDrawCallback: function () {
                      bindGridActions();
                  }
              });
          }
          bindGridActions();
      },
      draw_user_form = function () {
          if (document.forms.length === 0 || !new RegExp(/AssingDriverZone/).test(document.forms[0].action)) return;
          $(document).ready(function () {
              $(".selector").switcher({
                  onSelected: function (args) {
                      $(".active").css("display", args.value == 0 ? "block" : "none");
                      $(".inactive").css("display", args.value == 0 ? "none" : "block");
                  }
              }).select($("[name='user.UserAssing']").val());
          });

          $("[name='status']").click(function () {
              $("#user_UserAssing").val($("[name='status']:checked").val().toLowerCase());
          });

          var zone_users = JSON.parse($("#list_zones").val());
          var itemCheckeds = -1;
          for (var i = 0; i < zone_users.length; i++) {
              if (zone_users[i].DriverHasDeliveries == true) {
                  $("[data-zone = '" + zone_users[i].Id + "']").attr("disabled", true);
              }
          }
          for (var i = 0; i < zone_users.length; i++) {
              if (i == itemCheckeds) {
                  continue;
              } else if (itemCheckeds != -1) {
                  $("[data-zone = '" + zone_users[i].Id + "']").attr("disabled", true);
              }
          }



          //$(".group-feature-selector").change(function () {
          //    var itemChecked = -1;
          //    var zone_users = JSON.parse($("#list_zones").val());
          //    var n = $(".perfil-ul");
          //    var a = n.find("input:checkbox")

          //    for (var i = 0; i < zone_users.length; i++) {
          //        if (a[i].checked == true) {
          //            itemChecked = i;
          //        }
          //    }
          //    if (itemChecked != -1) {
          //        for (var i = 0; i < a.length; i++) {
          //            if (a[i].checked == false) {
          //                $("[data-zone = '" + zone_users[i].Id + "']").attr("disabled", true);
          //            }
          //        }
          //    } else {
          //        for (var i = 0; i < a.length; i++) {
          //            if (i != itemChecked) {
          //                $("[data-zone = '" + zone_users[i].Id + "']").attr("disabled", false);
          //            }
          //        }
          //    }
          //});
      };



    return {
        init: function () {
            labels = new Labels();
            culture = "es";
            draw_user_grid();
            draw_user_form();
        }
    };

}(__lbs.zone_assing_driver || {}));