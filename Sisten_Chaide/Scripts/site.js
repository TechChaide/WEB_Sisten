/* Variables globales */


/* Snack bar*/

(function ($) {

    $(document)
        .ready(function () {
            //$("body").append("<div id=snackbar-container/>");
            //$(".help").on("click", function (ev) {
            //    ev.preventDefault();
            //    showHelp();
            //})
        });

});
/* Cargando */
function showLoading() {
    $(".opaquebg, .loadPage").css("display", "block");
}

function hideLoading() {
    $(".opaquebg, .loadPage").css("display", "none");
}


