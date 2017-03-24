﻿{
/////////////////////////////////////////////////////////////////////////
//                                                                          
// MAkinE - Disney GEN EP Customizer
//
// ©2017 Jorge Vasquez
// Author: Jorge Vasquez
//                                                                          
// Version History
// 
// 0.2 Added "Tonight" to the possible day options, and a comma
// in between the month and the date.
// 
////////////////////////////////////////////////////////////////////////

var tcd_scriptName = "MAkinE - Disney GEN EP Customizer ";
var tcd_version = "0.2";

/////////////////////////////Array.indexOf for older JS/////////////////////
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let o be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var o = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of o with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = o.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = fromIndex | 0;

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of o with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of o with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
////////////////////////////////////////////////////////////////////////

function getItem( item_name, item_type ){
    var result = null;
    var items = app.project.items;
    var names = [];
    
    for ( i = 1 ; i <= items.length ; i ++ )
    {
        var item = items[i];
        var type = item.typeName;
        if ( ( type == item_type ) && ( item.name == item_name ) )
        {
            result = item;
            //$.writeln( item.name );
        }
    }
    return result;
}
function getFolder( given_name ){
    
    result = getItem( given_name, "Folder" );
    
    return result;
}
function getComp( given_name ){
    
    result = getItem( given_name, "Composition" );
    
    return result;
}
function hexToColor(theHex){
  var r = theHex >> 16;
  var g = (theHex & 0x00ff00) >> 8;
  var b = theHex & 0xff;
  return [r/255,g/255,b/255,1];
}
function titleCase(str) {
  str = str.toLowerCase().split(' ');

  for(var i = 0; i < str.length; i++){
    str[i] = str[i].split('');
    str[i][0] = str[i][0].toUpperCase(); 
    str[i] = str[i].join('');
  }
  return str.join(' ');
}
function getTitle(){
    var comp =  myPalette.comp;
    var title_layer = comp.layer("TITLE");
    var title = title_layer.sourceText.value.text;
    
    return title
    }
function formatTitle( s ){
    title = titleCase( s );
    var exp = new RegExp(" " , 'g');
    title = title.replace(" ","");
    title = title.replace(exp, '');
    
    return title;
    }
function generateName(){
    var name = getTitle();
    var extra = genExtraCode ();
    var date = genDateCode () ;
    if ( date != "" )
    {
        date = "_" + date;
    }
    
    if ( extra != "undefined" )
    {
        extra = "_" + extra;
    }
    else
    {
        extra = "";
    }
        
    name = formatTitle ( name ) + extra + date + "_" +genTimeCode ();
    return name
}
function genExtraCode(){
    if (!myPalette.grp.opt.extraSelected.value){
        return "undefined";
    }
    
    value = String(myPalette.grp.extra.extra.extraString.text); 
    
    return value;
}
function genDateCode(){
    
    var day = String(myPalette.grp.tunein.day.dayOption.selection).substr(0,3);
    
    if (!myPalette.grp.opt.dateSelected.value){
        return day;
    }

    
    var month = String(myPalette.grp.tuneindate.day.monthOption.selection).substr(0,3);
    var day_of_week = String(myPalette.grp.tuneindate.day.dateOption.selection);
    var ordinal = myPalette.getOrdinal( parseInt(myPalette.grp.tuneindate.day.dateOption.selection ) + 1 );
    var date = ordinal;

    

    var value = day + month + day_of_week + date ;
    
    return value
}
function genTimeCode(){
    var value = String(myPalette.grp.time.time_slot.timeOption.selection);
    if( myPalette.grp.time.time_slot.half.value == true )
    {
        value+=":30";
    }
    if( myPalette.grp.time.time_slot.nightTime.value == true )
    {
        value+="p";
    }
    else
    {
        value+="a";
    }
    return value.replace(":",".")
}
function genColorCode(){
    var id = String(myPalette.grp.match.title.paletteOption.selection);
    cc = "";
    switch ( id )
    {
        case "Blue_1":
        cc = "BLU1";
        break;
        case "Blue_2":
        cc  = "BLU2";
        break;
        case "Blue_3":
        cc = "BLU3";
        break;
        case "Gray":
        cc = "GRY";
        break;
        case "Magenta":
        cc = "MGN";
        break;
        case "Gold":
        cc = "GLD"
        break;
        }
    return cc;
}
function applyShowTitle( new_title ){
    var comp =  myPalette.comp;
    var title_layer = comp.layer("TITLE");
    var ctrl_layer = comp.layer("ctrl_bubble");
    title_layer.sourceText.setValue( new_title );
    
    width = title_layer.sourceRectAtTime(0, false).width;
    var new_scale;
    var new_center;

    if ( width >= 1300 )
    {
        new_scale = (1500/width)*100;
        new_center = [787,540];
    }
    else if ( width > 640 )
    {
        new_scale = 100;       
        new_center = [960,540];
    }
    else
    {
        new_scale = 100;
        new_center = [1040,540];
        
    }
    
    comp.layer("DONT_TOUCH_CTRL_CENTER")("Transform")("Position").setValue(new_center);
    comp.layer("ctrl_bubble")("Transform")("Scale").setValue([new_scale,new_scale]);
    ctrl_layer("Effects")("width")("Slider").setValue(width + 75);
}
var colors = {
    gray : 0x2C313B,
    purple : 0x7c36e1,
    purple_dark : 0x5525ab,
    yellow : 0xfffa38,
    yellow_dark : 0xBBB900,
    magenta : 0xE74DB7,
    magenta_dark : 0xA93886,
    cyan : 0x1BF0FF,
    cyan_darl : 0x128DA6,
    aqua_dark : 0x238573,
    aqua : 0x288492,
    aqua_light : 0x3ED8BB,
    bluish_gray : 0x2A3B52
}
function buildUI(thisObj) {

    if ( getComp("DC_GEN_EP_Vert_##Base##_10s") == null )
    {
        alert("Make sure to have the DC_GEN_EP_Vert Template project open before running the script");
        return;
    }
    
    if (thisObj instanceof Panel) {
        var myPal = thisObj;
    } else {
        var myPal = new Window("palette",tcd_scriptName + " v" + tcd_version,undefined, {resizeable:true});
    }

    if (myPal != null) {
        
        /*
        timeSelected: Checkbox { text: 'Time', alignment: ['fill','center']}, \
        daySelected: Checkbox { text: 'Day', alignment: ['left','center']}, \
        */
    
        var res = 
        "group { \
                    alignment: ['fill','fill'], \
                    alignChildren: ['left','top'], \
                    orientation: 'column', \
        title: Group { \
                    alignment: ['fill','top'], \
                    alignChildren: ['fill','top'], \
                    orientation:'column', \
                    title: Group { \
                        alignment: ['fill','top'], \
                        alignChildren: ['fill','top'], \
                        titleText: StaticText {text:'Show Title', alignment: ['left','center']}, \
                        titleString: EditText {text:'PLACEHOLDER TITLE',alignment: ['fill','center']}, \
                        } \
                    } \
        opt: Group { \
                            dateSelected: Checkbox { text: 'Date', alignment: ['left','center']}, \
                            extraSelected: Checkbox { text: 'Extra', alignment: ['left','center']}, \
                            socialSelected: Checkbox { text: 'Ears Bubble', alignment: ['left','center']}, \
                        },\
        time: Group { \
                    alignment: ['fill','top'], \
                    alignChildren: ['fill','top'], \
                    orientation:'column', \
                    time_slot: Group { \
                        alignment: ['fill','top'], \
                        alignChildren: ['fill','top'], \
                        timeText: StaticText {text:'Time', alignment: ['left','center']}, \
                        timeOption: DropDownList {alignment: ['fill','center']}, \
                        half: Checkbox {text:':30', alignment: ['left','center']}, \
                        nightTime: Checkbox {text:'PM', alignment: ['left','center']}, \
                        } \
                    } \
          tunein: Group { \
                    alignment: ['fill','top'], \
                    alignChildren: ['fill','top'], \
                    orientation:'column', \
                    day: Group { \
                        alignment: ['fill','top'], \
                        alignChildren: ['fill','top'], \
                        dayText: StaticText {text:'Day of the Week', alignment: ['left','center']}, \
                        dayOption: DropDownList {text:'PM',alignment: ['fill','center']}, \
                        dayShort: Checkbox {text:'Short', alignment: ['left','center']}, \
                        dayFlat: Checkbox {text:'Flat', alignment: ['left','center']}, \
                        } \
                    } \
        tuneindate: Group { \
                    alignment: ['fill','top'], \
                    alignChildren: ['fill','top'], \
                    orientation:'column', \
                    day: Group { \
                        alignment: ['fill','top'], \
                        alignChildren: ['fill','top'], \
                        monthText: StaticText {text:'Month', alignment: ['left','center']}, \
                        monthOption: DropDownList {alignment: ['fill','center']}, \
                        dateText: StaticText {text:'Date', alignment: ['left','center']}, \
                        dateOption: DropDownList {text:'PM',alignment: ['fill','center']}, \
                        } \
                    } \
        extra: Group { \
                    alignment: ['fill','top'], \
                    alignChildren: ['fill','top'], \
                    orientation:'column', \
                    extra: Group { \
                        alignment: ['fill','top'], \
                        alignChildren: ['fill','top'], \
                        extraText: StaticText {text:'Extra Text', alignment: ['left','center']}, \
                        extraString: EditText {text:'next',alignment: ['fill','center']}, \
                        } \
                    } \
        social: Group { \
                    alignment: ['fill','top'], \
                    alignChildren: ['fill','top'], \
                    orientation:'column', \
                    social: Group { \
                        alignment: ['fill','top'], \
                        alignChildren: ['fill','top'], \
                        socialText: StaticText {text:'Ear Bubble Text', alignment: ['left','center']}, \
                        socialString: EditText {text:'#EARSBUBBLE',alignment: ['fill','center']}, \
                        } \
                    } \
            doItBtn: Button {text: 'Apply to new Comp', alignment: ['center','top']} , \
                }";
       
        myPal.avatar_folder = getFolder("AVATAR_ICONS_1080x1080");
        myPal.comp = getComp("DC_GEN_EP_Vert_##Base##_10s");
        myPal.ctrl_day_layer  = myPal.comp.layer("DAY_CTRL");
        myPal.ctrl_time_layer  = myPal.comp.layer("TIME_CTRL");
        myPal.ctrl_extra_layer  = myPal.comp.layer("EXTRA_CTRL");
        myPal.ctrl_title_layer  = myPal.comp.layer("TITLE_CTRL");
        myPal.day_layer  = myPal.comp.layer("DAY");
        myPal.time_layer  = myPal.comp.layer("TIME");
        myPal.extra_layer  = myPal.comp.layer("EXTRA");
        myPal.title_layer  = myPal.comp.layer("TITLE");
        myPal.social_layer  = myPal.comp.layer("SOCIAL");
       
       //hackish... turn off the position offset.
        myPal.day_layer("Text")("Animators")("smaller")("Properties")("Position").setValue([0,0]);
        //myPal.day_layer.transform.position.setValue([-12,23.5]);
        
       myPal.extra_layers  = [
            myPal.comp.layer("EXTRA"),
            myPal.comp.layer("bubble_connect_extra"),
            myPal.comp.layer("bubble_extra"),
            myPal.comp.layer("bubble_extra_overlap")
            ];
        myPal.social_layers  = [
            myPal.comp.layer("SOCIAL"),
            myPal.comp.layer("Bubble_EARS")
            ];
            
        
        
        myPal.days_of_week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday", "Today", "Tomorrow", "Tonight"];
        myPal.time_slots = [ 1,2,3,4,5,6,7,8,9,10,11,12 ];
        myPal.months = [ "January","February","March","April","May","June","July","August","September","October","November","December"];
        myPal.timeMargin = 30;
        myPal.dayMargin = 95;
        myPal.extraVerticalOffset = 40;
        
        myPal.paletteOptionNames = {
            Gray :          "D",
            Gold :          "F",
            Magenta :    "G",
            Blue_1 :       "C",          
            Blue_2 :       "E",
            Blue_3 :       "H"
            };

        //myPal Methods -->
        myPal.updateFlat = function(){
            var isFlat;
            
            if ( myPal.grp.opt.dateSelected.value ){
                isFlat = myPal.grp.tunein.day.dayFlat.value;
            }
            else{
                isFlat = false;
            }
            myPal.applyFlat( );
        }
        myPal.updateFont = function ( opt ){
            var animators = [
                myPal.day_layer("Text")("Animators")("smaller"),
                myPal.time_layer("Text")("Animators")("smaller"),
                myPal.time_layer("Text")("Animators")("smaller"),
                myPal.extra_layer("Text")("Animators")("smaller")
            ];
            for ( var i = 0; i < animators.length ; i ++ )
            {
                animators[i].enabled = opt;
            }
            
            var ordinal = myPal.getOrdinal( parseInt(myPal.grp.tuneindate.day.dateOption.selection ) + 1 );
            
            if( ordinal == "nd" ){
                myPal.day_layer("Text")("Animators")("nd").enabled = true;
            }
            else
            {
                myPal.day_layer("Text")("Animators")("nd").enabled = false;
            }
                

        }
        myPal.setFontSize = function ( value ){
            myPal.day_layer.sourceText.value.fontSize = value;
            myPal.time_layer.sourceText.value.fontSize = value;
            myPal.extra_layer.sourceText.value.fontSize = value;
        }        
        myPal.updateBars = function(){
            var time_width = myPal.time_layer.sourceRectAtTime(0, false).width;
            var day_width = myPal.day_layer.sourceRectAtTime(0, false).width;
            var extra_width = myPal.extra_layer.sourceRectAtTime(0, false).width;
            
            myPal.ctrl_time_layer("Effects")("date_bubble_length")("Slider").setValue(time_width+day_width+(myPal.timeMargin*2.25));
            myPal.ctrl_extra_layer("Effects")("extra_bubble_length")("Slider").setValue( extra_width + (myPal.timeMargin*2.60) );
            myPal.ctrl_day_layer("Transform")("Position").setValue(myPal.ctrl_time_layer("Transform")("Position").value + [-time_width -myPal.timeMargin,0,0]);
            myPal.ctrl_extra_layer("Transform")("Position").setValue(myPal.ctrl_day_layer("Transform")("Position").value + [-day_width -myPal.dayMargin,myPal.extraVerticalOffset,0]);
            //myPal.ctrl_day_layer("Effects")("extrude_mult")("Slider").setValue(100);
        }
        myPal.getOrdinal = function(n){
            var ordinal = "th";
            
            var cyphers = String(n);
            var last_digit = parseInt(cyphers[cyphers.length-1]);
            
            if ( (n < 4) || ( n > 20 ) ){
                if ( last_digit == "1"){
                    ordinal = "st";
                    }
                else if( last_digit == "2"){
                    ordinal = "nd";
                    }
                else if( last_digit == "3"){
                    ordinal = "rd";
                    }
            }
        
            return ordinal;
        }
        myPal.getDate = function(){
            var date;
            return date;
        }
        myPal.updateTime = function(){
            var value = String(myPal.grp.time.time_slot.timeOption.selection);
            if( myPal.grp.time.time_slot.half.value == true )
            {
                value+=":30";
            }
            if( myPal.grp.time.time_slot.nightTime.value == true )
            {
                value+="p";
            }
            else
            {
                value+="a[";
            }
            
            myPal.applyTime( value );
        }
        myPal.updateDay = function(){
            var value = String(myPal.grp.tunein.day.dayOption.selection);
            myPal.applyDay( value );
        }
         myPal.updateDate = function(){
            if (!myPal.grp.opt.dateSelected.value){
                //myPal.updateDay();
                return;
            }
            var day_index = myPal.grp.tunein.day.dayOption.selection.index; 
            var short_day = String(myPal.grp.tunein.day.dayOption.selection).substr(0,3);
            var day = String( myPal.grp.tunein.day.dayOption.selection );
            var month = String(myPal.grp.tuneindate.day.monthOption.selection);
            var day_of_week = String(myPal.grp.tuneindate.day.dateOption.selection);
            var date_int = parseInt(myPal.grp.tuneindate.day.dateOption.selection ) ;
            var ordinal = myPal.getOrdinal( date_int );
            //var date = ordinal;
            
            var date = date_int;
            
            if ( myPal.grp.tunein.day.dayShort.value ){
                day = short_day;
            }
            
            month_space = " ";
            if ( day_index <= 6 )
            {
                month_space = "," + month_space;
            }
            
            var value = day + month_space + month + " " + day_of_week ;
            
            myPal.applyDay( value );
            //myPal.ctrl_day_layer("Effects")("extrude_mult")("Slider").setValue(0);
        }
        myPal.updateExtra = function(){
            if (!myPal.grp.opt.extraSelected.value){
            }
            else
            {
                var value = String( myPal.grp.extra.extra.extraString.text ).toLowerCase();
                myPal.applyExtra( value );
            }
        }
        myPal.updateTitle = function(){
           
            var value = String( myPal.grp.title.title.titleString.text ).toUpperCase();
            myPal.applyTitle( value );
        }
        myPal.updateSocial = function(){
            var value = String( myPal.grp.social.social.socialString.text );
            myPal.applySocial( value );
        }
        
        
        myPal.updateText = function(){
            
            myPal.updateFont( myPal.grp.opt.dateSelected.value );
            /*
            if( myPal.grp.opt.dateSelected.value ){
                myPal.ctrl_day_layer("Effects")("extrude_mult")("Slider").setValue(0);
            }
            else
            {
                myPal.ctrl_day_layer("Effects")("extrude_mult")("Slider").setValue(100);                
            }
            */
        }
        
        myPal.updateVisibility = function(){
            for ( var i = 0 ; i < myPal.extra_layers.length ; i ++ )
            {
                myPal.extra_layers[i].enabled =  myPal.grp.opt.extraSelected.value ;
            }
            for ( var i = 0 ; i < myPal.social_layers.length ; i ++ )
            {
                myPal.social_layers[i].enabled =  myPal.grp.opt.socialSelected.value ;
            }  
        }
        myPal.updateAll = function (){
            myPal.updateTitle();
            myPal.updateFlat();
            myPal.updateTime();
            myPal.updateDay();
            myPal.updateDate();
            myPal.updateExtra();
            myPal.updateSocial();
            myPal.updateText();
            myPal.updateBars();
            myPal.updateVisibility();
        }
        myPal.applyTime = function( s ){
            app.beginUndoGroup("applyTime");
            
            //myPal.updateBars();

            var singleton = s.search("a") != -1;
            
            myPal.time_layer("Text")("Animators")("singleton").enabled = singleton;
            /*    
            if( singleton  ){
                s = s+"a";
            }
            */
            
            myPal.time_layer.sourceText.setValue( s );
            app.endUndoGroup();
        };
        myPal.applyDay = function( s ){
            app.beginUndoGroup("applyDay");
            myPal.day_layer.sourceText.setValue( s );
            //myPal.updateBars();
            app.endUndoGroup();
        };        
        myPal.applyExtra = function( s ){
            app.beginUndoGroup("applyExtra");
            myPal.extra_layer.sourceText.setValue( s );
            //myPal.updateBars();
            app.endUndoGroup();
        }
        myPal.applyFlat = function( )
        {
            var isFlat = myPal.grp.tunein.day.dayFlat.value && myPal.grp.opt.dateSelected.value ;
            
            if ( isFlat == undefined ){
                isFlat = false;
            }
            
            app.beginUndoGroup("applyFlatness");
            
            //myPal.day_layer("Text")("Animators")("extrusion").enabled = isFlat;
            
            var s = "Do Not Touch";
            
            for (var i = 0 ; i < 5 ; i++ ){
                myPal.day_layer("Effects")(s).enabled = !isFlat;
                s+="-";
            }
            
            myPal.day_layer("Effects")("---------------").enabled = isFlat;
            app.endUndoGroup();
        }
        myPal.applySocial = function( s ){
            app.beginUndoGroup("applySocial");
            myPal.social_layer.sourceText.setValue( s );
            //myPal.updateBars();
            app.endUndoGroup();
        }
        myPal.applyTitle = function( s ){
            app.beginUndoGroup("applyTitle");
            myPal.title_layer.sourceText.setValue( s );
            width = myPal.title_layer.sourceRectAtTime(0, false).width;
            var new_scale;
            if ( width >= 270 )
            {
                new_scale = 270/width*100 ;
            }
            else
            {
                new_scale = 100;
            }
            myPal.ctrl_title_layer.transform.scale.setValue( [ new_scale, new_scale ]);
            //myPal.updateBars();
            app.endUndoGroup();
        }
        //myPal Methods <--
        
        myPal.grp = myPal.add(res);
        
        //populate days_of the week
        for ( var i = 0 ; i < myPal.days_of_week.length; i ++ ) {
            myPal.grp.tunein.day.dayOption.add("item", myPal.days_of_week[i]);
        }
        myPal.grp.tunein.day.dayOption.selection = 0;
        myPal.grp.tunein.day.dayOption.preferredSize.width = 75;
        
        //populate time_slots
        for ( var i = 0 ; i < myPal.time_slots.length; i ++ ) {
            myPal.grp.time.time_slot.timeOption.add("item", myPal.time_slots[i]);
        }
        myPal.grp.time.time_slot.timeOption.selection = 0;
       myPal.grp.time.time_slot.timeOption.preferredSize.width = 75;
        
        //populate moths
        for ( var i = 0 ; i < myPal.months.length; i ++ ) {
            myPal.grp.tuneindate.day.monthOption.add("item", myPal.months[i]);
        }
        myPal.grp.tuneindate.day.monthOption.selection = 0;
        myPal.grp.tuneindate.day.monthOption.preferredSize.width = 75;
      
      //populate days_of month
        for ( var i = 1 ; i <= 31; i ++ ) {
            myPal.grp.tuneindate.day.dateOption.add("item", i );
        }
        myPal.grp.tuneindate.day.dateOption.selection = 0;
        myPal.grp.tuneindate.day.dateOption.preferredSize.width = 75;
       
        //set initial visibility options

        myPal.grp.tuneindate.enabled = myPal.grp.tunein.day.dayShort.enabled = myPal.grp.extra.enabled = myPal.grp.social.enabled = myPal.grp.tunein.day.dayFlat.enabled = false;
        
        // control possible options

        myPal.grp.opt.dateSelected.onClick = function(){
            var dateSelected = this.value 
            myPal.grp.tuneindate.enabled = myPal.grp.tunein.day.dayShort.enabled = myPal.grp.tunein.day.dayFlat.enabled = dateSelected; 
            myPal.updateAll();
            }
        myPal.grp.opt.extraSelected.onClick = function(){ 
            myPal.grp.extra.enabled = this.value;
            myPal.updateAll();
        }
        myPal.grp.opt.socialSelected.onClick = function(){ 
            myPal.grp.social.enabled = this.value;
            myPal.updateAll();
        }
        myPal.grp.tunein.day.dayShort.onClick= function(){
            //writeLn(myPal.grp.tunein.day.dayShort.value);
            myPal.updateAll();
        }
         myPal.grp.tunein.day.dayFlat.onClick= function(){
            //writeLn(myPal.grp.tunein.day.dayShort.value);
            myPal.updateAll();
        }
        //Assign Methods to UI
        //Update on every UI change/click
        myPal.grp.social.social.socialString.onChange = myPal.grp.title.title.titleString.onChange = myPal.grp.extra.extra.extraString.onChange = myPal.grp.time.time_slot.timeOption.onChange = myPal.grp.time.time_slot.half.onClick = myPal.grp.time.time_slot.nightTime.onClick = myPal.grp.tunein.day.dayOption.onChange = myPal.grp.tuneindate.day.dateOption.onChange = myPal.grp.tuneindate.day.monthOption.onChange = myPal.updateAll;
        
        myPal.onDeactivate = function()
        { 
           //$.writeln("active");
        }
  
        myPal.grp.doItBtn.onClick = function () {
               var new_comp = myPal.comp.duplicate();
               new_comp.name = myPal.comp.name.replace("##Base##",generateName());
        }
        
        myPal.layout.layout(true);
        myPal.layout.resize();
        myPal.onResizing = myPal.onResize = function () {this.layout.resize();}
         
        } //if (myPal != null)
    return myPal;
    }

//main

var myPalette = buildUI(this);

//var tcd_folderName, tcd_addFolder, tcd_origParentFolder, tcd_parentFolder, previousComps, previousFolders;

if (parseFloat(app.version) < 8) {
    alert("This script requires Adobe After Effects CS3 or later.", tcd_scriptName);
    } else {
    if (myPalette != null && myPalette instanceof Window) {
        //myPalette.center();       
        myPalette.show();
    }
}
}
