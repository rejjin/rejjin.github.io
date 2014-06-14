// Generated by CoffeeScript 1.7.1
(function() {
  var Application, Game, Renderer,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Renderer = (function() {
    function Renderer() {
      this.containerName = "container";
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.clearColor = 0xBBBBBB;
    }

    Renderer.prototype.setDOM = function() {
      if (Detector.webgl) {
        this.render = new THREE.WebGLRenderer();
        this.render.setClearColor(this.clearColor, 1);
      } else {
        Detector.addGetWebGLMessage();
        return false;
      }
      this.render.setSize(this.width, this.height);
      return document.getElementById(this.containerName).appendChild(this.render.domElement);
    };

    return Renderer;

  })();

  Application = (function() {
    function Application() {
      this.addObjects = __bind(this.addObjects, this);
      this.renderer = new Renderer();
    }

    Application.prototype.init = function() {
      var floor, geometry, i, line, line_material, size, step, _i, _ref;
      if (!this.renderer.setDOM()) {
        return;
      }
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0xffffff, 2000, 10000);
      this.camera = new THREE.PerspectiveCamera(50, this.renderer.width / this.renderer.height, 1, 10000);
      this.camera.position.set(-0.8, 0, 5);
      this.cameraControls = new THREEx.DragPanControls(this.camera);
      this.scene.add(new THREE.AmbientLight(0xcccccc));
      this.directionalLight = new THREE.DirectionalLight(0xeeeeee);
      this.directionalLight.position.x = Math.random() - 0.5;
      this.directionalLight.position.y = Math.random() - 0.5;
      this.directionalLight.position.z = Math.random() - 0.5;
      this.directionalLight.position.normalize();
      this.scene.add(this.directionalLight);
      line_material = new THREE.LineBasicMaterial({
        color: 0xcccccc,
        opacity: 0.2
      });
      geometry = new THREE.Geometry();
      floor = -0.04;
      step = 1;
      size = 14;
      for (i = _i = 0, _ref = size / step * 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-size, floor, i * step - size)));
        geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(size, floor, i * step - size)));
        geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(i * step - size, floor, -size)));
        geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(i * step - size, floor, size)));
      }
      line = new THREE.Line(geometry, line_material, THREE.LinePieces);
      this.scene.add(line);
      this.addObjects();
      THREEx.WindowResize.bind(this.renderer.render, this.camera);
      if (THREEx.FullScreen.available()) {
        return THREEx.FullScreen.bindKey();
      }
    };

    Application.prototype.addObjects = function() {
      var loader;
      loader = new THREE.ColladaLoader();
      this.t = 0;
      this.dae = this.skin = null;
      return loader.load('content/monster/monster.dae', (function(_this) {
        return function(collada) {
          _this.dae = collada.scene;
          _this.skin = collada.skins[0];
          _this.dae.scale.x = _this.dae.scale.y = _this.dae.scale.z = 0.002;
          _this.dae.rotation.x = -Math.PI / 2;
          _this.dae.updateMatrix();
          return _this.scene.add(_this.dae);
        };
      })(this));
    };

    Application.prototype.appendStats = function() {
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.right = '0px';
      this.stats.domElement.style.bottom = '0px';
      return document.body.appendChild(this.stats.domElement);
    };

    Application.prototype.processRender = function() {
      this.stats.update();
      this.cameraControls.update();
      return this.renderer.render.render(this.scene, this.camera);
    };

    Application.prototype.animate = function() {
      var i, _i, _ref;
      this.processRender();
      requestAnimationFrame(this.animate.bind(this));
      if (this.t > 30) {
        this.t = 0;
      }
      if (this.skin) {
        for (i = _i = 0, _ref = this.skin.morphTargetInfluences.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.skin.morphTargetInfluences[i] = 0;
        }
        this.skin.morphTargetInfluences[Math.floor(this.t)] = 1;
        return this.t += 0.5;
      }
    };

    return Application;

  })();

  Game = new Application();

  document.addEventListener("DOMContentLoaded", function() {
    if (!Game.init()) {
      return;
    }
    Game.appendStats();
    return Game.animate();
  });

}).call(this);

//# sourceMappingURL=main.map
