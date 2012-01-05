Shader "Custom/Line Coloured"
{
	Properties
	{
//		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Main Color", Color) = (1,0.5,0.5,1)
	}
	SubShader
	{
	    Pass
	    {
	        Blend SrcAlpha OneMinusSrcAlpha
	        ZWrite Off
	        Cull Off
	        Fog { Mode Off }
	        Lighting On

             Material
             {
                  Diffuse [_Color]
                  Ambient [_Color]
 //               Shininess [_Color]
 //               Specular [_Color]
                Emission [_Color]
             }

//            BindChannels
//            {
//                Bind "Color", color
//                Bind "Vertex", vertex
//                Bind "TexCoord", texcoord
//            }
	    }
	}
}
