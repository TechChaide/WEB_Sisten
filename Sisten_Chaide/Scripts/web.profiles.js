__lbs.profiles = (function (lbs, profiles) {

    var
      labels,
      culture,
      bindGridActions = function () {
          $(".delete-profiles").click(function () {
              var that = this;
              window.confirm(labels[culture].profile_delete_confirm, function () {
                  $.doPost("Profiles/Delete", { profileID: $(that).data("profile") });
              });
          });
      },
      draw_profile_grid = function () {
          var aoColumns = [
          {
              "mDataProp": "Id",
              bSortable: false
          },
          {
              "mDataProp": "Name",
              bSortable: false
          },
          {
              "mDataProp": "actions",
              bSortable: false
          }
          ];

          if ($('#grid-profiles').length > 0) {
              $('#grid-profiles').dataTable({
                  "sAjaxSource": window.path("Profiles/GetProfiles"),
                  "aoColumns": aoColumns,
                  "aoColumnDefs": [
                    {
                        "aTargets": [2],
                        "fnRender": function (oObj) {
                            var d = $('<p>').append(
                              $('<div>').addClass('btn-group btn-group-sm')
                                .append($('<a>').addClass('btn btn-sm btn-default dropdown-toggle').attr('data-toggle', 'dropdown')
                                  .append(labels[culture].options)
                                  .append($('<span>').addClass('caret'))
                                )
                                .append($('<ul>').addClass('dropdown-menu pull-right').attr('role', 'menu')
                                  .append($('<li>').append($('<a href=\"/profiles/Edit?profileID= ' + oObj.aData.Id + '\"></a>').text(labels[culture].edit_profile)))
                                  .append(oObj.aData.erasable ? $('<li>').append($('<a>').addClass('delete-profiles').attr('href', '#').attr('data-profiles', oObj.aData.Id).text(labels[culture].delete_profile)) : '')
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
                      $('#grid-profiles').dataTable().fnSetFilteringEnterPress();
                  },
                  fnDrawCallback: function () {
                      bindGridActions();
                  }
              });
          }
          bindGridActions();
      },
      draw_profile_form = function () {
          if (document.forms.length === 0 || !new RegExp(/Edit/).test(document.forms[0].action)) return;

          $(".mask").inputmask();

      }

    return {
        init: function () {
            labels = new Labels();
            culture = "es";
            draw_profile_form();
            draw_profile_grid();
        }
    };

}(__lbs.profiles || {}));