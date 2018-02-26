<script id="shader-vertex-terrain-perlin" type="x-shader/x-vertex">


            vec3 mod289(vec3 x)
            {
              return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 mod289(vec4 x)
            {
              return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 permute(vec4 x)
            {
              return mod289(((x*34.0)+1.0)*x);
            }

            vec4 taylorInvSqrt(vec4 r)
            {
              return 1.79284291400159 - 0.85373472095314 * r;
            }

            vec3 fade(vec3 t) {
              return t*t*t*(t*(t*6.0-15.0)+10.0);
            }


            float cnoise(vec3 P)
            {
              vec3 Pi0 = floor(P);
              vec3 Pi1 = Pi0 + vec3(1.0);
              Pi0 = mod289(Pi0);
              Pi1 = mod289(Pi1);
              vec3 Pf0 = fract(P);
              vec3 Pf1 = Pf0 - vec3(1.0);
              vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
              vec4 iy = vec4(Pi0.yy, Pi1.yy);
              vec4 iz0 = Pi0.zzzz;
              vec4 iz1 = Pi1.zzzz;

              vec4 ixy = permute(permute(ix) + iy);
              vec4 ixy0 = permute(ixy + iz0);
              vec4 ixy1 = permute(ixy + iz1);

              vec4 gx0 = ixy0 * (1.0 / 7.0);
              vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
              gx0 = fract(gx0);
              vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
              vec4 sz0 = step(gz0, vec4(0.0));
              gx0 -= sz0 * (step(0.0, gx0) - 0.5);
              gy0 -= sz0 * (step(0.0, gy0) - 0.5);

              vec4 gx1 = ixy1 * (1.0 / 7.0);
              vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
              gx1 = fract(gx1);
              vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
              vec4 sz1 = step(gz1, vec4(0.0));
              gx1 -= sz1 * (step(0.0, gx1) - 0.5);
              gy1 -= sz1 * (step(0.0, gy1) - 0.5);

              vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
              vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
              vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
              vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
              vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
              vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
              vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
              vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

              vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
              g000 *= norm0.x;
              g010 *= norm0.y;
              g100 *= norm0.z;
              g110 *= norm0.w;
              vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
              g001 *= norm1.x;
              g011 *= norm1.y;
              g101 *= norm1.z;
              g111 *= norm1.w;

              float n000 = dot(g000, Pf0);
              float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
              float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
              float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
              float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
              float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
              float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
              float n111 = dot(g111, Pf1);

              vec3 fade_xyz = fade(Pf0);
              vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
              vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
              float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
              return 2.2 * n_xyz;
            }


            float pnoise(vec3 P, vec3 rep)
            {
              vec3 Pi0 = mod(floor(P), rep);
              vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
              Pi0 = mod289(Pi0);
              Pi1 = mod289(Pi1);
              vec3 Pf0 = fract(P);
              vec3 Pf1 = Pf0 - vec3(1.0);
              vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
              vec4 iy = vec4(Pi0.yy, Pi1.yy);
              vec4 iz0 = Pi0.zzzz;
              vec4 iz1 = Pi1.zzzz;

              vec4 ixy = permute(permute(ix) + iy);
              vec4 ixy0 = permute(ixy + iz0);
              vec4 ixy1 = permute(ixy + iz1);

              vec4 gx0 = ixy0 * (1.0 / 7.0);
              vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
              gx0 = fract(gx0);
              vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
              vec4 sz0 = step(gz0, vec4(0.0));
              gx0 -= sz0 * (step(0.0, gx0) - 0.5);
              gy0 -= sz0 * (step(0.0, gy0) - 0.5);

              vec4 gx1 = ixy1 * (1.0 / 7.0);
              vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
              gx1 = fract(gx1);
              vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
              vec4 sz1 = step(gz1, vec4(0.0));
              gx1 -= sz1 * (step(0.0, gx1) - 0.5);
              gy1 -= sz1 * (step(0.0, gy1) - 0.5);

              vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
              vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
              vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
              vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
              vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
              vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
              vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
              vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

              vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
              g000 *= norm0.x;
              g010 *= norm0.y;
              g100 *= norm0.z;
              g110 *= norm0.w;
              vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
              g001 *= norm1.x;
              g011 *= norm1.y;
              g101 *= norm1.z;
              g111 *= norm1.w;

              float n000 = dot(g000, Pf0);
              float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
              float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
              float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
              float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
              float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
              float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
              float n111 = dot(g111, Pf1);

              vec3 fade_xyz = fade(Pf0);
              vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
              vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
              float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
              return 2.2 * n_xyz;
            }

            float rand(vec2 n)
            {
              return 0.5 + 0.5 *
                 fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
            }

            varying vec2  v_uv;
            varying vec3  v_line_color;


            uniform float time;
            uniform float speed;
            uniform float elevation;
            uniform float noise_range;
            uniform float perlin_passes;
            uniform vec3  line_color;
            uniform float sombrero_amplitude;
            uniform float sombrero_frequency;
            varying float z;

            #define M_PI 3.1415926535897932384626433832795

            void main()
            {
                gl_PointSize = 1.;
                v_uv          = uv;
                v_line_color   = line_color;

                // First perlin passes

                float displacement  = pnoise( .4 * position + vec3( 0, speed * time, 0 ), vec3( 100.0 ) ) * 1. * noise_range;

                if( perlin_passes > 2.0 ){

                  displacement       += pnoise( 2. * position + vec3( 0, speed * time * 5., 0 ), vec3( 100. ) ) * .3 * noise_range;
                  displacement       += pnoise( 8. * position + vec3( 0, speed * time * 20., 0 ), vec3( 100. ) ) * .1 * noise_range;

                }
                else if(perlin_passes > 1.0){

                  displacement       += pnoise( 8. * position + vec3( 0, speed * time * 20., 0 ), vec3( 100. ) ) * .1 * noise_range;
                }





                // Sinus
                displacement = displacement + (sin(position.x / 2. - M_PI / 2.)) * elevation;

                vec3 newPosition = vec3(position.x,position.y,displacement);
                gl_Position      = projectionMatrix * modelViewMatrix * vec4( newPosition, 1. );

                z = newPosition.z;
            }

        </script>
<script id="shader-vertex-terrain-perlinsombrero" type="x-shader/x-vertex">


            vec3 mod289(vec3 x)
            {
              return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 mod289(vec4 x)
            {
              return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 permute(vec4 x)
            {
              return mod289(((x*34.0)+1.0)*x);
            }

            vec4 taylorInvSqrt(vec4 r)
            {
              return 1.79284291400159 - 0.85373472095314 * r;
            }

            vec3 fade(vec3 t) {
              return t*t*t*(t*(t*6.0-15.0)+10.0);
            }


            float cnoise(vec3 P)
            {
              vec3 Pi0 = floor(P);
              vec3 Pi1 = Pi0 + vec3(1.0);
              Pi0 = mod289(Pi0);
              Pi1 = mod289(Pi1);
              vec3 Pf0 = fract(P);
              vec3 Pf1 = Pf0 - vec3(1.0);
              vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
              vec4 iy = vec4(Pi0.yy, Pi1.yy);
              vec4 iz0 = Pi0.zzzz;
              vec4 iz1 = Pi1.zzzz;

              vec4 ixy = permute(permute(ix) + iy);
              vec4 ixy0 = permute(ixy + iz0);
              vec4 ixy1 = permute(ixy + iz1);

              vec4 gx0 = ixy0 * (1.0 / 7.0);
              vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
              gx0 = fract(gx0);
              vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
              vec4 sz0 = step(gz0, vec4(0.0));
              gx0 -= sz0 * (step(0.0, gx0) - 0.5);
              gy0 -= sz0 * (step(0.0, gy0) - 0.5);

              vec4 gx1 = ixy1 * (1.0 / 7.0);
              vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
              gx1 = fract(gx1);
              vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
              vec4 sz1 = step(gz1, vec4(0.0));
              gx1 -= sz1 * (step(0.0, gx1) - 0.5);
              gy1 -= sz1 * (step(0.0, gy1) - 0.5);

              vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
              vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
              vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
              vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
              vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
              vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
              vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
              vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

              vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
              g000 *= norm0.x;
              g010 *= norm0.y;
              g100 *= norm0.z;
              g110 *= norm0.w;
              vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
              g001 *= norm1.x;
              g011 *= norm1.y;
              g101 *= norm1.z;
              g111 *= norm1.w;

              float n000 = dot(g000, Pf0);
              float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
              float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
              float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
              float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
              float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
              float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
              float n111 = dot(g111, Pf1);

              vec3 fade_xyz = fade(Pf0);
              vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
              vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
              float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
              return 2.2 * n_xyz;
            }

            float pnoise(vec3 P, vec3 rep)
            {
              vec3 Pi0 = mod(floor(P), rep);
              vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
              Pi0 = mod289(Pi0);
              Pi1 = mod289(Pi1);
              vec3 Pf0 = fract(P);
              vec3 Pf1 = Pf0 - vec3(1.0);
              vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
              vec4 iy = vec4(Pi0.yy, Pi1.yy);
              vec4 iz0 = Pi0.zzzz;
              vec4 iz1 = Pi1.zzzz;

              vec4 ixy = permute(permute(ix) + iy);
              vec4 ixy0 = permute(ixy + iz0);
              vec4 ixy1 = permute(ixy + iz1);

              vec4 gx0 = ixy0 * (1.0 / 7.0);
              vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
              gx0 = fract(gx0);
              vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
              vec4 sz0 = step(gz0, vec4(0.0));
              gx0 -= sz0 * (step(0.0, gx0) - 0.5);
              gy0 -= sz0 * (step(0.0, gy0) - 0.5);

              vec4 gx1 = ixy1 * (1.0 / 7.0);
              vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
              gx1 = fract(gx1);
              vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
              vec4 sz1 = step(gz1, vec4(0.0));
              gx1 -= sz1 * (step(0.0, gx1) - 0.5);
              gy1 -= sz1 * (step(0.0, gy1) - 0.5);

              vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
              vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
              vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
              vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
              vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
              vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
              vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
              vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

              vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
              g000 *= norm0.x;
              g010 *= norm0.y;
              g100 *= norm0.z;
              g110 *= norm0.w;
              vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
              g001 *= norm1.x;
              g011 *= norm1.y;
              g101 *= norm1.z;
              g111 *= norm1.w;

              float n000 = dot(g000, Pf0);
              float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
              float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
              float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
              float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
              float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
              float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
              float n111 = dot(g111, Pf1);

              vec3 fade_xyz = fade(Pf0);
              vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
              vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
              float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
              return 2.2 * n_xyz;
            }

            float rand(vec2 n)
            {
              return 0.5 + 0.5 *
                 fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
            }

            varying vec2  v_uv;
            varying vec3  v_line_color;


            uniform float time;
            uniform float speed;
            uniform float elevation;
            uniform float noise_range;
            uniform float perlin_passes;
            uniform float sombrero_amplitude;
            uniform float sombrero_frequency;
            uniform vec3  line_color;
            varying float z;

            #define M_PI 3.1415926535897932384626433832795

            void main()
            {
                gl_PointSize = 1.;
                v_uv          = uv;
                v_line_color   = line_color;

                // First perlin passes

                float displacement  = pnoise( .4 * position + vec3( 0, speed * time, 0 ), vec3( 100.0 ) ) * 1. * noise_range;

                if( perlin_passes > 2.0 ){

                  displacement       += pnoise( 2. * position + vec3( 0, speed * time * 5., 0 ), vec3( 100. ) ) * .3 * noise_range;
                  displacement       += pnoise( 8. * position + vec3( 0, speed * time * 20., 0 ), vec3( 100. ) ) * .1 * noise_range;

                }
                else if(perlin_passes > 1.0){

                  displacement       += pnoise( 8. * position + vec3( 0, speed * time * 20., 0 ), vec3( 100. ) ) * .1 * noise_range;
                }


                float distance = sqrt(((uv.x-0.5) * (uv.x-0.5)) + ((uv.y-0.5) * (uv.y-0.5)));
                float z = (sombrero_amplitude * sin(((time * 0.5 * speed) - (distance * sombrero_frequency)) * M_PI));





                // Sinus
                displacement = displacement + (sin(position.x / 2. - M_PI / 2.)) * elevation;

                vec3 newPosition = vec3(position.x,position.y,displacement + z);
                gl_Position      = projectionMatrix * modelViewMatrix * vec4( newPosition, 1. );

                z = newPosition.z;
            }

        </script>
<script id="shader-fragment-terrain" type="x-shader/x-fragment">

                varying vec2 v_uv;
                varying vec3 v_line_color;


                varying float z;

                #define M_PI 3.1415926535897932384626433832795

                void main()
                {
                    vec4 temp;
                   
                    float alpha = sin(v_uv.y * M_PI) / 4.;
                    temp = vec4(v_line_color, alpha);
                    


                    gl_FragColor = temp;
                }

        </script>
<script id="shader-vertex-terrain-sombrero" type="x-shader/x-vertex">

            varying vec2  v_uv;
            varying vec3  v_line_color;

            uniform float time;
            uniform float speed;
            uniform float elevation;
            uniform float noise_range;
            uniform float perlin_passes;
            uniform float sombrero_amplitude;
            uniform float sombrero_frequency;
            uniform vec3  line_color;
            varying float z;


            #define M_PI 3.1415926535897932384626433832795

            void main()
            {
                gl_PointSize = 1.;
                v_uv          = uv;
                v_line_color   = line_color;

                float distance = sqrt(((uv.x-0.5) * (uv.x-0.5)) + ((uv.y-0.5) * (uv.y-0.5)));
                float z = (sombrero_amplitude * sin(((time * 0.5 * speed) - (distance * sombrero_frequency)) * M_PI));

                vec3 newPosition = vec3(position.x,position.y,z);
                gl_Position      = projectionMatrix * modelViewMatrix * vec4( newPosition, 1. );

                z = newPosition.z;
            }

        </script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r69/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui.js"></script>
<div id='experience'></div>
<script>(function() {
  var App,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.App = (function() {
    App.prototype.canvasGL = null;

    App.prototype.container = null;

    App.prototype.scene = null;

    App.prototype.camera = null;

    App.prototype.renderer = null;

    App.prototype.geometry = null;

    App.prototype.material = null;

    App.prototype.mesh = null;

    App.prototype.gui = null;

    App.prototype.terrain = null;

    App.prototype.composer = null;

    App.prototype.render_pass = null;

    App.prototype.fxaa_pass = null;

    App.prototype.posteffect = false;

    App.prototype.meteo = null;

    App.prototype.skybox = null;

    function App() {
      this.resize = bind(this.resize, this);
      this.renderScene = bind(this.renderScene, this);
      this.update = bind(this.update, this);
      this.init = bind(this.init, this);
      var fb, lin, plus, twt;
      fb = document.getElementById('facebook');
      twt = document.getElementById('twitter');
      lin = document.getElementById('linkedin');
      plus = document.getElementById('plus');
    }

WindowResize	= function(renderer, camera){
	var callback	= function(){
		// notify the renderer of the size change
    var width = $('#experience').innerWidth();
    var height = $('#experience').innerHeight();
    console.log(width,height);
		renderer.setSize( width, height );
		// update the camera
		camera.aspect	= width/ height;
		camera.updateProjectionMatrix();
	}
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}
    App.prototype.init = function() {
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
      console.log(this.camera);
      this.camera.position.z = 7;
      this.camera.position.y = 1;
      this.renderer = new THREE.WebGLRenderer({
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        antialias: false,
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container = document.createElement('div');
      this.container.id = 'canvasGL';
      this.container.appendChild(this.renderer.domElement);
      this.camera.lookAt(new THREE.Vector3());
      document.getElementById('experience').appendChild(this.container);
      this.terrain = new Terrain(this.scene);
      this.scene.add(this.terrain.plane_mesh);
      WindowResize(this.renderer,this.camera);
      return this.update();
    };

    App.prototype.update = function() {
      requestAnimationFrame(this.update);
      this.terrain.update();
      return this.renderScene();
    };

    App.prototype.renderScene = function() {
      return this.renderer.render(this.scene, this.camera);
    };

    App.prototype.resize = function(stageWidth, stageHeight) {
      this.camera.aspect = stageWidth / stageHeight;
      this.camera.updateProjectionMatrix();
      return this.renderer.setSize(stageWidth, stageHeight);
    };

    return App;

  })();

  window.Terrain = (function() {
    Terrain.prototype.uniforms = null;

    Terrain.prototype.plane_mesh = null;

    Terrain.prototype.plane_geometry = null;

    Terrain.prototype.groundMaterial = null;

    Terrain.prototype.clock = new THREE.Clock(true);

    Terrain.prototype.options = {
      elevation: 1,
      noise_range: 2.14,
      sombrero_amplitude: 0.6,
      sombrero_frequency: 10.0,
      speed: 0.4,
      segments: 324,
      wireframe_color: '#6E2E8E',
      perlin_passes: 1,
      wireframe: true,
      floor_visible: true
    };

    Terrain.prototype.scene = null;

    function Terrain(scene) {
      this.update = bind(this.update, this);
      this.buildPlanes = bind(this.buildPlanes, this);
      this.init = bind(this.init, this);
      this.scene = scene;
      this.init();
    }

    Terrain.prototype.init = function() {
      this.uniforms = {
        time: {
          type: "f",
          value: 0.0
        },
        speed: {
          type: "f",
          value: this.options.speed
        },
        elevation: {
          type: "f",
          value: this.options.elevation
        },
        noise_range: {
          type: "f",
          value: this.options.noise_range
        },
        offset: {
          type: "f",
          value: this.options.elevation
        },
        perlin_passes: {
          type: "f",
          value: this.options.perlin_passes
        },
        sombrero_amplitude: {
          type: "f",
          value: this.options.sombrero_amplitude
        },
        sombrero_frequency: {
          type: "f",
          value: this.options.sombrero_frequency
        },
        line_color: {
          type: "c",
          value: new THREE.Color(this.options.wireframe_color)
        }
      };
      return this.buildPlanes(this.options.segments);
    };

    Terrain.prototype.buildPlanes = function(segments) {
      this.plane_geometry = new THREE.PlaneBufferGeometry(20, 20, segments, segments);
      this.plane_material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('shader-vertex-terrain-perlinsombrero').textContent,
        fragmentShader: document.getElementById('shader-fragment-terrain').textContent,
        wireframe: this.options.wireframe,
        wireframeLinewidth: 1,
        transparent: true,
        uniforms: this.uniforms
      });
      this.groundMaterial = new THREE.MeshPhongMaterial({
        ambient: 0xffffff,
        color: 0xffffff,
        specular: 0x050505
      });
      this.materials = [this.groundMaterial, this.plane_material];
      this.plane_mesh = THREE.SceneUtils.createMultiMaterialObject(this.plane_geometry, this.materials);
      this.plane_mesh.rotation.x = -Math.PI / 2;
      return this.plane_mesh.position.y = -0.5;
    };

    Terrain.prototype.update = function() {
      return this.plane_material.uniforms['time'].value = this.clock.getElapsedTime();
    };

    return Terrain;

  })();

  App = new window.App();

  App.init();

}).call(this);
</script>
