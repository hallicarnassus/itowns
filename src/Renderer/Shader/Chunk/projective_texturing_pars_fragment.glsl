uniform sampler2D projectiveTexture[NUM_TEXTURES];
varying vec3      projectiveTextureCoords[NUM_TEXTURES];
uniform float     projectiveTextureAlphaBorder;

struct Distortion {
    vec2 size;
#if USE_DISTORTION
    vec2 pps;
    vec4 polynom;
    vec3 l1l2;
#endif
};

uniform Distortion projectiveTextureDistortion[NUM_TEXTURES];

float getAlphaBorder(vec2 p)
{
    vec2 d = clamp(projectiveTextureAlphaBorder*min(p,1.-p), 0., 1.);
    return min(d.x,d.y);
}

#if USE_DISTORTION
void distort(inout vec2 p, vec4 polynom, vec2 pps)
{
    vec2 v = p - pps;
    float v2 = dot(v,v);
    if(v2>polynom.w) p = vec2(-1.);
    else p += (v2*(polynom.x+v2*(polynom.y+v2*polynom.z)))*v;
}

void distort(inout vec2 p, vec4 polynom, vec3 l1l2, vec2 pps)
{ 
    if ((l1l2.x == 0.)&&(l1l2.y == 0.)) {
        distort(p,polynom,pps);
    } else {
        vec2 AB = (p-pps)/l1l2.z;
        float R = length(AB);
        float lambda = atan(R)/R;
        vec2 ab = lambda*AB;
        float rho2 = dot(ab,ab);
        float r357 = 1. + rho2* (polynom.x + rho2* (polynom.y + rho2*polynom.z));
        p = pps + l1l2.z * (r357*ab + vec2(dot(l1l2.xy,ab),l1l2.y*ab.x));
    }
}
#endif

vec4 projectiveTextureColor(vec3 coords, Distortion distortion, sampler2D texture)
{
    if(coords.z>0.) {
        vec2 p = coords.xy / coords.z;
#if USE_DISTORTION
        p *= distortion.size;
        distort(p, distortion.polynom, distortion.l1l2, distortion.pps);
        p /= distortion.size;
#endif
        float d = getAlphaBorder(p);
        if(d>0.) {
            return d*texture2D(texture, p);
        }
    }
    return vec4(0.);
}