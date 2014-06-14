class Renderer
  constructor: ->
    @containerName = "container"
    @width = window.innerWidth
    @height = window.innerHeight
    @clearColor = 0xBBBBBB

  setDOM: ->
    if Detector.webgl
      @render = new THREE.WebGLRenderer()
      @render.setClearColor(@clearColor, 1)
    else
      Detector.addGetWebGLMessage()
      return false

    @render.setSize(@width, @height)

    document.getElementById(@containerName)
    .appendChild(@render.domElement)

class Application
  constructor: () ->
    @renderer = new Renderer()

  init: ->
    if not @renderer.setDOM() then return
    @scene = new THREE.Scene()
    @scene.fog = new THREE.Fog( 0xffffff, 2000, 10000 )
    @camera = new THREE.PerspectiveCamera(50, @renderer.width / @renderer.height, 1, 10000 )
    @camera.position.set -0.8, 0, 5
    @cameraControls	= new THREEx.DragPanControls(@camera)

    @scene.add( new THREE.AmbientLight( 0xcccccc ) )
    @directionalLight = new THREE.DirectionalLight(0xeeeeee )
    @directionalLight.position.x = Math.random() - 0.5
    @directionalLight.position.y = Math.random() - 0.5
    @directionalLight.position.z = Math.random() - 0.5
    @directionalLight.position.normalize()
    @scene.add( @directionalLight )

    line_material = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } )
    geometry = new THREE.Geometry()
    floor = -0.04
    step = 1
    size = 14
    for i in [0..size / step * 2]
      geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
      geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );
      geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
      geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );

    line = new THREE.Line( geometry, line_material, THREE.LinePieces )
    @scene.add( line )

    @addObjects()

    THREEx.WindowResize.bind @renderer.render, @camera
    if( THREEx.FullScreen.available() )
      THREEx.FullScreen.bindKey()

  addObjects: =>
    loader = new THREE.ColladaLoader()
    @t = 0
    @dae = @skin = null
    loader.load 'content/monster/monster.dae', (collada) =>
      @dae = collada.scene
      @skin = collada.skins[ 0 ]
      @dae.scale.x = @dae.scale.y = @dae.scale.z = 0.002
      @dae.rotation.x = -Math.PI/2
      @dae.updateMatrix()
      @scene.add(@dae)

  appendStats: ->
    @stats	= new Stats();
    @stats.domElement.style.position	= 'absolute'
    @stats.domElement.style.right	= '0px'
    @stats.domElement.style.bottom	= '0px'
    document.body.appendChild( @stats.domElement )

  processRender: ->
    @stats.update()
    @cameraControls.update()
    @renderer.render.render(@scene, @camera)

  animate: ->
    @processRender()
    requestAnimationFrame @animate.bind @

    if  @t > 30  then @t = 0
    if (@skin )
      for i in [0..@skin.morphTargetInfluences.length]
        @skin.morphTargetInfluences[ i ] = 0;

      @skin.morphTargetInfluences[ Math.floor( @t ) ] = 1
      @t += 0.5

Game = new Application()
document.addEventListener "DOMContentLoaded", ->
  return if not Game.init()
  do Game.appendStats
  do Game.animate
