$(function() {
	var api = 'http://127.0.0.1:3000'

	var shareTemplate   = Handlebars.compile($('#share-template').html())
	var decryptTemplate = Handlebars.compile($('#decrypt-template').html())
	var resultTemplate  = Handlebars.compile($('#result-template').html())
	var alertTemplate   = Handlebars.compile($('#alert-template').html())

	var hash = location.hash.replace('#', '')

	$('#encrypt').submit(function( event ) {
		if ($("#text").val()) {
			$.post( api, $(this).serialize())
				.done(function( data ) {
					$('#content').html(shareTemplate(data))
				}, "json")
				.fail(function(xhr, textStatus, errorThrown) {
					$('#info').html(alertTemplate({ error: 'Backend not reachable, come back later.' }))
				}, "json")
		}
		event.preventDefault();
	})
	
	if(hash) {
		$.get( api + '/' + hash)
			.done(function(data) {
				$('#content').html(decryptTemplate())
				
				$('#decrypt').submit(function( event ) {
					$.post( api + '/' + hash, $(this).serialize())
						.done(function( data ) {
							$('#content').html(resultTemplate(data))
						}, "json")
						.fail(function(xhr, textStatus, errorThrown) {
							$('#info').html(alertTemplate(xhr.responseJSON))
						}, "json")
					event.preventDefault();
				})
			})
			.fail(function(xhr, textStatus, errorThrown) {
				$('#info').html(alertTemplate(xhr.responseJSON))
			})
	}

})
