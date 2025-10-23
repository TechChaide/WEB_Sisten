$.editable.addInputType('selector2', {
	element: function (settings, original) {
		var input = $("<input id='devices' type='hidden' style='width:200px'/>");
		$(this).append(input);
		
		return (input);
	},
	plugin: function (settings, original) {	

		var currentValue = $("#devices").val();

		function isUsed(i, s) {
			for (var y = 0, z = s.length; y < z; y++) {
				if (s[y] === i) return true;
			}
			return false;
		}

		$("#devices", this).select2({
			allowClear: true,
			width: 'resolve',
			placeholder: "Type here",
			multiple: true,
			minimumInputLength: 3,
			maximumSelectionSize: 1,
			query: function (o) {
				var
						a = settings.dataSource(),
						l = settings.itemsTop(),
						s = settings.selectedItems(),
						f = [],
						j = 0,
						k = 0;

				do {

					if (!isUsed(a[j], s) && (o.term.length === 0 || a[j].indexOf(o.term) >= 0)) {
						f[f.length] = { id: a[j], text: a[j] };
						k += 1;
					}

					j += 1;
				} while (j < a.length && k < l);
				o.callback({ results: f });
			}
		});

		if (currentValue.length > 0) {
			$("#devices", this).select2('data', [{ id: currentValue, text: currentValue }]);
		}
		
	}
});