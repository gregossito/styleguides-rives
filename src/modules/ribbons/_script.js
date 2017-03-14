'use strict';

var Tween = require('./_js/Tween');
var Point = require('./_js/Point');
var Curve = require('./_js/Curve');

var GFrds = window.GFrds || {};

GFrds.ribbons = (function(){

  function module(selector){
    var $el = $(selector);
    var svgElement, curves = [], curvesPaths = [], curvesObj = [];
    var stageW, stageH, offset, origin, mousePos = {};
    var scrollStep = -1;
    var curveWidth;

    function init(){
      svgElement = $el.find('.gfrds_ribbons-svg').get(0);
      setParams();

      if( !GFrds.rippleCoef ){
        GFrds.rippleCoef = [
          [ Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005],
          [ Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005],
          [ Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005, Math.random() * 0.01 + 0.005],
        ];
      }
      origin = stageW / 2;
      offset = stageW / 24;

      var initPoints;
      var curveObj;
      curveWidth = 90;

      $el.find('path').each(function(i, el){

        curves.push(this);
        if( i == 0 ) {
          curveWidth = 80
        } else {
          curveWidth = 100;
        }

        //console.log( i + ">>" )
        initPoints = [new Point(origin, -50, "", GFrds.rippleCoef[i][0]),
                      new Point(origin + offset, stageH / 2, "Q", GFrds.rippleCoef[i][1]),
                      new Point(origin, stageH + 50, "", GFrds.rippleCoef[i][2]),
                      new Point(origin - curveWidth, stageH + 50, "", GFrds.rippleCoef[i][3]),
                      new Point(origin - curveWidth, stageH + 50, "", GFrds.rippleCoef[i][4]),
                      new Point(origin + offset - curveWidth, stageH / 2, "Q", GFrds.rippleCoef[i][5]),
                      new Point(origin - curveWidth, -50, "", GFrds.rippleCoef[i][6])
                    ];

        curveObj = new Curve();
        curveObj.init( this, initPoints.slice(), i );
        curvesObj.push( curveObj );
        curveObj.autoRipple();
      });

      loop();
      addListeners();
    }

    function setParams(){
      stageW = $( window ).width();
      stageH = $( window ).height();
    }

    function addListeners(){
      $(window).on('mousemove', function(e) {
        // storing the y position of the mouse - we want the y pos relative to the SVG container so we'll subtract the container top from clientY.
        mousePos.y = e.clientY;
        mousePos.x = e.clientX;
        var normMousePosX = mousePos.x / stageW;
        var normMousePosY = mousePos.y / stageH;
        var influenceX =  (normMousePosX - 0.5)
        var influenceY =  (normMousePosY - 0.5)

        for( var i = 0 ; i < curvesObj.length ; i ++ ){
          influenceX = influenceX;
          influenceY = influenceY;
          curvesObj[i].influence( influenceX, influenceY );
        }

        });

        $(window).scroll(function () {
            var scrollTop = $(window).scrollTop();
          //  console.log( scrollTop +"-- && --"+ scrollStep );
            if( scrollTop < 1500  && scrollStep != 0){
              console.log( "MOVE >> 0")
              scrollStep = 0
              for( var i = 0 ; i < curvesObj.length ; i ++ ){
                // TOP
                curvesObj[i].moveTo( 0, { x:(stageW / 4) * 1.5 - i * 50, y: -50 }, 5000, Tween.Easing.Quadratic.InOut )
                curvesObj[i].moveTo( 6, { x:(stageW / 4) * 1.5 - curveWidth - i * 50, y: -50 }, 5000, Tween.Easing.Quadratic.InOut )

                // MIDDLE
                curvesObj[i].moveTo( 1, { x:(stageW / 4) - i * 50, y: stageH/2 }, 5000, Tween.Easing.Quadratic.InOut )
                curvesObj[i].moveTo( 5, { x:(stageW / 4) - curveWidth - i * 50, y: stageH /2 }, 5000, Tween.Easing.Quadratic.InOut )

                // BOTTOM
                curvesObj[i].moveTo( 2, { x:(stageW / 4) - i * 50, y: stageH + 50 }, 5000, Tween.Easing.Quadratic.InOut )
                curvesObj[i].moveTo( 4, { x:(stageW / 4)- curveWidth - i * 50, y: stageH + 50 }, 5000, Tween.Easing.Quadratic.InOut )
              }
            }
            else if( scrollTop >= 1500 && scrollTop < 3000 && scrollStep != 1){
              console.log( "MOVE >> 1")
              scrollStep = 1
              for( var i = 0 ; i < curvesObj.length ; i ++ ){
                // TOP
                curvesObj[i].moveTo( 0, { x:(stageW / 4) * 2.5 - i * 50, y: -50 }, 5000, Tween.Easing.Quadratic.InOut )
                curvesObj[i].moveTo( 6, { x:(stageW / 4) * 2.5 - curveWidth - i * 50, y: -50 }, 5000, Tween.Easing.Quadratic.InOut )
                // MIDDLE
                curvesObj[i].moveTo( 1, { x:(stageW / 4) * 3 - i * 50, y: stageH /2}, 5000, Tween.Easing.Quadratic.InOut )
                curvesObj[i].moveTo( 5, { x:(stageW / 4) * 3 - curveWidth - i * 50, y: stageH /2 }, 5000, Tween.Easing.Quadratic.InOut )
                // BOTTOM
                curvesObj[i].moveTo( 2, { x:(stageW / 4) * 3 - i * 50, y: stageH + 50 }, 5000, Tween.Easing.Quadratic.InOut )
                curvesObj[i].moveTo( 4, { x:(stageW / 4)  * 3 - curveWidth - i * 50, y: stageH + 50 }, 5000, Tween.Easing.Quadratic.InOut )
              }
            }
            else if ( scrollTop >= 3000 && scrollStep != 2){
              scrollStep = 2;
              for( var i = 0 ; i < curvesObj.length ; i ++ ){
                // TOP
                curvesObj[i].moveTo( 0, { x:(stageW / 4) * 1.5 - i * 50, y: -50 }, 5000, Tween.Easing.Quadratic.InOut )
                curvesObj[i].moveTo( 6, { x:(stageW / 4) * 1.5 - curveWidth - i * 50, y: -50 }, 5000, Tween.Easing.Quadratic.InOut )
                // MIDDLE
                curvesObj[i].moveTo( 1, { x:(stageW / 4) - i * 50, y: stageH /2}, 5000, Tween.Easing.Quadratic.InOut )
                curvesObj[i].moveTo( 5, { x:(stageW / 4) - curveWidth - i * 50, y: stageH /2 }, 5000, Tween.Easing.Quadratic.InOut )
                // BOTTOM
                curvesObj[i].moveTo( 2, { x:(stageW / 4) - i * 50, y: stageH + 50 }, 5000, Tween.Easing.Quadratic.InOut )
                curvesObj[i].moveTo( 4, { x:(stageW / 4) - curveWidth - i * 50, y: stageH + 50 }, 5000, Tween.Easing.Quadratic.InOut )
              }
            }
         });

        $(window).on('resize', function(){
          setParams();
        });


        $(window).keypress(function (e) {
        var posX = -1;

        switch (e.which) {
          case 113:
            console.log( "<< move left <<")
            posX = stageW / 4;
            break;

          case 100:
            console.log( "<< move right >>")
            posX = (stageW / 4) * 3;
            break;

          case 115:
            posX = origin;
            break;
        }

        if( posX == -1 ) return;
        for( var i = 0 ; i < curvesObj.length ; i ++ ){
          curvesObj[i].moveTo( 2, { x:posX, y: stageH + 50 }, 2000, TWEEN.Easing.Quadratic.InOut );
          curvesObj[i].moveTo( 4, { x:posX - curveWidth, y: stageH + 50 }, 2000, TWEEN.Easing.Quadratic.InOut );
        }


      })
    }

    function loop(time) {

      for( var i = 0 ; i < curvesObj.length ; i ++ ){
        curvesObj[i].onEnterFrame( time )
      }
      requestAnimationFrame(loop);
    }

    init();

    return $el;
  }

  return function(selector){
    return $(selector).each(function(){
      module(this);
    });
  };

})();

$(document).ready(function(){
  GFrds.ribbons('.gfrds_ribbons');
});
