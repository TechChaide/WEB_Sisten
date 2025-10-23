__lbs.users = (function (lbs, users) {

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
                  "sAjaxSource": window.path("Users/GetUsers"),
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
                                .append($('<li>').append($('<a href=\"/users/Edit?userID= ' + oObj.aData.Id + '\"></a>').text(labels[culture].edit_user)))
                                .append(oObj.aData.logged_user_id != oObj.aData.Id ? $('<li>').append($('<a>').addClass('delete-users').attr('href', '#').attr('data-user', oObj.aData.Id).text(labels[culture].delete_user)) : '')
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

          if (document.forms.length === 0 || !new RegExp(/Edit/).test(document.forms[0].action)) return;

      

          $(document).ready(function () {
              $(".selector").switcher({
                  onSelected: function (args) {
                      $(".active").css("display", args.value == 0 ? "block" : "none");
                      $(".inactive").css("display", args.value == 0 ? "none" : "block");
                  }
              }).select($("[name='user.enabled']").val());
          });

          $(".mask").inputmask();

          //$("[name='user.email']").on("keyup", function () {
          //  $("[name='client.administrator.email']").val(this.value);
          //});

          $("[name='user.password']").change(function () {
              var $password = $("[name='user.confirm_password']"),
                passwordText = $("[name='user.password']").val(),
                passwordConfirmText = $("[name='user.confirm_password']").val();

              if (passwordConfirmText != passwordText) {
                  $password.attr({
                      "data-val": true,
                      "maxlength": 10,
                      "data-val-regex": labels[culture].user_change_passwd,
                      "data-val-regex-pattern": "^\\d{10}$",
                      "data-val-isIdentityValid": labels[culture].user_change_passwd,
                  }).updateValidation();
              } else {
                  $password.attr({
                      "maxlength": 25,
                      "data-val": false
                  }).updateValidation();
              }

              $("[name='user.password']").val(this.value);

          });

          $("[name='user.confirm_password']").change(function () {
              var $password = $("[name='user.confirm_password']"),
                passwordText = $("[name='user.password']").val(),
                passwordConfirmText = $("[name='user.confirm_password']").val();


              if (passwordConfirmText != passwordText) {
                  $password.attr({
                      "data-val": true,
                      "maxlength": 10,
                      "data-val-regex": labels[culture].user_change_passwd,
                      "data-val-regex-pattern": "^\\d{10}$",
                      "data-val-isIdentityValid": labels[culture].user_change_passwd,
                  }).updateValidation();
              } else {
                  $password.attr({
                      "maxlength": 25,
                      "data-val": false
                  }).updateValidation();
              }

              $("[name='user.confirm_password']").val(this.value);

          });

          $("[name='user.password_edit']").change(function () {
              $("[name='user.confirm_password_edit']").val('');
              $("[name='user.confirm_password_edit']").attr('class', 'form-control input-sm input-validation-error');
              $("[name='user.confirm_password_edit']").attr({
                  "data-val": true,
                  "maxlength": 10,
                  "data-val-regex": labels[culture].user_change_passwd,
                  "data-val-regex-pattern": "^\\d{10}$",
                  "data-val-isIdentityValid": labels[culture].user_change_passwd,
              }).updateValidation();
          });

          $("[name='user.confirm_password_edit']").change(function () {
              var $password = $("[name='user.confirm_password_edit']"),
                passwordText = $("[name='user.password_edit']").val(),
                passwordConfirmText = $("[name='user.confirm_password_edit']").val();

              if (passwordConfirmText.length != 0) {
                  if (passwordConfirmText != passwordText) {
                      $password.attr({
                          "data-val": true,
                          "maxlength": 10,
                          "data-val-regex": labels[culture].user_change_passwd,
                          "data-val-regex-pattern": "^\\d{10}$",
                          "data-val-isIdentityValid": labels[culture].user_change_passwd,
                      }).updateValidation();
                  } else {
                      $password.attr({
                          "maxlength": 25,
                          "data-val": false
                      }).updateValidation();
                  }
              } else {
                  $password.attr({
                      "maxlength": 25,
                      "data-val": false
                  }).updateValidation();
              }

          });

          $("[name='status']").click(function () {
              $("#user_enabled").val($("[name='status']:checked").val().toLowerCase());
          });

      };



    return {
        init: function () {
            labels = new Labels();
            culture = "es";
            draw_user_form();
            draw_user_grid();
        }
    };

}(__lbs.users || {}));