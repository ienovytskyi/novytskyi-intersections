//input data
var examples = {
        first: [
        { x: 60,  y: 60  },
        { x: 180, y: 0   },
        { x: 300, y: 60  },
        { x: 300, y: 300 },
        { x: 240, y: 180 },
        { x: 210, y: 180 },
        { x: 180, y: 240 },
        { x: 150, y: 180 },
        { x: 120, y: 180 },
        { x: 60,  y: 300 },
    ],
    second: [
        { x: 30,  y: 240 },
        { x: 330, y: 240 },
        { x: 330, y: 210 },
        { x: 270, y: 90  },
        { x: 210, y: 270 },
        { x: 210, y: 90  },
        { x: 180, y: 60  },
        { x: 150, y: 90  },
        { x: 150, y: 270 },
        { x: 90,  y: 90  },
        { x: 30,  y: 210 }
    ]
};

//intersection points array
var interPoints = new Array();
//first input array self-intersection points array
var selfInterPointsF = new Array();
//second input array self-intersection points array
var selfInterPointsS = new Array();
//result array
var resArr = new Array();

//first block
//in the first block all the intersection and self-intersection points are looked for

//a,b - input arrays, p - flag to write result in different arrays: p=0 - intersection, p=1 && p=2 - self-intersection, p=3 - check if any non intersection points (self-intersection, points of input arrays) are part of result intersection polygon
//a1 - first point, first line; b1 - second point, first line; c2 - first point second line; d2 - second point second line
function runPoints (a,b,p) {
    for (var i=0; i<a.length; i++) {
        var a1=a[i];
        if (p!=3 && p!=4) {var b1=a[(i+1)%(a.length)];}
        //index for intersection numbers count
        if (p==3 || p==4) {var k1=0; var index=0;}
        for (var j=0; j<b.length; j++) {
            var c2=b[j];
            var d2=b[(j+1)%(b.length)];
            if (p!=3 && p!=4) {
//we dont check the same points during self-intersection
                if (a==b && ((i==j) || (c2.x==b1.x || a1.x==d2.x))) {continue;}
//x1<=x2, x3<=x4
                if (a1.x<=b1.x && c2.x<=d2.x) {intersection(a1,b1,c2,d2,p);}
                if (a1.x>b1.x && c2.x>d2.x) {intersection(b1,a1,d2,c2,p);}
                if (a1.x>b1.x && c2.x<=d2.x) {intersection(b1,a1,c2,d2,p);}
                if (a1.x<=b1.x && c2.x>d2.x) {intersection(a1,b1,d2,c2,p);}
            }
            if (p==3 || p==4) {
                if (c2.x<=d2.x) {var res=intersection(a1,k1,c2,d2,p);}
                if (c2.x>d2.x) {var res=intersection(a1,k1,d2,c2,p);}
                if (res==30) {index++;}
                if (res==20) {k1-=0.1; j--; continue;}
                if (res==10) {continue;}
            }
        }
//checking if any non intersection points (self-intersection, points of input arrays) are part of result intersection polygon, if a point from one input array belongs to another input array
        var temp1=i; var temp2=i;
        if (i==0) {temp1=a.length;}
        if (i==a.length-1) {temp2=-1;}
        if (p==4 && index%2==1) {return 1;}
        if (p==3 && index%2==1) {addInterPoints(a[i].x,a[i].y,0,a[temp1-1],a[temp2+1],0,0);}
        else if ((p==3 || p==4) && index%2==0) {continue;}
    }
    return 50;  //any number for fucn to return if nothing to do
} 

//finds intersection points
//we build line segments from two continuous points of input array. we build equation of two lines that passes two points. looking for intersection point and check if it belongs to the line segment
function intersection (a1,b1,c2,d2,p) {
//set the angular coefficient k1,k2 and free member n1,n2
    if (p==3 || p==4) {var k1=b1; var n1=a1.y-b1*a1.x;}
    else {
        if (a1.x == b1.x) {
            var k1=Math.abs((b1.y-a1.y)/(b1.x-a1.x));
            var n1=Math.abs((a1.y*b1.x-b1.y*a1.x)/(b1.x-a1.x));
        }
        else {
            var k1=(b1.y-a1.y)/(b1.x-a1.x);
            var n1=(a1.y*b1.x-b1.y*a1.x)/(b1.x-a1.x);
        }
    }
//in case of vertical line change angular coefficient (-infinity=infinity)
    if (c2.x == d2.x) {
        var k2=Math.abs((d2.y-c2.y)/(d2.x-c2.x)); 
        var n2=Math.abs((c2.y*d2.x-d2.y*c2.x)/(d2.x-c2.x));
    }
    else {
        var k2=(d2.y-c2.y)/(d2.x-c2.x);   
        var n2=(c2.y*d2.x-d2.y*c2.x)/(d2.x-c2.x);
    }
    
//parallel lines
    if (k1==k2 && n1!==n2) {
        return 0;
    }
    
//parallel vertical lines
    if (k1==Infinity && k2==Infinity && a1.x!=c2.x) {
        return 0;
    }
  
//imposed vertical lines
    if (k1==Infinity && k2==Infinity && a1.x==c2.x) {
        if (Math.max(a1.y,b1.y)<Math.min(c2.y,d2.y) || Math.max(c2.y,d2.y)<Math.min(a1.y,b1.y)) {return 0;}
        if (Math.max(a1.y,b1.y)==Math.min(c2.y,d2.y)) {addInterPoints(a1.x,Math.max(a1.y,b1.y),p,a1,b1,c2,d2);}
        if (Math.max(c2.y,d2.y)==Math.min(a1.y,b1.y)) {addInterPoints(a1.x,Math.max(c2.y,d2.y),p,a1,b1,c2,d2);}
        if (Math.min(a1.y,b1.y)<=Math.min(c2.y,d2.y)) {addInterPoints(a1.x,Math.min(a1.y,b1.y),p,a1,b1,c2,d2);}
        if (Math.min(a1.y,b1.y)>Math.min(c2.y,d2.y)) {addInterPoints(a1.x,Math.min(c2.y,d2.y),p,a1,b1,c2,d2);}
        if (Math.max(a1.y,b1.y)<=Math.max(c2.y,d2.y)) {addInterPoints(a1.x,Math.max(a1.y,b1.y),p,a1,b1,c2,d2);}
        if (Math.max(a1.y,b1.y)>Math.max(c2.y,d2.y)) {addInterPoints(a1.x,Math.max(c2.y,d2.y),p,a1,b1,c2,d2);}
    }

//imposed non vertical lines 
   if (k1==k2 && n1==n2 && k1!=Infinity && k2!=Infinity) {
        if (p==3 || p==4) {return 10;}
        else {
            if (b1.x<c2.x || d2.x<a1.x) {return 0;}
            if (d2.x==a1.x) {addInterPoints(d2.x,d2.y,p,a1,b1,c2,d2);} 
            if (b1.x==c2.x) {addInterPoints(b1.x,b1.y,p,a1,b1,c2,d2);}
            if (a1.x<=c2.x) {addInterPoints(c2.x,c2.y,p,a1,b1,c2,d2);}
                else {addInterPoints(a1.x,a1.y,p,a1,b1,c2,d2,p);}
            if (b1.x<=d2.x) {addInterPoints(b1.x,b1.y,p,a1,b1,c2,d2);}
                else {addInterPoints(d2.x,d2.y,p,a1,b1,c2,d2,p);}
        }
    } 
    
//lines intersect
    if (p!=3 && p!=4) {
        
    if (k1!==k2) {
        var xRes=0;
        var yRes=0;
//first line is horizontal, second line is non vertical
        if (a1.y==b1.y && c2.x!=d2.x) {
            xRes=(a1.y-n2)/k2;
            if (a1.y>=Math.min(c2.y,d2.y) && a1.y<=Math.max(c2.y,d2.y) && xRes>=c2.x && xRes<=d2.x && xRes>=a1.x && xRes<=b1.x) {
                addInterPoints(xRes,a1.y,p,a1,b1,c2,d2);
            }
        }
//second line is horizontal, first line is non vertical
        else if (c2.y==d2.y && a1.x!=b1.x) {
            xRes=(c2.y-n1)/k1;
            if (c2.y>=Math.min(a1.y,b1.y) && c2.y<=Math.max(a1.y,b1.y) && xRes>=c2.x && xRes<=d2.x && xRes>=a1.x && xRes<=b1.x) {
                addInterPoints(xRes,c2.y,p,a1,b1,c2,d2);
            }
        }
//first line is vertical, second line any
        else if (a1.x==b1.x) {
            if (c2.y==d2.y) {yRes=c2.y;} if (c2.y!=d2.y) {yRes=k2*a1.x+n2;}
            if (a1.x>=c2.x && a1.x<=d2.x && yRes>=Math.min(c2.y,d2.y) && yRes<=Math.max(c2.y,d2.y) && yRes>=Math.min(a1.y,b1.y) && yRes<=Math.max(a1.y,b1.y)) {
                addInterPoints(a1.x,yRes,p,a1,b1,c2,d2);
            }
        }
//second line is vertical, first line any
        else if (c2.x==d2.x) {
            if (a1.y==b1.y) {yRes=a1.y;} if (a1.y!=b1.y) {yRes=k1*c2.x+n1;}
            if (c2.x>=a1.x && c2.x<=b1.x && yRes>=Math.min(c2.y,d2.y) && yRes<=Math.max(c2.y,d2.y) && yRes>=Math.min(a1.y,b1.y) && yRes<=Math.max(a1.y,b1.y)) {
                addInterPoints(c2.x,yRes,p,a1,b1,c2,d2);
            }
        }
//other lines
      else {
            xRes=(((c2.y*d2.x-c2.x*d2.y)/(d2.x-c2.x)-(a1.y*b1.x-a1.x*b1.y)/(b1.x-a1.x)) / ((b1.y-a1.y)/(b1.x-a1.x)-(d2.y-c2.y)/(d2.x-c2.x)));
            yRes=(k1*(((c2.y*d2.x-c2.x*d2.y)/(d2.x-c2.x)-(a1.y*b1.x-a1.x*b1.y)/(b1.x-a1.x))/((b1.y-a1.y)/(b1.x-a1.x)-(d2.y-c2.y)/(d2.x-c2.x)))+n1);
            if (xRes>=a1.x && xRes>=c2.x && xRes<=b1.x && xRes<=d2.x && yRes>=Math.min(a1.y,b1.y) && yRes<=Math.max(a1.y,b1.y) && yRes>=Math.min(c2.y,d2.y) && yRes<=Math.max(c2.y,d2.y)) {
                addInterPoints(xRes,yRes,p,a1,b1,c2,d2);    
            }
        }
    }
    
    } //end if (p!=3)

//build line equation which passes one point with default angular coefficient set to 0 (can be changed in line k1-=0.1;) and look for intersection points. this point cant be vertex
    if (p==3 || p==4) {
        if (c2.y==d2.y && k1!=0) {
            xRes=(a1.y-k1*a1.x-n2)/(k2-k1);
            if (xRes>c2.x && xRes<d2.x && xRes>=a1.x) {return 30;}
            if (xRes==c2.x || xRes==d2.x) {return 20;}
            if (xRes<c2.x || xRes>d2.x || xRes<=a1.x) {return 10;}
        } //1 not hor 2 hor
        else if (c2.x==d2.x) {  //k2=inf
            if (k1==0) {yRes=a1.y;} if (k1!=0) {yRes=k1*(c2.x-a1.x)+a1.y;}
            if (yRes>Math.min(c2.y,d2.y) && yRes<Math.max(c2.y,d2.y) && c2.x>=a1.x) {return 30;}        //WARNING to use >=
            if (yRes==Math.min(c2.y,d2.y) || yRes==Math.max(c2.y,d2.y)) {return 20;}
            if (yRes<Math.min(c2.y,d2.y) || yRes>Math.max(c2.y,d2.y) || c2.x<=a1.x) {return 10;}
        }   //1 any 2 vert
        else {                  //k2!=inf && k1!=k2
            xRes=(a1.y-k1*a1.x-n2)/(k2-k1);
            yRes=k1*((a1.y-k1*a1.x-n2)/(k2-k1))+a1.y;
            if (xRes>c2.x && xRes<d2.x && xRes>=a1.x && yRes>Math.min(c2.y,d2.y) && yRes<Math.max(c2.y,d2.y)) {return 30;}      //WARNING to use >=
            if ((xRes==c2.x || xRes==d2.x) && (yRes==Math.min(c2.y,d2.y) || yRes==Math.max(c2.y,d2.y))) {return 20;}
            if ((xRes<c2.x || xRes>d2.x) || xRes<=a1.x || (yRes<Math.min(c2.y,d2.y) || yRes>Math.max(c2.y,d2.y))) {return 10;}
        }  
    }
}   //function end

//add found point to array. also we add all the points which can be directly connected to this one (build smth like a route map to see which next point we can get directly from this one)
function addInterPoints (xx,yy,p,a1,b1,c2,d2) {
    if (p==0) {addPoints(interPoints,xx,yy,a1,b1,c2,d2);}
    if (p==1) {addPoints(selfInterPointsF,xx,yy,a1,b1,c2,d2);}
    if (p==2) {addPoints(selfInterPointsS,xx,yy,a1,b1,c2,d2);}
}

function addPoints (a,xx,yy,a1,b1,c2,d2) {
//modify existent point to add new "routes"
    if (a.length!=0) {
        for (var i=0; i<a.length; i++) {
            if (a[i].x==xx && a[i].y==yy) {
                    if (check(a[i],a1)==1) {a[i]["route"][a[i]["route"].length]={x: a1.x, y: a1.y};}
                    if (check(a[i],b1)==1) {a[i]["route"][a[i]["route"].length]={x: b1.x, y: b1.y};}
                    if (check(a[i],c2)==1) {a[i]["route"][a[i]["route"].length]={x: c2.x, y: c2.y};}
                    if (check(a[i],d2)==1) {a[i]["route"][a[i]["route"].length]={x: d2.x, y: d2.y};}
                return 0;
            }
        }
    }
//add new point
        a[a.length]={x: xx, y: yy, route: []};
        if ((a1.x!=xx || a1.y!=yy) && a1!=0) {a[a.length-1]["route"][a[a.length-1]["route"].length]={x: a1.x, y: a1.y};}
        if ((b1.x!=xx || b1.y!=yy) && b1!=0) {a[a.length-1]["route"][a[a.length-1]["route"].length]={x: b1.x, y: b1.y};}
        if ((c2.x!=xx || c2.y!=yy) && c2!=0) {a[a.length-1]["route"][a[a.length-1]["route"].length]={x: c2.x, y: c2.y};}
        if ((d2.x!=xx || d2.y!=yy) && d2!=0) {a[a.length-1]["route"][a[a.length-1]["route"].length]={x: d2.x, y: d2.y};}
}

//looking for existent route. dont add if exist
function check (a,b) {
    if (b!=0) {
        for (var j=0; j<a["route"].length; j++) {
                if ((b.x==a["route"][j].x && b.y==a["route"][j].y) || (b.x==a.x && b.y==a.y)) {return 0;}
        }
        return 1;
    } else {return 0;}
}

//end of the first block
//------------------------------------------------------------
//second block

//correct our routes
function checkRoute (point,route) {
    var temp1=0; 
    var temp2=0;
    var temp4 = new Array();
    var temp=0; 
    for (var i=0; i<interPoints.length; i++) {
        if (route.x==interPoints[i].x && route.y==interPoints[i].y) {temp1=1; temp=interPoints[i];}
        if (point.x==route.x && (interPoints[i].x==point.x && interPoints[i].y>Math.min(point.y,route.y) && interPoints[i].y<Math.max(point.y,route.y))) {
            temp2=1; 
            temp4[temp4.length]=interPoints[i];
        }
        else if (point.y==route.y && (interPoints[i].y==point.y && interPoints[i].x>Math.min(point.x,route.x) && interPoints[i].x<Math.max(point.x,route.x))) {
            temp2=1; 
            temp4[temp4.length]=interPoints[i];
        }
        else if ((interPoints[i].x-point.x)/(route.x-point.x)==(interPoints[i].y-point.y)/(route.y-point.y) && interPoints[i].x!=point.x && interPoints[i].y!=point.y && interPoints[i].x>Math.min(point.x,route.x) && interPoints[i].x<Math.max(point.x,route.x) && interPoints[i].y>Math.min(point.y,route.y) && interPoints[i].y<Math.max(point.y,route.y)) {
            temp2=1;
            temp4[temp4.length]=interPoints[i];
        }
    }
    if (temp2!=0) {
        temp=temp4[0];
    //choose nearest point
        for (var i=0; i<temp4.length; i++) {
            if (Math.abs(point.x-temp4[i].x)<=Math.abs(point.x-temp.x) && Math.abs(point.y-temp4[i].y)<=Math.abs(point.y-temp.y)) {temp=temp4[i];}
        }
    }
    if (temp1==0 && temp2==0) {return 100;} //this route is bad. need new route
    if (temp1==1 || temp2==1) {
        if (checkLineSegment(point,temp,examples["first"],examples["second"])==30) {return temp;}
        else {return 100;}
    }   
}

function checkLineSegment (point,route,first,second) {
        if (checkLineSegmentFS(point,route,first)==1 || checkLineSegmentFS(point,route,second)==1) {return 30;}
        if (checkLineSegmentFS(point,route,first)!=1 && checkLineSegmentFS(point,route,second)!=1) {return 10;}
}

function checkLineSegmentFS (point,route,firstSecond) {
        //for mid line segment point to check
        if (firstSecond==examples["first"]) {var mlsp=examples["second"];}
        if (firstSecond==examples["second"]) {var mlsp=examples["first"];}
        for (var i=0; i<firstSecond.length; i++) {
            var a1=firstSecond[i];
            var b1=firstSecond[(i+1)%(firstSecond.length)];
            if ( point.x==route.x && point.x==a1.x && point.x==b1.x && (Math.min(point.y,route.y)>=Math.min(a1.y,b1.y) && Math.max(point.y,route.y)<=Math.max(a1.y,b1.y)) ) {
                for (var j=0; j<mlsp.length; j++) {
                        var a2=mlsp[j];
                        var b2=mlsp[(j+1)%(mlsp.length)];
                        if (((Math.min(a2.x,b2.x)==Math.min(point.x,route.x) && Math.min(a2.y,b2.y)==Math.min(point.y,route.y)) || (Math.max(a2.x,b2.x)==Math.max(point.x,route.x) && Math.max(a2.y,b2.y)==Math.max(point.y,route.y)) ) && point.x==a2.x && point.x==b2.x && Math.min(point.y,route.y)>=Math.min(a2.y,b2.y) && Math.max(point.y,route.y)<=Math.max(a2.y,b2.y)) {return 1;}
                }
                if ( (runPoints([{ x: point.x, y: Math.min(point.y,route.y)+(Math.max(point.y,route.y)-Math.min(point.y,route.y))/2 }],mlsp,4))==1 ) {return 1;}
            }
            else if ( point.y==route.y && point.y==a1.y && point.y==b1.y && (Math.min(point.x,route.x)>=Math.min(a1.x,b1.x) && Math.max(point.x,route.x)<=Math.max(a1.x,b1.x)) ) {
                for (var j=0; j<mlsp.length; j++) {
                        var a2=mlsp[j];
                        var b2=mlsp[(j+1)%(mlsp.length)];
                        if (((Math.min(a2.x,b2.x)==Math.min(point.x,route.x) && Math.min(a2.y,b2.y)==Math.min(point.y,route.y)) || (Math.max(a2.x,b2.x)==Math.max(point.x,route.x) && Math.max(a2.y,b2.y)==Math.max(point.y,route.y)) ) && point.y==a2.y && point.y==b2.y && Math.min(point.x,route.x)>=Math.min(a2.x,b2.x) && Math.max(point.x,route.x)<=Math.max(a2.x,b2.x)) {return 1;}
                }
                if ((runPoints([{ x: Math.min(point.x,route.x)+(Math.max(point.x,route.x)-Math.min(point.x,route.x))/2, y: point.y }],mlsp,4))==1) {return 1;}
            }
            else if ((point.x!=route.x && point.y!=route.y) && (point.x-a1.x)/(b1.x-a1.x)==(point.y-a1.y)/(b1.y-a1.y) && (route.x-a1.x)/(b1.x-a1.x)==(route.y-a1.y)/(b1.y-a1.y) ) {
                for (var j=0; j<mlsp.length; j++) {
                        var a2=mlsp[j];
                        var b2=mlsp[(j+1)%(mlsp.length)];
                        if (((Math.min(a2.x,b2.x)==Math.min(point.x,route.x) && Math.min(a2.y,b2.y)==Math.min(point.y,route.y)) || (Math.max(a2.x,b2.x)==Math.max(point.x,route.x) && Math.max(a2.y,b2.y)==Math.max(point.y,route.y)) ) && Math.min(point.x,route.x)>=Math.min(a2.x,b2.x) && Math.max(point.x,route.x)<=Math.max(a2.x,b2.x) && Math.min(point.y,route.y)>=Math.min(a2.y,b2.y) && Math.max(point.y,route.y)<=Math.max(a2.y,b2.y) ) {return 1;}
                }
                if ((runPoints([{ x: Math.min(point.x,route.x)+(Math.max(point.x,route.x)-Math.min(point.x,route.x))/2, y: ((Math.min(point.x,route.x)+(Math.max(point.x,route.x)-Math.min(point.x,route.x))/2)-point.x)*(route.y-point.y)/(route.x-point.x)+point.y }],mlsp,4))==1 ) {return 1;}
            }
        }
        return 0;
}

function makeGoodRoutes () {
    for (var n=0; n<interPoints.length; n++) {
        for (var m=0; m<interPoints[n]["route"].length; m++) {
            var routeToMod=checkRoute(interPoints[n],interPoints[n]["route"][m]);
            if (routeToMod==100) {interPoints[n]["route"].splice(m,1); m--;}
            else {
                interPoints[n]["route"][m].x=routeToMod.x; 
                interPoints[n]["route"][m].y=routeToMod.y;
            }
        }
    }
}

//end of the second block
//-------------------------------------------------------
//third block

//take first point from intesection array. take first route. these are first and second points of the result array. then we look for available route in second point. choose the first one available. this is the third point. and so on till available routes end. if there are available points in intersection array, we create new result array and repeat 
function intersect () {
    runPoints(examples["first"],examples["second"],0);
    runPoints(examples["first"],examples["first"],1);
    runPoints(examples["second"],examples["second"],2);
    runPoints(examples["first"],examples["second"],3);
    runPoints(examples["second"],examples["first"],3);
    makeGoodRoutes();
    var markers = new Array();
    if (interPoints.length==0) {return resArr;}
    helpMeToBuildResArr(0,markers);
        step: for (var i=0; i<interPoints.length; i++) {
            for (var j=0; j<markers.length; j++) {
                if (interPoints[i].x==markers[j].x && interPoints[i].y==markers[j].y) {
                    continue step;
                }
            }
                helpMeToBuildResArr(i,markers);
        }
        for (var l=0; l<resArr.length; l++) {
            if (resArr[l].length<2) {
                resArr.splice(l,1); 
                l--;
            }
        }
return resArr;
}

function helpMeToBuildResArr (i,markers) {
    var first=0;
    var next=0;
    resArr[resArr.length]=new Array();
    first={x: interPoints[i].x, y: interPoints[i].y};
    resArr[resArr.length-1][resArr[resArr.length-1].length]=first;
    markers[markers.length]=first;
    next={x: interPoints[i]["route"][0].x, y: interPoints[i]["route"][0].y};
    resArr[resArr.length-1][resArr[resArr.length-1].length]=next;
    markers[markers.length]=next;
    for (var n=0; n<interPoints.length; n++) {
            if (interPoints[n].x==next.x && interPoints[n].y==next.y) {
                step: for (m=0; m<interPoints[n]["route"].length; m++) {
                    for (k=0; k<markers.length; k++) {
                        if (interPoints[n]["route"][m].x==markers[k].x && interPoints[n]["route"][m].y==markers[k].y) { continue step; }
                    }
                    next={x: interPoints[n]["route"][m].x, y: interPoints[n]["route"][m].y };
                    resArr[resArr.length-1][resArr[resArr.length-1].length]=next;
                    markers[markers.length]=next;
                    n=0;
                }
            }
    }
}

//end of the third block
//----------------------------------------------------------
//run block

intersect();    

