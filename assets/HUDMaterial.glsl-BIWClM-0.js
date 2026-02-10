import{hl as Nt,ua as kt,ax as Wt,Y as Yt,qm as Xt,c7 as wt,ao as Kt,ub as Jt,uc as Qt,rJ as Zt,n6 as eo,dr as to,ud as oo,ue as ao,uf as io,tM as no,tN as so,tO as ro,a2 as bt,ih as lo,f6 as oe,f4 as re,$ as Ze,X as F,Z as yt,au as L,ef as G,eg as q,ar as We,as as ae,e7 as W,aG as N,kN as co,ga as Ye,jw as Xe,qi as uo,bC as fo,hT as po,_ as ho,j5 as et,a4 as E,ir as tt,hN as Pt,a1 as $t,e8 as be,f7 as St,d1 as vo,fy as go,f2 as ot,kM as zt,jJ as Ve,hO as mo,iF as xo,aE as Ot,aH as wo}from"./index-DUZTCpwS.js";import{u as bo}from"./meshVertexSpaceUtils-63CswkRg.js";import{t as Ke}from"./projectVectorToVector-CjJgAlIs.js";import{o as yo,x as Po}from"./hydratedFeatures-CClK0G4y.js";import{t as at,r as I,n as Y}from"./vec3f32-WCVSSNPR.js";import{aE as $o,n as X,m as K,aF as it,aG as Ct,D as So,ax as zo,aq as Je,r as Be,a6 as Me,aH as Oo,af as Co,aI as At,aJ as Mt,as as Ao,K as Mo,ap as Dt,i as Do,aK as Vo,G as jo,H as To,M as Fo,al as nt,L as Fe,b as st,aL as _o,a2 as te,ai as Ro,a as Eo,j as Uo,k as Ho,T as Io,W as Vt,X as Bo,Y as Go,x as U,A as Lo,aM as _e,t as qo,aN as No,aO as ko,aP as Wo,aB as Yo,aQ as Xo,aR as Ko,aS as Jo,aT as rt,aU as Qo,aV as lt,aW as ct,aX as Zo,aD as ea}from"./OutputColorHighlightOID.glsl-Bg7KRyMj.js";import{A as ta,U as jt}from"./Indices-nCmC_6aN.js";import{j as oa,U as aa,K as ia}from"./plane-Ca-doYiU.js";import{k as na}from"./sphere-C6ttXJGf.js";import{t as M}from"./orientedBoundingBox-htZ9ZVwR.js";import{s as Tt,g as sa}from"./BufferView-BD5gUzyI.js";import{Q as Ft,t as ra}from"./InterleavedLayout-DT1v80bt.js";import{T as la,d as ca,c as ua}from"./renderState-CKc66y4x.js";import{t as fa}from"./VertexAttributeLocations-BfZbt_DV.js";import{t as $,n as H}from"./glsl-B5bJgrnA.js";import{s as pa}from"./ShaderBuilder-BywBVDxB.js";function gi(o,e){if(o.type==="point")return ee(o,e,!1);if(yo(o))switch(o.type){case"extent":return ee(o.center,e,!1);case"polygon":return ee(ft(o),e,!1);case"polyline":return ee(ut(o),e,!0);case"mesh":return ee(bo(o.vertexSpace,o.spatialReference)??o.extent.center,e,!1);case"multipoint":return}else switch(o.type){case"extent":return ee(da(o),e,!0);case"polygon":return ee(ft(o),e,!0);case"polyline":return ee(ut(o),e,!0);case"multipoint":return}}function ut(o){const e=o.paths[0];if(!e||e.length===0)return null;const a=Qt(e,Zt(e)/2);return Ke(a[0],a[1],a[2],o.spatialReference)}function da(o){return Ke(.5*(o.xmax+o.xmin),.5*(o.ymax+o.ymin),o.zmin!=null&&o.zmax!=null&&isFinite(o.zmin)&&isFinite(o.zmax)?.5*(o.zmax+o.zmin):void 0,o.spatialReference)}function ft(o){const e=o.rings[0];if(!e||e.length===0)return null;const a=eo(o.rings,!!o.hasZ);return Ke(a[0],a[1],a[2],o.spatialReference)}function ee(o,e,a){const t=a?o:Po(o);return e&&o?Jt(o,t,e)?t:null:t}function mi(o,e,a,t=0){if(o){e||(e=wt());const i=o;let s=.5*i.width*(a-1),n=.5*i.height*(a-1);return i.width<1e-7*i.height?s+=n/20:i.height<1e-7*i.width&&(n+=s/20),Kt(e,i.xmin-s-t,i.ymin-n-t,i.xmax+s+t,i.ymax+n+t),e}return null}function xi(o,e,a=null){const t=kt(Xt);return o!=null&&(t[0]=o[0],t[1]=o[1],t[2]=o[2],o.length>3&&(t[3]=o[3])),e!=null&&(t[3]=e),a&&Wt(t,t,a),t}function wi(o=Nt,e,a,t=1){const i=new Array(3);if(e==null||a==null)i[0]=1,i[1]=1,i[2]=1;else{let s,n=0;for(let r=2;r>=0;r--){const l=o[r],c=l!=null,u=r===0&&!s&&!c,p=a[r];let h;l==="symbol-value"||u?h=p!==0?e[r]/p:1:c&&l!=="proportional"&&isFinite(l)&&(h=p!==0?l/p:1),h!=null&&(i[r]=h,s=h,n=Math.max(n,Math.abs(h)))}for(let r=2;r>=0;r--)i[r]==null?i[r]=s:i[r]===0&&(i[r]=.001*n)}for(let s=2;s>=0;s--)i[s]/=t;return Yt(i)}function ha(o){return o.isPrimitive!=null}function bi(o){return va(ha(o)?[o.width,o.depth,o.height]:o)?null:"Symbol sizes may not be negative values"}function va(o){const e=a=>a==null||a>=0;return Array.isArray(o)?o.every(e):e(o)}function yi(o,e,a,t=bt()){return o&&no(t,t,-o/180*Math.PI),e&&so(t,t,e/180*Math.PI),a&&ro(t,t,a/180*Math.PI),t}function Pi(o,e,a){if(a.minDemResolution!=null)return a.minDemResolution;const t=to(e),i=oo(o)*t,s=ao(o)*t,n=io(o)*(e.isGeographic?1:t);return i===0&&s===0&&n===0?a.minDemResolutionForPoints:.01*Math.max(i,s,n)}function pt(o,e){const a=o[e],t=o[e+1],i=o[e+2];return Math.sqrt(a*a+t*t+i*i)}function ga(o,e){const a=o[e],t=o[e+1],i=o[e+2],s=1/Math.sqrt(a*a+t*t+i*i);o[e]*=s,o[e+1]*=s,o[e+2]*=s}function dt(o,e,a){o[e]*=a,o[e+1]*=a,o[e+2]*=a}function ma(o,e,a,t,i,s=e){(i=i||o)[s]=o[e]+a[t],i[s+1]=o[e+1]+a[t+1],i[s+2]=o[e+2]+a[t+2]}function xa(){return ht??=wa(),ht}function wa(){const a=new M([0,0,0,255,255,0,255,255],[0,1,2,3],2,!0);return new $o([["uv0",a]])}let ht=null;const Re=[[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5]],ba=[0,0,1,-1,0,0,1,0,0,0,-1,0,0,1,0,0,0,-1],ya=[0,0,1,0,1,1,0,1],Pa=[0,1,2,2,3,0,4,0,3,3,7,4,1,5,6,6,2,1,1,0,4,4,5,1,3,2,6,6,7,3,5,4,7,7,6,5],_t=new Array(36);for(let o=0;o<6;o++)for(let e=0;e<6;e++)_t[6*o+e]=o;const ne=new Array(36);for(let o=0;o<6;o++)ne[6*o]=0,ne[6*o+1]=1,ne[6*o+2]=2,ne[6*o+3]=2,ne[6*o+4]=3,ne[6*o+5]=0;function $i(o,e){Array.isArray(e)||(e=[e,e,e]);const a=new Array(24);for(let t=0;t<8;t++)a[3*t]=Re[t][0]*e[0],a[3*t+1]=Re[t][1]*e[1],a[3*t+2]=Re[t][2]*e[2];return new K(o,[["position",new M(a,Pa,3,!0)],["normal",new M(ba,_t,3)],["uv0",new M(ya,ne,2)]])}const Ee=[[-.5,0,-.5],[.5,0,-.5],[.5,0,.5],[-.5,0,.5],[0,-.5,0],[0,.5,0]],$a=[0,1,-1,1,1,0,0,1,1,-1,1,0,0,-1,-1,1,-1,0,0,-1,1,-1,-1,0],Sa=[5,1,0,5,2,1,5,3,2,5,0,3,4,0,1,4,1,2,4,2,3,4,3,0],za=[0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7];function Si(o,e){Array.isArray(e)||(e=[e,e,e]);const a=new Array(18);for(let t=0;t<6;t++)a[3*t]=Ee[t][0]*e[0],a[3*t+1]=Ee[t][1]*e[1],a[3*t+2]=Ee[t][2]*e[2];return new K(o,[["position",new M(a,Sa,3,!0)],["normal",new M($a,za,3)]])}const $e=I(-.5,0,-.5),Se=I(.5,0,-.5),ze=I(0,0,.5),Oe=I(0,.5,0),ce=Y(),ue=Y(),pe=Y(),de=Y(),he=Y();W(ce,$e,Oe),W(ue,$e,Se),ae(pe,ce,ue),L(pe,pe),W(ce,Se,Oe),W(ue,Se,ze),ae(de,ce,ue),L(de,de),W(ce,ze,Oe),W(ue,ze,$e),ae(he,ce,ue),L(he,he);const Ue=[$e,Se,ze,Oe],Oa=[0,-1,0,pe[0],pe[1],pe[2],de[0],de[1],de[2],he[0],he[1],he[2]],Ca=[0,1,2,3,1,0,3,2,1,3,0,2],Aa=[0,0,0,1,1,1,2,2,2,3,3,3];function zi(o,e){Array.isArray(e)||(e=[e,e,e]);const a=new Array(12);for(let t=0;t<4;t++)a[3*t]=Ue[t][0]*e[0],a[3*t+1]=Ue[t][1]*e[1],a[3*t+2]=Ue[t][2]*e[2];return new K(o,[["position",new M(a,Ca,3,!0)],["normal",new M(Oa,Aa,3)]])}function Oi(o,e,a,t,i={uv:!0}){const s=-Math.PI,n=2*Math.PI,r=-Math.PI/2,l=Math.PI,c=Math.max(3,Math.floor(a)),u=Math.max(2,Math.floor(t)),p=(c+1)*(u+1),h=X(3*p),b=X(3*p),y=X(2*p),m=[];let d=0;for(let x=0;x<=u;x++){const C=[],f=x/u,z=r+f*l,O=Math.cos(z);for(let P=0;P<=c;P++){const B=P/c,w=s+B*n,j=Math.cos(w)*O,V=Math.sin(z),J=-Math.sin(w)*O;h[3*d]=j*e,h[3*d+1]=V*e,h[3*d+2]=J*e,b[3*d]=j,b[3*d+1]=V,b[3*d+2]=J,y[2*d]=B,y[2*d+1]=f,C.push(d),++d}m.push(C)}const v=new Array;for(let x=0;x<u;x++)for(let C=0;C<c;C++){const f=m[x][C],z=m[x][C+1],O=m[x+1][C+1],P=m[x+1][C];x===0?(v.push(f),v.push(O),v.push(P)):x===u-1?(v.push(f),v.push(z),v.push(O)):(v.push(f),v.push(z),v.push(O),v.push(O),v.push(P),v.push(f))}const g=[["position",new M(h,v,3,!0)],["normal",new M(b,v,3,!0)]];return i.uv&&g.push(["uv0",new M(y,v,2,!0)]),i.offset&&(g[0][0]="offset",g.push(["position",new M(Float64Array.from(i.offset),jt(v.length),3,!0)])),new K(o,g)}function Ci(o,e,a,t){const i=Ma(e,a);return new K(o,i)}function Ma(o,e,a){let t,i;t=[0,-1,0,1,0,0,0,0,1,-1,0,0,0,0,-1,0,1,0],i=[0,1,2,0,2,3,0,3,4,0,4,1,1,5,2,2,5,3,3,5,4,4,5,1];for(let l=0;l<t.length;l+=3)dt(t,l,o/pt(t,l));let s={};function n(l,c){l>c&&([l,c]=[c,l]);const u=l.toString()+"."+c.toString();if(s[u])return s[u];let p=t.length;return t.length+=3,ma(t,3*l,t,3*c,t,p),dt(t,p,o/pt(t,p)),p/=3,s[u]=p,p}for(let l=0;l<e;l++){const c=i.length,u=new Array(4*c);for(let p=0;p<c;p+=3){const h=i[p],b=i[p+1],y=i[p+2],m=n(h,b),d=n(b,y),v=n(y,h),g=4*p;u[g]=h,u[g+1]=m,u[g+2]=v,u[g+3]=b,u[g+4]=d,u[g+5]=m,u[g+6]=y,u[g+7]=v,u[g+8]=d,u[g+9]=m,u[g+10]=d,u[g+11]=v}i=u,s={}}const r=it(t);for(let l=0;l<r.length;l+=3)ga(r,l);return[["position",new M(it(t),i,3,!0)],["normal",new M(r,i,3,!0)]]}function Ai(o,{normal:e,position:a,color:t,rotation:i,size:s,centerOffsetAndDistance:n,uvi:r,featureAttribute:l,olidColor:c=null}={}){const u=a?Ze(a):F(),p=e?Ze(e):yt(0,0,1),h=t?[t[0],t[1],t[2],t.length>3?t[3]:255]:[255,255,255,255],b=s!=null&&s.length===2?s:[1,1],y=i!=null?[i]:[0],m=jt(1),d=[["position",new M(u,m,3,!0)],["normal",new M(p,m,3,!0)],["color",new M(h,m,4,!0)],["size",new M(b,m,2)],["rotation",new M(y,m,1,!0)]];if(r&&d.push(["uvi",new M(r,m,r.length)]),n!=null){const v=[n[0],n[1],n[2],n[3]];d.push(["centerOffsetAndDistance",new M(v,m,4)])}if(l){const v=[l[0],l[1],l[2],l[3]];d.push(["featureAttribute",new M(v,m,4)])}return new K(o,d,null,1,c,void 0,xa())}function Da(o,e,a,t,i=!0,s=!0){let n=0;const r=e,l=o;let c=I(0,n,0),u=I(0,n+l,0),p=I(0,-1,0),h=I(0,1,0);t&&(n=l,u=I(0,0,0),c=I(0,n,0),p=I(0,1,0),h=I(0,-1,0));const b=[u,c],y=[p,h],m=a+2,d=Math.sqrt(l*l+r*r);if(t)for(let f=a-1;f>=0;f--){const z=f*(2*Math.PI/a),O=I(Math.cos(z)*r,n,Math.sin(z)*r);b.push(O);const P=I(l*Math.cos(z)/d,-r/d,l*Math.sin(z)/d);y.push(P)}else for(let f=0;f<a;f++){const z=f*(2*Math.PI/a),O=I(Math.cos(z)*r,n,Math.sin(z)*r);b.push(O);const P=I(l*Math.cos(z)/d,r/d,l*Math.sin(z)/d);y.push(P)}const v=new Array,g=new Array;if(i){for(let f=3;f<b.length;f++)v.push(1),v.push(f-1),v.push(f),g.push(0),g.push(0),g.push(0);v.push(b.length-1),v.push(2),v.push(1),g.push(0),g.push(0),g.push(0)}if(s){for(let f=3;f<b.length;f++)v.push(f),v.push(f-1),v.push(0),g.push(f),g.push(f-1),g.push(1);v.push(0),v.push(2),v.push(b.length-1),g.push(1),g.push(2),g.push(y.length-1)}const x=X(3*m);for(let f=0;f<m;f++)x[3*f]=b[f][0],x[3*f+1]=b[f][1],x[3*f+2]=b[f][2];const C=X(3*m);for(let f=0;f<m;f++)C[3*f]=y[f][0],C[3*f+1]=y[f][1],C[3*f+2]=y[f][2];return[["position",new M(x,v,3,!0)],["normal",new M(C,g,3,!0)]]}function Mi(o,e,a,t,i,s=!0,n=!0){return new K(o,Da(e,a,t,i,s,n))}function Di(o,e,a,t,i,s,n){const r=i?at(i):I(1,0,0),l=s?at(s):I(0,0,0);n??=!0;const c=Y();L(c,r);const u=Y();G(u,c,Math.abs(e));const p=Y();G(p,u,-.5),q(p,p,l);const h=I(0,1,0);Math.abs(1-We(c,h))<.2&&oe(h,0,0,1);const b=Y();ae(b,c,h),L(b,b),ae(h,b,c);const y=2*t+(n?2:0),m=t+(n?2:0),d=X(3*y),v=X(3*m),g=X(2*y),x=new Array(3*t*(n?4:2)),C=new Array(3*t*(n?4:2));n&&(d[3*(y-2)]=p[0],d[3*(y-2)+1]=p[1],d[3*(y-2)+2]=p[2],g[2*(y-2)]=0,g[2*(y-2)+1]=0,d[3*(y-1)]=d[3*(y-2)]+u[0],d[3*(y-1)+1]=d[3*(y-2)+1]+u[1],d[3*(y-1)+2]=d[3*(y-2)+2]+u[2],g[2*(y-1)]=1,g[2*(y-1)+1]=1,v[3*(m-2)]=-c[0],v[3*(m-2)+1]=-c[1],v[3*(m-2)+2]=-c[2],v[3*(m-1)]=c[0],v[3*(m-1)+1]=c[1],v[3*(m-1)+2]=c[2]);const f=(w,j,V)=>{x[w]=j,C[w]=V};let z=0;const O=Y(),P=Y();for(let w=0;w<t;w++){const j=w*(2*Math.PI/t);G(O,h,Math.sin(j)),G(P,b,Math.cos(j)),q(O,O,P),v[3*w]=O[0],v[3*w+1]=O[1],v[3*w+2]=O[2],G(O,O,a),q(O,O,p),d[3*w]=O[0],d[3*w+1]=O[1],d[3*w+2]=O[2],g[2*w]=w/t,g[2*w+1]=0,d[3*(w+t)]=d[3*w]+u[0],d[3*(w+t)+1]=d[3*w+1]+u[1],d[3*(w+t)+2]=d[3*w+2]+u[2],g[2*(w+t)]=w/t,g[2*w+1]=1;const V=(w+1)%t;f(z++,w,w),f(z++,w+t,w),f(z++,V,V),f(z++,V,V),f(z++,w+t,w),f(z++,V+t,V)}if(n){for(let w=0;w<t;w++){const j=(w+1)%t;f(z++,y-2,m-2),f(z++,w,m-2),f(z++,j,m-2)}for(let w=0;w<t;w++){const j=(w+1)%t;f(z++,w+t,m-1),f(z++,y-1,m-1),f(z++,j+t,m-1)}}const B=[["position",new M(d,x,3,!0)],["normal",new M(v,C,3,!0)],["uv0",new M(g,x,2,!0)]];return new K(o,B)}function Vi(o,e,a,t,i,s){t=t||10,i=i==null||i,Tt(e.length>1);const n=[[0,0,0]],r=[],l=[];for(let c=0;c<t;c++){r.push([0,-c-1,-(c+1)%t-1]);const u=c/t*2*Math.PI;l.push([Math.cos(u)*a,Math.sin(u)*a])}return Va(o,l,e,n,r,i,s)}function Va(o,e,a,t,i,s,n=I(0,0,0)){const r=e.length,l=X(a.length*r*3+(6*t.length||0)),c=X(a.length*r*3+(t?6:0)),u=new Array,p=new Array;let h=0,b=0;const y=F(),m=F(),d=F(),v=F(),g=F(),x=F(),C=F(),f=F(),z=F(),O=F(),P=F(),B=F(),w=F(),j=oa();oe(z,0,1,0),W(m,a[1],a[0]),L(m,m),s?(q(f,a[0],n),L(d,f)):oe(d,0,0,1),vt(m,d,z,z,g,d,gt),N(v,d),N(B,g);for(let S=0;S<t.length;S++)G(x,g,t[S][0]),G(f,d,t[S][2]),q(x,x,f),q(x,x,a[0]),l[h++]=x[0],l[h++]=x[1],l[h++]=x[2];c[b++]=-m[0],c[b++]=-m[1],c[b++]=-m[2];for(let S=0;S<i.length;S++)u.push(i[S][0]>0?i[S][0]:-i[S][0]-1+t.length),u.push(i[S][1]>0?i[S][1]:-i[S][1]-1+t.length),u.push(i[S][2]>0?i[S][2]:-i[S][2]-1+t.length),p.push(0),p.push(0),p.push(0);let V=t.length;const J=t.length-1;for(let S=0;S<a.length;S++){let me=!1;S>0&&(N(y,m),S<a.length-1?(W(m,a[S+1],a[S]),L(m,m)):me=!0,q(O,y,m),L(O,O),q(P,a[S-1],v),aa(a[S],O,j),ia(j,na(P,y),f)?(W(f,f,a[S]),L(d,f),ae(g,O,d),L(g,g)):vt(O,v,B,z,g,d,gt),N(v,d),N(B,g)),s&&(q(f,a[S],n),L(w,f));for(let Z=0;Z<r;Z++)if(G(x,g,e[Z][0]),G(f,d,e[Z][1]),q(x,x,f),L(C,x),c[b++]=C[0],c[b++]=C[1],c[b++]=C[2],q(x,x,a[S]),l[h++]=x[0],l[h++]=x[1],l[h++]=x[2],!me){const je=(Z+1)%r;u.push(V+Z),u.push(V+r+Z),u.push(V+je),u.push(V+je),u.push(V+r+Z),u.push(V+r+je);for(let Te=0;Te<6;Te++){const qt=u.length-6;p.push(u[qt+Te]-J)}}V+=r}const le=a[a.length-1];for(let S=0;S<t.length;S++)G(x,g,t[S][0]),G(f,d,t[S][1]),q(x,x,f),q(x,x,le),l[h++]=x[0],l[h++]=x[1],l[h++]=x[2];const Q=b/3;c[b++]=m[0],c[b++]=m[1],c[b++]=m[2];const k=V-r;for(let S=0;S<i.length;S++)u.push(i[S][0]>=0?V+i[S][0]:-i[S][0]-1+k),u.push(i[S][2]>=0?V+i[S][2]:-i[S][2]-1+k),u.push(i[S][1]>=0?V+i[S][1]:-i[S][1]-1+k),p.push(Q),p.push(Q),p.push(Q);const ie=[["position",new M(l,u,3,!0)],["normal",new M(c,p,3,!0)]];return new K(o,ie)}function ji(o,e,a,t,i){const s=lo(3*e.length),n=new Array(2*(e.length-1));let r=0,l=0;for(let u=0;u<e.length;u++){for(let p=0;p<3;p++)s[r++]=e[u][p];u>0&&(n[l++]=u-1,n[l++]=u)}const c=[["position",new M(s,n,3,!0)]];if(a&&a.length===e.length&&a[0].length===3){const u=X(3*a.length);let p=0;for(let h=0;h<e.length;h++)for(let b=0;b<3;b++)u[p++]=a[h][b];c.push(["normal",new M(u,n,3,!0)])}return t&&c.push(["color",new M(t,ta(t.length/4),4)]),new K(o,c,null,2)}function Ti(o,e,a,t,i,s=0){const n=new Array(18),r=[[-a,s,i/2],[t,s,i/2],[0,e+s,i/2],[-a,s,-i/2],[t,s,-i/2],[0,e+s,-i/2]],l=[0,1,2,3,0,2,2,5,3,1,4,5,5,2,1,1,0,3,3,4,1,4,3,5];for(let c=0;c<6;c++)n[3*c]=r[c][0],n[3*c+1]=r[c][1],n[3*c+2]=r[c][2];return new K(o,[["position",new M(n,l,3,!0)]])}function Fi(o,e){const a=o.getMutableAttribute("position").data;for(let t=0;t<a.length;t+=3){const i=a[t],s=a[t+1],n=a[t+2];oe(fe,i,s,n),re(fe,fe,e),a[t]=fe[0],a[t+1]=fe[1],a[t+2]=fe[2]}}function _i(o,e=o){const a=o.attributes,t=a.get("position").data,i=a.get("normal").data;if(i){const s=e.getMutableAttribute("normal").data;for(let n=0;n<i.length;n+=3){const r=i[n+1];s[n+1]=-i[n+2],s[n+2]=r}}if(t){const s=e.getMutableAttribute("position").data;for(let n=0;n<t.length;n+=3){const r=t[n+1];s[n+1]=-t[n+2],s[n+2]=r}}}function He(o,e,a,t,i){return!(Math.abs(We(e,o))>i)&&(ae(a,o,e),L(a,a),ae(t,a,o),L(t,t),!0)}function vt(o,e,a,t,i,s,n){return He(o,e,i,s,n)||He(o,a,i,s,n)||He(o,t,i,s,n)}const gt=.99619469809,fe=F();function ja(o){return o instanceof Float32Array&&o.length>=16}function Ta(o){return Array.isArray(o)&&o.length>=16}function Fa(o){return ja(o)||Ta(o)}const Rt=.5;function _a(o,e){o.include(Ct),o.attributes.add("position","vec3"),o.attributes.add("normal","vec3"),o.attributes.add("centerOffsetAndDistance","vec4");const a=o.vertex;So(a,e),zo(a,e),a.uniforms.add(new Je("viewport",t=>t.camera.fullViewport),new Be("polygonOffset",t=>t.shaderPolygonOffset),new Me("cameraGroundRelative",t=>t.camera.aboveGround?1:-1)),e.hasVerticalOffset&&Oo(a),a.code.add($`struct ProjectHUDAux {
vec3 posModel;
vec3 posView;
vec3 vnormal;
float distanceToCamera;
float absCosAngle;
};`),a.code.add($`
    float applyHUDViewDependentPolygonOffset(float pointGroundDistance, float absCosAngle, inout vec3 posView) {
      float pointGroundSign = ${e.terrainDepthTest?$.float(0):$`sign(pointGroundDistance)`};
      if (pointGroundSign == 0.0) {
        pointGroundSign = cameraGroundRelative;
      }

      // cameraGroundRelative is -1 if camera is below ground, 1 if above ground
      // groundRelative is 1 if both camera and symbol are on the same side of the ground, -1 otherwise
      float groundRelative = cameraGroundRelative * pointGroundSign;

      // view angle dependent part of polygon offset emulation: we take the absolute value because the sign that is
      // dropped is instead introduced using the ground-relative position of the symbol and the camera
      if (polygonOffset > .0) {
        float cosAlpha = clamp(absCosAngle, 0.01, 1.0);
        float tanAlpha = sqrt(1.0 - cosAlpha * cosAlpha) / cosAlpha;
        float factor = (1.0 - tanAlpha / viewport[2]);

        // same side of the terrain
        if (groundRelative > 0.0) {
          posView *= factor;
        }
        // opposite sides of the terrain
        else {
          posView /= factor;
        }
      }

      return groundRelative;
    }
  `),e.draped&&!e.hasVerticalOffset||Co(a),e.draped||(a.uniforms.add(new Me("perDistancePixelRatio",t=>Math.tan(t.camera.fovY/2)/(t.camera.fullViewport[2]/2))),a.code.add($`
    void applyHUDVerticalGroundOffset(vec3 normalModel, inout vec3 posModel, inout vec3 posView) {
      float distanceToCamera = length(posView);

      // Compute offset in world units for a half pixel shift
      float pixelOffset = distanceToCamera * perDistancePixelRatio * ${$.float(Rt)};

      // Apply offset along normal in the direction away from the ground surface
      vec3 modelOffset = normalModel * cameraGroundRelative * pixelOffset;

      // Apply the same offset also on the view space position
      vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;

      posModel += modelOffset;
      posView += viewOffset;
    }
  `)),e.screenCenterOffsetUnitsEnabled&&At(a),e.hasScreenSizePerspective&&Mt(a),a.code.add($`
    vec4 projectPositionHUD(out ProjectHUDAux aux) {
      vec3 centerOffset = centerOffsetAndDistance.xyz;
      float pointGroundDistance = centerOffsetAndDistance.w;

      aux.posModel = position;
      aux.posView = (view * vec4(aux.posModel, 1.0)).xyz;
      aux.vnormal = normal;
      ${e.draped?"":"applyHUDVerticalGroundOffset(aux.vnormal, aux.posModel, aux.posView);"}

      // Screen sized offset in world space, used for example for line callouts
      // Note: keep this implementation in sync with the CPU implementation, see
      //   - MaterialUtil.verticalOffsetAtDistance
      //   - HUDMaterial.applyVerticalOffsetTransformation

      aux.distanceToCamera = length(aux.posView);

      vec3 viewDirObjSpace = normalize(cameraPosition - aux.posModel);
      float cosAngle = dot(aux.vnormal, viewDirObjSpace);

      aux.absCosAngle = abs(cosAngle);

      ${e.hasScreenSizePerspective&&(e.hasVerticalOffset||e.screenCenterOffsetUnitsEnabled)?"vec3 perspectiveFactor = screenSizePerspectiveScaleFactor(aux.absCosAngle, aux.distanceToCamera, screenSizePerspectiveAlignment);":""}

      ${e.hasVerticalOffset?e.hasScreenSizePerspective?"float verticalOffsetScreenHeight = applyScreenSizePerspectiveScaleFactorFloat(verticalOffset.x, perspectiveFactor);":"float verticalOffsetScreenHeight = verticalOffset.x;":""}

      ${e.hasVerticalOffset?$`
            float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * aux.distanceToCamera, verticalOffset.z, verticalOffset.w);
            vec3 modelOffset = aux.vnormal * worldOffset;
            aux.posModel += modelOffset;
            vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;
            aux.posView += viewOffset;
            // Since we elevate the object, we need to take that into account
            // in the distance to ground
            pointGroundDistance += worldOffset;`:""}

      float groundRelative = applyHUDViewDependentPolygonOffset(pointGroundDistance, aux.absCosAngle, aux.posView);

      ${e.screenCenterOffsetUnitsEnabled?"":$`
            // Apply x/y in view space, but z in screen space (i.e. along posView direction)
            aux.posView += vec3(centerOffset.x, centerOffset.y, 0.0);

            // Same material all have same z != 0.0 condition so should not lead to
            // branch fragmentation and will save a normalization if it's not needed
            if (centerOffset.z != 0.0) {
              aux.posView -= normalize(aux.posView) * centerOffset.z;
            }
          `}

      vec4 posProj = proj * vec4(aux.posView, 1.0);

      ${e.screenCenterOffsetUnitsEnabled?e.hasScreenSizePerspective?"float centerOffsetY = applyScreenSizePerspectiveScaleFactorFloat(centerOffset.y, perspectiveFactor);":"float centerOffsetY = centerOffset.y;":""}

      ${e.screenCenterOffsetUnitsEnabled?"posProj.xy += vec2(centerOffset.x, centerOffsetY) * pixelRatio * 2.0 / viewport.zw * posProj.w;":""}

      // constant part of polygon offset emulation
      posProj.z -= groundRelative * polygonOffset * posProj.w;
      return posProj;
    }
  `)}function Qe(o){o.uniforms.add(new Ao("alignPixelEnabled",e=>e.alignPixelEnabled)),o.code.add($`vec4 alignToPixelCenter(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.500123) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = (floor(xy * widthHeight) + vec2(0.5)) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`),o.code.add($`vec4 alignToPixelOrigin(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.5) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = floor((xy + 0.5 * pixelSz) * widthHeight) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`)}function Ra(o,e){const{vertex:a,fragment:t}=o;o.include(Mo,e),a.include(Qe),a.main.add($`vec4 posProjCenter;
if (dot(position, position) > 0.0) {
ProjectHUDAux projectAux;
vec4 posProj = projectPositionHUD(projectAux);
posProjCenter = alignToPixelCenter(posProj, viewport.zw);
forwardViewPosDepth(projectAux.posView);
vec3 vpos = projectAux.posModel;
if (rejectBySlice(vpos)) {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
} else {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
gl_Position = posProjCenter;
gl_PointSize = 1.0;`),t.main.add($`fragColor = vec4(1);
if(discardByTerrainDepth()) {
fragColor.g = 0.5;
}`)}function Ea(o){o.vertex.uniforms.add(new Me("renderTransparentlyOccludedHUD",e=>e.hudRenderStyle===0?1:e.hudRenderStyle===1?0:.75),new Je("viewport",e=>e.camera.fullViewport),new Dt("hudVisibilityTexture",e=>e.hudVisibility?.getTexture())),o.vertex.include(Qe),o.vertex.code.add($`bool testHUDVisibility(vec4 posProj) {
vec4 posProjCenter = alignToPixelCenter(posProj, viewport.zw);
vec4 occlusionPixel = texture(hudVisibilityTexture, .5 + .5 * posProjCenter.xy / posProjCenter.w);
if (renderTransparentlyOccludedHUD > 0.5) {
return occlusionPixel.r * occlusionPixel.g > 0.0 && occlusionPixel.g * renderTransparentlyOccludedHUD < 1.0;
}
return occlusionPixel.r * occlusionPixel.g > 0.0 && occlusionPixel.g == 1.0;
}`)}class Ua extends Do{constructor(e,a,t){super(e,"vec4",2,(i,s,n)=>i.setUniform4fv(e,a(s,n),t))}}function Et(o){const e=new pa,{signedDistanceFieldEnabled:a,occlusionTestEnabled:t,horizonCullingEnabled:i,pixelSnappingEnabled:s,hasScreenSizePerspective:n,debugDrawLabelBorder:r,hasVVSize:l,hasVVColor:c,hasRotation:u,occludedFragmentFade:p,sampleSignedDistanceFieldTexelCenter:h}=o;e.include(_a,o),e.vertex.include(Vo,o);const{occlusionPass:b,output:y,oitPass:m}=o;if(b)return e.include(Ra,o),e;const{vertex:d,fragment:v}=e;e.include(Ct),e.include(jo,o),e.include(To,o),t&&e.include(Ea),v.include(Fo),e.varyings.add("vcolor","vec4"),e.varyings.add("vtc","vec2"),e.varyings.add("vsize","vec2");const g=y===9,x=g&&t;x&&e.varyings.add("voccluded","float"),d.uniforms.add(new Je("viewport",P=>P.camera.fullViewport),new nt("screenOffset",(P,B)=>Xe(Ce,2*P.screenOffset[0]*B.camera.pixelRatio,2*P.screenOffset[1]*B.camera.pixelRatio)),new nt("anchorPosition",P=>ge(P)),new Fe("materialColor",P=>P.color),new Be("materialRotation",P=>P.rotation),new st("tex",P=>P.texture)),At(d),a&&(d.uniforms.add(new Fe("outlineColor",P=>P.outlineColor)),v.uniforms.add(new Fe("outlineColor",P=>mt(P)?P.outlineColor:uo),new Be("outlineSize",P=>mt(P)?P.outlineSize:0))),i&&d.uniforms.add(new Ua("pointDistanceSphere",(P,B)=>{const w=B.camera.eye,j=P.origin;return fo(j[0]-w[0],j[1]-w[1],j[2]-w[2],po.radius)})),s&&d.include(Qe),n&&(_o(d),Mt(d)),r&&e.varyings.add("debugBorderCoords","vec4"),e.attributes.add("uv0","vec2"),e.attributes.add("uvi","vec4"),e.attributes.add("color","vec4"),e.attributes.add("size","vec2"),e.attributes.add("rotation","float"),(l||c)&&e.attributes.add("featureAttribute","vec4"),d.code.add(i?$`bool behindHorizon(vec3 posModel) {
vec3 camToEarthCenter = pointDistanceSphere.xyz - localOrigin;
vec3 camToPos = pointDistanceSphere.xyz + posModel;
float earthRadius = pointDistanceSphere.w;
float a = dot(camToPos, camToPos);
float b = dot(camToPos, camToEarthCenter);
float c = dot(camToEarthCenter, camToEarthCenter) - earthRadius * earthRadius;
return b > 0.0 && b < a && b * b  > a * c;
}`:$`bool behindHorizon(vec3 posModel) { return false; }`),d.main.add($`
    ProjectHUDAux projectAux;
    vec4 posProj = projectPositionHUD(projectAux);
    forwardObjectAndLayerIdColor();

    if (rejectBySlice(projectAux.posModel)) {
      // Project outside of clip plane
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
      return;
    }

    if (behindHorizon(projectAux.posModel)) {
      // Project outside of clip plane
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
      return;
    }

    vec2 inputSize;
    ${H(n,$`
        inputSize = screenSizePerspectiveScaleVec2(size, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
        vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);`,$`
        inputSize = size;
        vec2 screenOffsetScaled = screenOffset;`)}
    ${H(l,$`inputSize *= vvScale(featureAttribute).xx;`)}

    vec2 combinedSize = inputSize * pixelRatio;
    vec4 quadOffset = vec4(0.0);

    ${H(t,$`
    bool visible = testHUDVisibility(posProj);
    if (!visible) {
      vtc = vec2(0.0);
      ${H(r,"debugBorderCoords = vec4(0.5, 0.5, 1.5 / combinedSize);")}
      return;
    }`)}
    ${H(x,$`voccluded = visible ? 0.0 : 1.0;`)}
  `);const C=$`
      vec2 uv = mix(uvi.xy, uvi.zw, bvec2(uv0));
      vec2 texSize = vec2(textureSize(tex, 0));
      uv = mix(vec2(1.0), uv / texSize, lessThan(uv, vec2(${Ia})));
      quadOffset.xy = (uv0 - anchorPosition) * 2.0 * combinedSize;

      ${H(u,$`
          float angle = radians(materialRotation + rotation);
          float cosAngle = cos(angle);
          float sinAngle = sin(angle);
          mat2 rotate = mat2(cosAngle, -sinAngle, sinAngle,  cosAngle);

          quadOffset.xy = rotate * quadOffset.xy;
        `)}

      quadOffset.xy = (quadOffset.xy + screenOffsetScaled) / viewport.zw * posProj.w;
  `,f=s?a?$`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:$`posProj += quadOffset;
if (inputSize.x == size.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:$`posProj += quadOffset;`;d.main.add($`
    ${C}
    ${c?"vcolor = interpolateVVColor(featureAttribute.y) * materialColor;":"vcolor = color / 255.0 * materialColor;"}

    ${H(y===10,$`vcolor.a = 1.0;`)}

    bool alphaDiscard = vcolor.a < ${$.float(te)};
    ${H(a,`alphaDiscard = alphaDiscard && outlineColor.a < ${$.float(te)};`)}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${f}
      gl_Position = posProj;
    }

    vtc = uv;

    ${H(r,$`debugBorderCoords = vec4(uv01, 1.5 / combinedSize);`)}
    vsize = inputSize;
  `),v.uniforms.add(new st("tex",P=>P.texture)),p&&!g&&v.uniforms.add(new Dt("depthMap",P=>P.mainDepth),new Me("occludedOpacity",P=>P.hudOccludedFragmentOpacity));const z=r?$`(isBorder > 0.0 ? 0.0 : ${$.float(te)})`:$.float(te),O=$`
    ${H(r,$`float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));`)}

    vec2 samplePos = vtc;

    ${H(h,$`
      float txSize = float(textureSize(tex, 0).x);
      float texelSize = 1.0 / txSize;

      // Calculate how much we have to add/subtract to/from each texel to reach the size of an onscreen pixel
      vec2 scaleFactor = (vsize - txSize) * texelSize;
      samplePos += (vec2(1.0, -1.0) * texelSize) * scaleFactor;`)}

    ${a?$`
      vec4 fillPixelColor = vcolor;

      // Get distance in output units (i.e. pixels)

      float sdf = texture(tex, samplePos).r;
      float pixelDistance = sdf * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - pixelDistance, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(pixelDistance) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < ${z} ||
          fillPixelColor.a + outlinePixelColor.a < ${$.float(te)}
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
          vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        ${H(!g,$`fragColor = vec4(compositeColor, compositeAlpha);`)}
      } else {
        if (fillAlphaFactor < ${z}) {
          discard;
        }

        ${H(!g,$`fragColor = premultiplyAlpha(fillPixelColor);`)}
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-pixelDistance/vsize.x*2.0, 0.0, 1.0), clamp(pixelDistance/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `:$`
          vec4 texColor = texture(tex, samplePos, -0.5);
          if (texColor.a < ${z}) {
            discard;
          }
          ${H(!g,$`fragColor = texColor * premultiplyAlpha(vcolor);`)}
          `}

    ${H(p&&!g,$`
        float zSample = texelFetch(depthMap, ivec2(gl_FragCoord.xy), 0).x;
        if (zSample < gl_FragCoord.z) {
          fragColor *= occludedOpacity;
        }
        `)}

    ${H(!g&&r,$`fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);`)}
  `;switch(y){case 0:case 1:e.outputs.add("fragColor","vec4",0),y===1&&e.outputs.add("fragEmission","vec4",1),m===1&&e.outputs.add("fragAlpha","float",y===1?2:1),v.main.add($`
        ${O}
        ${H(m===2,$`fragColor.rgb /= fragColor.a;`)}
        ${H(y===1,$`fragEmission = vec4(0.0);`)}
        ${H(m===1,$`fragAlpha = fragColor.a;`)}`);break;case 10:v.main.add($`
        ${O}
        outputObjectAndLayerIdColor();`);break;case 9:e.include(Ro,o),v.main.add($`
        ${O}
        outputHighlight(${H(x,$`voccluded == 1.0`,$`false`)});`)}return e}function mt(o){return o.outlineColor[3]>0&&o.outlineSize>0}function ge(o){return o.textureIsSignedDistanceField?Ha(o.anchorPosition,o.distanceFieldBoundingBox,Ce):co(Ce,o.anchorPosition),Ce}function Ha(o,e,a){Xe(a,o[0]*(e[2]-e[0])+e[0],o[1]*(e[3]-e[1])+e[1])}const Ce=Ye(),ye=32e3,Ia=$.float(ye),Ba=Object.freeze(Object.defineProperty({__proto__:null,build:Et,calculateAnchorPosition:ge,fullUV:ye},Symbol.toStringTag,{value:"Module"}));class Ga extends Uo{constructor(e,a){super(e,a,new Ho(Ba,()=>ho(()=>Promise.resolve().then(()=>Za),void 0)),fa([Ut,It()].map(ra))),this.primitiveType=a.occlusionPass?et.POINTS:et.TRIANGLE_STRIP}initializePipeline(e){const{oitPass:a,hasPolygonOffset:t,draped:i,output:s,depthTestEnabled:n,occlusionPass:r}=e,l=n&&!i&&a!==1&&!r&&s!==9;return la({blending:Vt(s)?Bo(a,!0):null,depthTest:n&&!i?{func:515}:null,depthWrite:l?ua:null,drawBuffers:Io(a,s),colorWrite:ca,polygonOffset:t?La:null})}}const La={factor:0,units:-4},Ut=Ft().vec2u8("uv0",{glNormalized:!0}),Ht=Ft().vec3f("position").vec3f("normal").vec4i16("uvi").vec4u8("color").vec2f("size").f32("rotation").vec4f("centerOffsetAndDistance").vec4f("featureAttribute"),qa=Ht.clone().vec4u8("olidColor");function It(){return Eo()?qa:Ht}class _ extends Go{constructor(e){super(),this.spherical=e,this.screenCenterOffsetUnitsEnabled=!1,this.occlusionTestEnabled=!0,this.signedDistanceFieldEnabled=!1,this.sampleSignedDistanceFieldTexelCenter=!1,this.hasVVSize=!1,this.hasVVColor=!1,this.hasVerticalOffset=!1,this.hasScreenSizePerspective=!1,this.hasRotation=!1,this.debugDrawLabelBorder=!1,this.hasPolygonOffset=!1,this.depthTestEnabled=!0,this.pixelSnappingEnabled=!0,this.draped=!1,this.terrainDepthTest=!1,this.cullAboveTerrain=!1,this.occlusionPass=!1,this.occludedFragmentFade=!1,this.horizonCullingEnabled=!0,this.isFocused=!0,this.olidColorInstanced=!1,this.textureCoordinateType=0,this.emissionSource=0,this.discardInvisibleFragments=!0,this.hasVVInstancing=!1,this.snowCover=!1}}E([U()],_.prototype,"screenCenterOffsetUnitsEnabled",void 0),E([U()],_.prototype,"occlusionTestEnabled",void 0),E([U()],_.prototype,"signedDistanceFieldEnabled",void 0),E([U()],_.prototype,"sampleSignedDistanceFieldTexelCenter",void 0),E([U()],_.prototype,"hasVVSize",void 0),E([U()],_.prototype,"hasVVColor",void 0),E([U()],_.prototype,"hasVerticalOffset",void 0),E([U()],_.prototype,"hasScreenSizePerspective",void 0),E([U()],_.prototype,"hasRotation",void 0),E([U()],_.prototype,"debugDrawLabelBorder",void 0),E([U()],_.prototype,"hasPolygonOffset",void 0),E([U()],_.prototype,"depthTestEnabled",void 0),E([U()],_.prototype,"pixelSnappingEnabled",void 0),E([U()],_.prototype,"draped",void 0),E([U()],_.prototype,"terrainDepthTest",void 0),E([U()],_.prototype,"cullAboveTerrain",void 0),E([U()],_.prototype,"occlusionPass",void 0),E([U()],_.prototype,"occludedFragmentFade",void 0),E([U()],_.prototype,"horizonCullingEnabled",void 0),E([U()],_.prototype,"isFocused",void 0);class Ri extends Lo{constructor(e,a){super(e,Ja),this.produces=new Map([[13,t=>_e(t)&&!this.parameters.drawAsLabel],[14,t=>_e(t)&&this.parameters.drawAsLabel],[12,()=>this.parameters.occlusionTest],[18,t=>this.parameters.draped&&_e(t)]]),this._visible=!0,this._configuration=new _(a)}getConfiguration(e,a){const t=this.parameters.draped;return super.getConfiguration(e,a,this._configuration),this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.hasVerticalOffset=!!this.parameters.verticalOffset,this._configuration.hasScreenSizePerspective=!!this.parameters.screenSizePerspective,this._configuration.screenCenterOffsetUnitsEnabled=this.parameters.centerOffsetUnits==="screen",this._configuration.hasPolygonOffset=this.parameters.polygonOffset,this._configuration.draped=t,this._configuration.occlusionTestEnabled=this.parameters.occlusionTest,this._configuration.pixelSnappingEnabled=this.parameters.pixelSnappingEnabled,this._configuration.signedDistanceFieldEnabled=this.parameters.textureIsSignedDistanceField,this._configuration.sampleSignedDistanceFieldTexelCenter=this.parameters.sampleSignedDistanceFieldTexelCenter,this._configuration.hasRotation=this.parameters.hasRotation,this._configuration.hasVVSize=!!this.parameters.vvSize,this._configuration.hasVVColor=!!this.parameters.vvColor,this._configuration.occlusionPass=a.slot===12,this._configuration.occludedFragmentFade=!t&&this.parameters.occludedFragmentFade,this._configuration.horizonCullingEnabled=this.parameters.horizonCullingEnabled,this._configuration.isFocused=this.parameters.isFocused,this._configuration.depthTestEnabled=this.parameters.depthEnabled||a.slot===12,Vt(e)&&(this._configuration.debugDrawLabelBorder=!!qo.LABELS_SHOW_BORDER),this._configuration.oitPass=a.oitPass,this._configuration.terrainDepthTest=a.terrainDepthTest,this._configuration.cullAboveTerrain=a.cullAboveTerrain,this._configuration}intersect(e,a,t,i,s,n){const{options:{selectionMode:r,hud:l,excludeLabels:c},point:u,camera:p}=t,{parameters:h}=this;if(!r||!l||c&&h.isLabel||!e.visible||!u||!p)return;const b=e.attributes.get("featureAttribute"),y=b==null?null:tt(b.data,qe),{scaleX:m,scaleY:d}=Ne(y,h,p.pixelRatio);Pt(Ae,a),e.attributes.has("featureAttribute")&&Wa(Ae);const v=e.attributes.get("position"),g=e.attributes.get("size"),x=e.attributes.get("normal"),C=e.attributes.get("rotation"),f=e.attributes.get("centerOffsetAndDistance");Tt(v.size>=3);const z=ge(h),O=this.parameters.centerOffsetUnits==="screen";for(let P=0;P<v.data.length/v.size;P++){const B=P*v.size;oe(A,v.data[B],v.data[B+1],v.data[B+2]),re(A,A,a),re(A,A,p.viewMatrix);const w=P*f.size;if(oe(T,f.data[w],f.data[w+1],f.data[w+2]),!O&&(A[0]+=T[0],A[1]+=T[1],T[2]!==0)){const V=T[2];L(T,A),W(A,A,G(T,T,V))}const j=P*x.size;if(oe(se,x.data[j],x.data[j+1],x.data[j+2]),Ge(se,Ae,p,we),ke(this.parameters,A,we,p,ve),p.applyProjection(A,D),D[0]>-1){O&&(T[0]||T[1])&&(D[0]+=T[0]*p.pixelRatio,T[1]!==0&&(D[1]+=ve.alignmentEvaluator.apply(T[1])*p.pixelRatio),p.unapplyProjection(D,A)),D[0]+=this.parameters.screenOffset[0]*p.pixelRatio,D[1]+=this.parameters.screenOffset[1]*p.pixelRatio,D[0]=Math.floor(D[0]),D[1]=Math.floor(D[1]);const V=P*g.size;R[0]=g.data[V],R[1]=g.data[V+1],ve.evaluator.applyVec2(R,R);const J=Lt*p.pixelRatio;let le=0;h.textureIsSignedDistanceField&&(le=Math.min(h.outlineSize,.5*R[0])*p.pixelRatio/2),R[0]*=m,R[1]*=d;const Q=P*C.size,k=h.rotation+C.data[Q];if(Le(u,D[0],D[1],R,J,le,k,h,z)){const ie=t.ray;if(re(De,A,$t(Gt,p.viewMatrix)),D[0]=u[0],D[1]=u[1],p.unprojectFromRenderScreen(D,A)){const S=F();N(S,ie.direction);const me=1/be(S);G(S,S,me),n(St(ie.origin,A)*me,S,-1,De)}}}}}intersectDraped(e,a,t,i,s){const n=e.attributes.get("position"),r=e.attributes.get("size"),l=e.attributes.get("rotation"),c=this.parameters,u=ge(c),p=e.attributes.get("featureAttribute"),h=p==null?null:tt(p.data,qe),{scaleX:b,scaleY:y}=Ne(h,c,e.screenToWorldRatio),m=Xa*e.screenToWorldRatio;for(let d=0;d<n.data.length/n.size;d++){const v=d*n.size,g=n.data[v],x=n.data[v+1],C=d*r.size;R[0]=r.data[C],R[1]=r.data[C+1];let f=0;c.textureIsSignedDistanceField&&(f=Math.min(c.outlineSize,.5*R[0])*e.screenToWorldRatio/2),R[0]*=b,R[1]*=y;const z=d*l.size,O=c.rotation+l.data[z];Le(t,g,x,R,m,f,O,c,u)&&i(s.distance,s.normal,-1)}}createBufferWriter(){return new Qa}applyShaderOffsetsView(e,a,t,i,s,n,r){const l=Ge(a,t,s,we);return this._applyVerticalGroundOffsetView(e,l,s,r),ke(this.parameters,r,l,s,n),this._applyPolygonOffsetView(r,l,i[3],s,r),this._applyCenterOffsetView(r,i,r),r}applyShaderOffsetsNDC(e,a,t,i,s){return this._applyCenterOffsetNDC(e,a,t,i),s!=null&&N(s,i),this._applyPolygonOffsetNDC(i,a,t,i),i}_applyPolygonOffsetView(e,a,t,i,s){const n=i.aboveGround?1:-1;let r=Math.sign(t);r===0&&(r=n);const l=n*r;if(this.parameters.shaderPolygonOffset<=0)return N(s,e);const c=vo(Math.abs(a.cosAngle),.01,1),u=1-Math.sqrt(1-c*c)/c/i.viewport[2];return G(s,e,l>0?u:1/u),s}_applyVerticalGroundOffsetView(e,a,t,i){const s=be(e),n=t.aboveGround?1:-1,r=t.computeRenderPixelSizeAtDist(s)*Rt,l=G(A,a.normal,n*r);return q(i,e,l),i}_applyCenterOffsetView(e,a,t){const i=this.parameters.centerOffsetUnits!=="screen";return t!==e&&N(t,e),i&&(t[0]+=a[0],t[1]+=a[1],a[2]&&(L(se,t),go(t,t,G(se,se,a[2])))),t}_applyCenterOffsetNDC(e,a,t,i){const s=this.parameters.centerOffsetUnits!=="screen";return i!==e&&N(i,e),s||(i[0]+=a[0]/t.fullWidth*2,i[1]+=a[1]/t.fullHeight*2),i}_applyPolygonOffsetNDC(e,a,t,i){const s=this.parameters.shaderPolygonOffset;if(e!==i&&N(i,e),s){const n=t.aboveGround?1:-1,r=n*Math.sign(a[3]);i[2]-=(r||n)*s}return i}set visible(e){this._visible=e}get visible(){const{color:e,outlineSize:a,outlineColor:t}=this.parameters,i=e[3]>=te||a>=te&&t[3]>=te;return this._visible&&i}createGLMaterial(e){return new Na(e)}calculateRelativeScreenBounds(e,a,t=wt()){return ka(this.parameters,e,a,t),t[2]=t[0]+e[0],t[3]=t[1]+e[1],t}}class Na extends ea{constructor(e){super({...e,...e.material.parameters})}beginSlot(e){return this.updateTexture(this._material.parameters.textureId),this._material.setParameters(this.textureBindParameters),this.getTechnique(Ga,e)}}function ka(o,e,a,t){t[0]=o.anchorPosition[0]*-e[0]+o.screenOffset[0]*a,t[1]=o.anchorPosition[1]*-e[1]+o.screenOffset[1]*a}function Ge(o,e,a,t){return Fa(e)&&(e=Pt(Ya,e)),mo(t.normal,o,e),re(t.normal,t.normal,a.viewInverseTransposeMatrix),t.cosAngle=We(Bt,Ka),t}function Wa(o){const e=o[0],a=o[1],t=o[2],i=o[3],s=o[4],n=o[5],r=o[6],l=o[7],c=o[8],u=1/Math.sqrt(e*e+a*a+t*t),p=1/Math.sqrt(i*i+s*s+n*n),h=1/Math.sqrt(r*r+l*l+c*c);return o[0]=e*u,o[1]=a*u,o[2]=t*u,o[3]=i*p,o[4]=s*p,o[5]=n*p,o[6]=r*h,o[7]=l*h,o[8]=c*h,o}function Le(o,e,a,t,i,s,n,r,l){let c=e-i-t[0]*l[0],u=c+t[0]+2*i,p=a-i-t[1]*l[1],h=p+t[1]+2*i;const b=r.distanceFieldBoundingBox;return r.textureIsSignedDistanceField&&b!=null&&(c+=t[0]*b[0],p+=t[1]*b[1],u-=t[0]*(1-b[2]),h-=t[1]*(1-b[3]),c-=s,u+=s,p-=s,h+=s),Xe(xt,e,a),xo(xe,o,xt,wo(n)),xe[0]>c&&xe[0]<u&&xe[1]>p&&xe[1]<h}const ve=new No,A=F(),se=F(),D=Ve(),Bt=F(),De=F(),xe=Ye(),xt=Ye(),Ae=Ot(),Ya=Ot(),Gt=bt(),Pe=Ve(),T=F(),Ie=F(),qe=Ve(),we={normal:Bt,cosAngle:0},Lt=1,Xa=2,R=zt(0,0),Ka=yt(0,0,1);class Ja extends ko{constructor(){super(...arguments),this.renderOccluded=1,this.isDecoration=!1,this.color=ot(1,1,1,1),this.polygonOffset=!1,this.anchorPosition=zt(.5,.5),this.screenOffset=[0,0],this.shaderPolygonOffset=1e-5,this.textureIsSignedDistanceField=!1,this.sampleSignedDistanceFieldTexelCenter=!1,this.outlineColor=ot(1,1,1,1),this.outlineSize=0,this.distanceFieldBoundingBox=Ve(),this.rotation=0,this.hasRotation=!1,this.vvSizeEnabled=!1,this.vvSize=null,this.vvColor=null,this.vvOpacity=null,this.vvSymbolAnchor=null,this.vvSymbolRotationMatrix=null,this.hasSlicePlane=!1,this.pixelSnappingEnabled=!0,this.occlusionTest=!0,this.occludedFragmentFade=!1,this.horizonCullingEnabled=!1,this.centerOffsetUnits="world",this.drawAsLabel=!1,this.depthEnabled=!0,this.isFocused=!0,this.focusStyle="bright",this.draped=!1,this.isLabel=!1}get hasVVSize(){return!!this.vvSize}get hasVVColor(){return!!this.vvColor}get hasVVOpacity(){return!!this.vvOpacity}}class Qa{constructor(){this.layout=Ut,this.instanceLayout=It()}elementCount(e){return e.get("position").indices.length}elementCountBaseInstance(e){return e.get("uv0").indices.length}write(e,a,t,i,s,n){const{position:r,normal:l,color:c,size:u,rotation:p,centerOffsetAndDistance:h,featureAttribute:b,uvi:y}=s;Xo(t.get("position"),e,r,n),Ko(t.get("normal"),a,l,n);const m=t.get("position").indices.length;let d=0,v=0,g=ye,x=ye;const C=t.get("uvi")?.data;C&&C.length>=4&&(d=C[0],v=C[1],g=C[2],x=C[3]);for(let f=0;f<m;++f){const z=n+f;y.setValues(z,d,v,g,x)}if(Jo(t.get("color"),4,c,n),rt(t.get("size"),u,n),Qo(t.get("rotation"),p,n),t.get("centerOffsetAndDistance")?lt(t.get("centerOffsetAndDistance"),h,n):ct(h,n,m),t.get("featureAttribute")?lt(t.get("featureAttribute"),b,n):ct(b,n,m),i!=null){const f=t.get("position")?.indices;if(f){const z=f.length,O=s.getField("olidColor",sa);Zo(i,O,z,n)}}return{numVerticesPerItem:1,numItems:m}}writeBaseInstance(e,a){const{uv0:t}=a;rt(e.get("uv0"),t,0)}intersect(e,a,t,i,s,n,r){const{options:{selectionMode:l,hud:c,excludeLabels:u},point:p,camera:h}=i;if(!l||!c||u&&a.isLabel||!p)return;const b=this.instanceLayout.createView(e),{position:y,normal:m,rotation:d,size:v,featureAttribute:g,centerOffsetAndDistance:x}=b,C=a.centerOffsetUnits==="screen",f=ge(a);if(y==null||m==null||d==null||v==null||x==null||h==null)return;const z=g==null?null:g.getVec(0,qe),{scaleX:O,scaleY:P}=Ne(z,a,h.pixelRatio),B=y.count;for(let w=0;w<B;w++){if(y.getVec(w,A),t!=null&&q(A,A,t),re(A,A,h.viewMatrix),x.getVec(w,Pe),oe(T,Pe[0],Pe[1],Pe[2]),!C&&(A[0]+=T[0],A[1]+=T[1],T[2]!==0)){const j=T[2];L(T,A),W(A,A,G(T,T,j))}if(m.getVec(w,se),Ge(se,Ae,h,we),ke(a,A,we,h,ve),h.applyProjection(A,D),D[0]>-1){C&&(T[0]||T[1])&&(D[0]+=T[0]*h.pixelRatio,T[1]!==0&&(D[1]+=ve.alignmentEvaluator.apply(T[1])*h.pixelRatio),h.unapplyProjection(D,A)),D[0]+=a.screenOffset[0]*h.pixelRatio,D[1]+=a.screenOffset[1]*h.pixelRatio,D[0]=Math.floor(D[0]),D[1]=Math.floor(D[1]),v.getVec(w,R),ve.evaluator.applyVec2(R,R);const j=Lt*h.pixelRatio;let V=0;a.textureIsSignedDistanceField&&(V=Math.min(a.outlineSize,.5*R[0])*h.pixelRatio/2),R[0]*=O,R[1]*=P;const J=d.get(w),le=a.rotation+J;if(Le(p,D[0],D[1],R,j,V,le,a,f)){const Q=i.ray;if(re(De,A,$t(Gt,h.viewMatrix)),D[0]=p[0],D[1]=p[1],h.unprojectFromRenderScreen(D,A)){const k=F();N(k,Q.direction);const ie=1/be(k);G(k,k,ie),r(St(Q.origin,A)*ie,k,w,De)}}}}}}function Ne(o,e,a){return o==null||e.vvSize==null?{scaleX:a,scaleY:a}:(Wo(Ie,e,o),{scaleX:Ie[0]*a,scaleY:Ie[1]*a})}function ke(o,e,a,t,i){if(!o.verticalOffset?.screenLength){const l=be(e);return i.update(a.cosAngle,l,o.screenSizePerspective,o.screenSizePerspectiveMinPixelReferenceSize,o.screenSizePerspectiveAlignment,null),e}const s=be(e),n=o.screenSizePerspectiveAlignment??o.screenSizePerspective,r=Yo(t,s,o.verticalOffset,a.cosAngle,n,o.screenSizePerspectiveMinPixelReferenceSize);return i.update(a.cosAngle,s,o.screenSizePerspective,o.screenSizePerspectiveMinPixelReferenceSize,o.screenSizePerspectiveAlignment,null),G(a.normal,a.normal,r),q(e,e,a.normal)}function Ei(o){return o.type==="point"}const Za=Object.freeze(Object.defineProperty({__proto__:null,build:Et,calculateAnchorPosition:ge,fullUV:ye},Symbol.toStringTag,{value:"Module"}));export{xi as A,wi as D,$i as E,Pi as G,ji as M,Si as Q,mi as U,bi as Z,Di as a,_i as b,Ai as c,_a as d,yi as e,Mi as f,vt as g,Ci as h,Ri as i,Oi as j,va as k,Qe as l,Ti as m,Ea as n,Vi as o,Da as p,Va as q,zi as r,Ei as t,Ma as u,gi as w,Fi as y};
