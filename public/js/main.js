var scene, camera, renderer, controls,
     geometry, material, mesh,
     dropzone, cube,
     canvas = $('#canvas'),
     loader = new THREE.STLLoader();

    $(document).ready(function () {
        init();
        animate();
    });
    
    function SignedVolumeOfTriangle(v1,v2,v3) {
        var v321 = v3.x*v2.y*v1.z,
            v231 = v2.x*v3.y*v1.z,
            v312 = v3.x*v1.y*v2.z,
            v132 = v1.x*v3.y*v2.z,
            v213 = v2.x*v1.y*v3.z,
            v123 = v1.x*v2.y*v3.z;
        return (v231-v321-v132-v213+v123+v312)/6.0;
    }
    
    function VolumeOfMesh(geometry) {
        var volume = 0,
            vts = geometry.vertices;
            console.log(geometry.faces);
            console.log(geometry);
        if (geometry.faces) geometry.faces.forEach(function(t) {
            var currentVol = SignedVolumeOfTriangle(vts[t.a], vts[t.b], vts[t.c]);
            volume += currentVol;
        });
        return Math.abs(volume);
    }

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, canvas.innerWidth() / canvas.innerHeight(), 0.1, 1000 );
        controls = new THREE.TrackballControls( camera );
        controls.staticMoving = true;
        controls.addEventListener( 'change', render );
        camera.position.z = 10;
        var light = new THREE.PointLight( 0xffffff, 1, 100 );
            light.position.set( 50, 50, 50 );
            scene.add( light );
            light = new THREE.PointLight( 0xffffff, 1, 100 );
            light.position.set( -50, 50, -50 );
            scene.add( light );
            light = new THREE.PointLight( 0xffffff, 1, 100 );
            light.position.set( 50, -50, 50 );
            scene.add( light );
            
        
        material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0xff9900, shininess: 30, shading: THREE.FlatShading } )
        
        loader.addEventListener( 'load', function ( event ) {
  		    
  		    var geometry = event.content, material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } ),
  		        volume = VolumeOfMesh(geometry);
  		    
  		    $('#vol').val(Math.round(volume)/1000);
  		    
  		    scene.remove(scene.children[3]);
  		    
  		    scene.add( new THREE.Mesh( geometry, material ) );
  		    render();
        } );
        
        dropzone = new Dropzone('#dropzone', {
            url: '/uploadstl', 
            clickable: true
        });
        
        dropzone.on('success', function(file,resp) {
            console.log(file.name);
            loader.load( './stl/' + file.name );
            console.log(resp);
        });
        
        renderer = new THREE.WebGLRenderer();
        
        renderer.setSize( canvas.innerWidth(), canvas.innerHeight() );
        canvas.html( renderer.domElement );
    }

    function animate() {

        requestAnimationFrame( animate );
        
        controls.update();
    }
    
    function render() {
        
        renderer.render( scene, camera );
        
    }