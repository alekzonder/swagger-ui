window.createCodeMirror = function(e) {

	if ($(e).data('CodeMirrorInstance')) {

		var editor = $(e).data('CodeMirrorInstance');

		if (!$(e).find('.CodeMirror')) {
			editor.setValue(e);
		}

		editor.refresh();
		return false;
	}

	var $this = $(e),
		$code = $(e).html(),
		$unescaped = $('<div/>').html($code).text(),
		json;


	if ($unescaped) {
		json = JSON.parse($unescaped);
	} else {
		json = '';
	}

	$unescaped = JSON.stringify(json, null, "\t");

	$this.empty();

	var editor = CodeMirror(e, {
		value: $unescaped,
		mode: 'javascript',
		lineNumbers: false,
		readOnly: true,
		lineWrapping: true,
		styleActiveLine: true,
		matchBrackets: true,
		extraKeys: {
			"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
			"F11": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}

		},
		foldGutter: {
			rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)
		},

		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]

	});

	$(e).data('CodeMirrorInstance', editor);
};


window.refreshCodeMirror = function(e) {
	var editor = $(e).data('CodeMirrorInstance');

	if (editor) {
		editor.refresh();
	}
};

window.hasCodeMirror = function(element) {
	if ($(element).data('CodeMirrorInstance')) {
		return true;
	} else {
		return false;
	}
};


window.setCodeMirrorContent = function(element, content) {

	if (window.hasCodeMirror(element)) {
		var
			editor = $(element).data('CodeMirrorInstance'),
			json;

		if (content) {
			json = JSON.parse(content);
		} else {
			json = '';
		}

		content = JSON.stringify(json, null, "\t");

		editor.setValue(content);
	}

};