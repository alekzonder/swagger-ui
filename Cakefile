fs          = require 'fs'
path        = require 'path'
{exec}      = require 'child_process'
less        = require 'less'

sourceFiles  = [
  'SwaggerUi'
  'view/HeaderView'
  'view/MainView'
  'view/ResourceView'
  'view/OperationView'
  'view/StatusCodeView'
  'view/ParameterView'
  'view/SignatureView'
  'view/ContentTypeView'
  'view/ResponseContentTypeView'
  'view/ParameterContentTypeView'
]

jsAllFiles = [
  'lib/shred.bundle.js',
  'lib/jquery-1.8.0.min.js',
  'lib/jquery.slideto.min.js',
  'lib/jquery.wiggle.min.js',
  'lib/jquery.ba-bbq.min.js',
  'lib/handlebars-1.0.0.js',
  'lib/underscore-min.js',
  'lib/backbone-min.js',
  'lib/swagger.js',
  'swagger-ui.js',
  'lib/codemirror/3.18/lib/codemirror.js',
  'lib/codemirror/3.18/mode/xml/xml.js',
  'lib/codemirror/3.18/mode/javascript/javascript.js',
  'lib/codemirror/3.18/keymap/extra.js',
  'lib/codemirror/3.18/addon/selection/active-line.js',
  'lib/codemirror/3.18/addon/edit/matchbrackets.js',
  'lib/codemirror/3.18/addon/fold/foldcode.js',
  'lib/codemirror/3.18/addon/fold/foldgutter.js',
  'lib/codemirror/3.18/addon/fold/brace-fold.js',
  'lib/codemirror/3.18/addon/fold/xml-fold.js',
  'lib/codemirror/3.18/addon/fold/comment-fold.js',
  'lib/codemirror/3.18/addon/display/fullscreen.js'
]


cssAllFiles = [
  'css/highlight.default.css',
  'css/screen.css',
  'lib/codemirror/3.18/lib/codemirror.css',
  'lib/codemirror/3.18/addon/display/fullscreen.css'
]

task 'clean', 'Removes distribution', ->
  console.log 'Clearing dist...'
  exec 'rm -rf dist'

task 'dist', 'Build a distribution', ->
  console.log "Build distribution in ./dist"
  fs.mkdirSync('dist') if not path.existsSync('dist')
  fs.mkdirSync('dist/lib') if not path.existsSync('dist/lib')

  appContents = new Array remaining = sourceFiles.length
  for file, index in sourceFiles then do (file, index) ->
    console.log "   : Reading src/main/coffeescript/#{file}.coffee"
    fs.readFile "src/main/coffeescript/#{file}.coffee", 'utf8', (err, fileContents) ->
      throw err if err
      appContents[index] = fileContents
      precompileTemplates() if --remaining is 0

  precompileTemplates= ->
    console.log '   : Precompiling templates...'
    templateFiles  = fs.readdirSync('src/main/template')
    templateContents = new Array remaining = templateFiles.length
    for file, index in templateFiles then do (file, index) ->
      console.log "   : Compiling src/main/template/#{file}"
      exec "handlebars src/main/template/#{file} -f dist/_#{file}.js", (err, stdout, stderr) ->
        throw err if err
        fs.readFile 'dist/_' + file + '.js', 'utf8', (err, fileContents) ->
          throw err if err
          templateContents[index] = fileContents
          fs.unlink 'dist/_' + file + '.js'
          if --remaining is 0
            templateContents.push '\n\n'
            fs.writeFile 'dist/_swagger-ui-templates.js', templateContents.join('\n\n'), 'utf8', (err) ->
              throw err if err
              build()



  build = ->
    console.log '   : Collecting Coffeescript source...'

    appContents.push '\n\n'
    fs.writeFile 'dist/_swagger-ui.coffee', appContents.join('\n\n'), 'utf8', (err) ->
      throw err if err
      console.log '   : Compiling...'
      exec 'coffee --compile dist/_swagger-ui.coffee', (err, stdout, stderr) ->
        throw err if err
        fs.unlink 'dist/_swagger-ui.coffee'
        console.log '   : Combining with javascript...'
        exec 'cat src/main/javascript/doc.js src/main/javascript/codeMirrorFunctions.js dist/_swagger-ui-templates.js dist/_swagger-ui.js > dist/swagger-ui.js', (err, stdout, stderr) ->
          throw err if err
          fs.unlink 'dist/_swagger-ui.js'
          fs.unlink 'dist/_swagger-ui-templates.js'
          console.log '   : Minifying all...'
          exec 'java -jar "./bin/yuicompressor-2.4.7.jar" --type js -o ' + 'dist/swagger-ui.min.js ' + 'dist/swagger-ui.js', (err, stdout, stderr) ->
            throw err if err
            lessc()
            buildAll()

  buildAll = ->
    console.log '   : Combining all javascript to swagger-ui.all.js ...'
    exec 'cat dist/'+ jsAllFiles.join(' dist/') + ' > dist/swagger-ui.all.js', (err, stdout, stderr) ->
      throw err if err
      console.log '   : Combining all css to swagger-ui.all.css ...'
      exec 'cat dist/'+ cssAllFiles.join(' dist/') + ' > dist/swagger-ui.all.css', (err, stdout, stderr) ->
        throw err if err
#      console.log '   : Minifying swagger-ui.all.js ...'
#      exec 'java -jar "./bin/yuicompressor-2.4.7.jar" --type js -o ' + 'dist/swagger-ui.all.min.js ' + 'dist/swagger-ui.all.js', (err, stdout, stderr) ->
#        throw err if err


  lessc = ->
    # Someone who knows CoffeeScript should make this more Coffee-licious
    console.log '   : Compiling LESS...'

    less.render fs.readFileSync("src/main/less/screen.less", 'utf8'), (err, css) ->
      console.log err
      fs.writeFileSync("src/main/html/css/screen.css", css)
    pack()

  pack = ->
    console.log '   : Packaging...'
    exec 'cp -r lib dist'
    console.log '   : Copied swagger-ui libs'
    exec 'cp -r node_modules/swagger-client/lib/swagger.js dist/lib'
    console.log '   : Copied swagger dependencies'
    exec 'cp -r src/main/html/* dist'
    console.log '   : Copied html dependencies'
    console.log '   !'

task 'spec', "Run the test suite", ->
  exec "open spec.html", (err, stdout, stderr) ->
    throw err if err

task 'watch', 'Watch source files for changes and autocompile', ->
  # Function which watches all files in the passed directory
  watchFiles = (dir) ->
    files = fs.readdirSync(dir)
    for file, index in files then do (file, index) ->
      console.log "   : " + dir + "/#{file}"
      fs.watchFile dir + "/#{file}", (curr, prev) ->
        if +curr.mtime isnt +prev.mtime
          invoke 'dist'

  notify "Watching source files for changes..."

  # Watch specific source files
  for file, index in sourceFiles then do (file, index) ->
    console.log "   : " + "src/main/coffeescript/#{file}.coffee"
    fs.watchFile "src/main/coffeescript/#{file}.coffee", (curr, prev) ->
      if +curr.mtime isnt +prev.mtime
        invoke 'dist'

  # watch all files in these folders
  watchFiles("src/main/template")
  watchFiles("src/main/javascript")
  watchFiles("src/main/html")
  watchFiles("src/main/less")
  watchFiles("src/test")

notify = (message) ->
  return unless message?
  console.log message
#  options =
#    title: 'CoffeeScript'
#    image: 'bin/CoffeeScript.png'
#  try require('growl') message, options
