class SignatureView extends Backbone.View
  events: {
  'click a.hide-link'       : 'hideFormat'
  'click a.show-link'           : 'showFormat'
  'mousedown .snippet'          : 'snippetToTextArea'
  }

  initialize: ->



  render: ->
    template = @template()
    $(@el).html(template(@model))

    $('a.hide-link', $(@el)).hide()
    $('a.show-link', $(@el)).show()
    @hideFormat()

    @isParam = @model.isParam

    if @isParam
      $('.notice', $(@el)).text('Click to set as parameter value')

    @

  template: ->
      Handlebars.templates.signature

  # handler for show signature
  hideFormat: (e) ->
    e?.preventDefault()
    $(".snippet", $(@el)).hide()
    $(".description", $(@el)).show()
#    $('.description-link', $(@el)).addClass('selected')
#    $('.show-link', $(@el)).removeClass('selected')
    $('a.show-link', $(@el)).show()
    $('a.hide-link', $(@el)).hide()
    
  # handler for show sample
  showFormat: (e) ->
    e?.preventDefault()
    $(".description", $(@el)).hide()
    $(".snippet", $(@el)).show()
#    $('.snippet-link', $(@el)).addClass('selected')
#    $('.description-link', $(@el)).removeClass('selected')
    $('a.show-link', $(@el)).hide()
    $('a.hide-link', $(@el)).show()
    window.refreshCodeMirror($(@el).find('.json'))

  # handler for snippet to text area
  snippetToTextArea: (e) ->
    if @isParam
      e?.preventDefault()
      textArea = $('textarea', $(@el.parentNode.parentNode.parentNode))
      if $.trim(textArea.val()) == ''
        textArea.val(@model.sampleJSON)


    
