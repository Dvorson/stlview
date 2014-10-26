var scene, camera, renderer, controls,
     geometry, material, mesh,
     dropzone,
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
        geometry.faces.forEach(function(t) {
            var currentVol = SignedVolumeOfTriangle(vts[t.a], vts[t.b], vts[t.c]);
            volume += currentVol;
        });
        return Math.abs(volume);
    }

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, canvas.innerWidth() / canvas.innerHeight(), 1, 10000 );
        controls = new THREE.TrackballControls( camera );
        controls.staticMoving = true;
        controls.addEventListener( 'change', render );
        camera.position.z = 10;
        var light = new THREE.PointLight( 0xffffff, 1, 1000 );
            light.position.set( 500, 500, 500 );
            scene.add( light );
            light = new THREE.PointLight( 0xffff00, 1, 1000 );
            light.position.set( -500, 500, -500 );
            scene.add( light );

        //geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, wireframe: false } );

        mesh = new THREE.Mesh( geometry, material );
        loader.addEventListener( 'load', function ( event ) {
  		    /*var geometry = event.content,
  		        i, index1, index2, index3, 
  		        vertices = geometry.vertices,
  		        indices = geometry.skinIndices,
  		        numInds = vertices.length,
  		        volume = 0,
  		        v1 = new THREE.Vector3(), 
  		        v2 = new THREE.Vector3(),
  		        v3 = new THREE.Vector3();
  		        
  		    console.log(numInds);
  		    for (i=0; i<numInds;) {
  		        index1 = indices[i++]*3;
  		        index2 = indices[i++]*3;
  		        index3 = indices[i++]*3;
  		        
  		        v1.set(vertices[index1],vertices[index1+1],vertices[index1+2]);
  		        v2.set(vertices[index2],vertices[index2+1],vertices[index2+2]);
  		        v3.set(vertices[index3],vertices[index3+1],vertices[index3+2]);
  		        
  		        v1.cross(v2);
  		        volume += v1.dot(v3);
  		    }
  		    
  		    volume = Math.abs(volume/6.0);*/
  		    
  		    var geometry = event.content,
  		        volume = VolumeOfMesh(geometry);
  		    
  		    $('#vol').val(Math.round(volume)/1000);
  		    
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
        
        scene.add( mesh );

        renderer = new THREE.CanvasRenderer();
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