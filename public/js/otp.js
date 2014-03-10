$(function() {
	var api = 'http://127.0.0.1:3000'

	var shareTemplate = Handlebars.compile($('#share-template').html())
	var decryptTemplate = Handlebars.compile($('#decrypt-template').html())
	var resultTemplate = Handlebars.compile($('#result-template').html())

	$('#encrypt').submit(function( event ) {
		$.post( api, $(this).serialize(), function( data ) {
			$('#content').html(shareTemplate(data))
		}, "json")
		event.preventDefault();
	})

	
	var hash = location.hash.replace('#', '')
	if(hash) {
		$('#content').html(decryptTemplate())
	}

	$('#decrypt').submit(function( event ) {
		$.post( api + '/' + hash, $(this).serialize(), function( data ) {
			$('#content').html(resultTemplate(data))
		}, "json")
		event.preventDefault();
	})
})
