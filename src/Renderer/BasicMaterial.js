/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define('Renderer/BasicMaterial',
    [   'THREE',
        'Core/defaultValue',
        'text!Renderer/Shader/SimpleVS.glsl',
        'text!Renderer/Shader/SimpleFS.glsl'], function(
            THREE,
            defaultValue,            
            SimpleVS,
            SimpleFS)
    {
        
        function BasicMaterial(color){
            //Constructor
            
            THREE.ShaderMaterial.call( this );
            
            this.vertexShader    = SimpleVS;
            this.fragmentShader  = SimpleFS;
            
            this.uniforms  = 
            {                        
                diffuseColor    : { type: "c", value: defaultValue(color,new THREE.Color()) },
                RTC             : { type: "i" , value: 1 },
                mVPMatRTC       : { type: "m4", value: new THREE.Matrix4()},
                distanceFog     : { type: "f" , value: 1000000000.0},
                debug           : { type: "i" , value: false }

            };  
        }        
        
        BasicMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
        BasicMaterial.prototype.constructor = BasicMaterial;
      
        BasicMaterial.prototype.setRTC = function(RTC)
        {
            this.uniforms.RTC.value   = RTC;        
        };
                
        BasicMaterial.prototype.setDebug = function(debug_value)
        {
            this.uniforms.debug.value   = debug_value;        
        };

        BasicMaterial.prototype.setMatrixRTC = function(rtc)
        {
            this.uniforms.mVPMatRTC.value  = rtc;    
        };
        
        BasicMaterial.prototype.setFogDistance = function(df)
        {
            this.uniforms.distanceFog.value  = df;    
        };
        
        return BasicMaterial;

    });