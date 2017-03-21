{
/////////////////////////////////////////////////////////////////////////
//                                                                          
// MAkinE - Disney GEN BUMP Toolkit
//
// ©2017 Jorge Vasquez
// Author: Jorge Vasquez
//                                                                          
// Version History
//
////////////////////////////////////////////////////////////////////////

var tcd_scriptName = "MAkinE - DC GEN BUMP Toolkit ";
var tcd_version = "0.8";
//
/////////////////////////////Array.indexOf for older JS/////////////////////
////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////

function applyAvatar( item ){
    //$.writeln( item );
    var comp = myPalette.comp;
    //$.writeln(comp);
    var avatar_targets = [
    comp.layer("Main_Avatar"),
    comp.layer("Avatar_Echo_1"),
    comp.layer("Avatar_Echo_2")
    ];
    //$.writeln(avatar_targets);
    
    for ( var i = 0 ; i < avatar_targets.length ; i ++ )
    {
        avatar_targets[i].replaceSource(item,false);
    }
}
function applyPallette( palette_string ){
    var comp = myPalette.comp;
    
    var color_targets = {
        col_title:          comp.layer("TITLE")("Effects")("Fill")("Color"),
        col_bubble:         comp.layer("DONT_TOUCH_bubble")("Effects")("Fill")("Color"),
        col_bubble_shadow:  comp.layer("DONT_TOUCH_bubble_shadow")("Effects")("Fill")("Color"),
        col_logo_bg :       comp.layer("DISNEY_LOGO_Bubble_BG")("Effects")("Fill")("Color"),
        col_logo_fg:        comp.layer("DISNEY_LOGO_Bubble_FG")("Effects")("Fill")("Color"),
        col_logo_neutral:   comp.layer("DISNEY_LOGO_Bubble_GRAY")("Effects")("Fill")("Color"),
        col_logo_accent:    comp.layer("DISNEY_LOGO_Bubble_ACCENT")("Effects")("Fill")("Color"),
        };
        
    for ( var i in color_targets ){
           color_targets[i].setValue(hexToColor(palettes[palette_string][i]));
        }
}
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
function tcd_buildUI(thisObj) {

    if ( getComp("DC_GEN_BUMP_##Base##_5s") == null )
    {
        alert("Make sure to have the DC_GEN_BUMP Template project open before running the script");
        return;
    }
    
    if (thisObj instanceof Panel) {
        var myPal = thisObj;
    } else {
        var myPal = new Window("palette",tcd_scriptName + " v" + tcd_version,undefined, {resizeable:true});
    }

    if (myPal != null) {
        
        var res = 
        "group { \
                    alignment: ['fill','fill'], \
                    alignChildren: ['left','top'], \
                    orientation: 'column', \
          match: Group { \
                    alignment: ['fill','top'], \
                    alignChildren: ['fill','top'], \
                    orientation:'column', \
                    palette: Group { \
                        alignment: ['fill','top'], \
                        alignChildren: ['fill','top'], \
                        paletteText: StaticText {text:'Piece Palette', alignment: ['left','center']}, \
                        paletteOption: DropDownList {alignment: ['fill','center']}, \
                        } \
                    title: Group { \
                        alignment: ['fill','top'], \
                        alignChildren: ['fill','top'], \
                        titleTxt: StaticText {text:'Show Title', alignment: ['left','center']}, \
                        titleString: EditText {text: 'PLACEHOLDER TITLE', alignment: ['fill','center']}, \
                        } \
                    avatar: Group { \
                        alignment: ['fill','top'], \
                        alignChildren: ['fill','top'], \
                        avatarText: StaticText {text:'Avatar Image', alignment: ['left','center']}, \
                        avatarOption: DropDownList {alignment: ['fill','center']}, \
                        } \
                    } \
                    doItBtn: Button {text: 'Apply to new Comp', alignment: ['center','top']} , \
                }";
                //doItBtn: Button {text: 'Customize', alignment: ['right','top']} , \
  
        myPal.avatar_folder = getFolder("AVATAR_ICONS_1080x1080");
        myPal.comp = getComp("DC_GEN_BUMP_##Base##_5s");
        
        myPal.paletteOptionNames = {
            Gray :          "D",
            Gold :          "F",
            Magenta :    "G",
            Blue_1 :       "C",          
            Blue_2 :       "E",
            Blue_3 :       "H"
            };

        myPal.populateAvatars = function()
         {
             myPal.grp.match.avatar.avatarOption.removeAll();
             myPal.avatars = [];
                     
            if ( myPal.avatar_folder != null )
            {
                for ( i = 1 ; i <= myPal.avatar_folder.numItems ; i ++ )
                {
                    myPal.avatars.push( myPal.avatar_folder.item(i) );
                    //$.writeln(myPal.avatars[i-1]);
                    myPal.grp.match.avatar.avatarOption.add("item", myPal.avatars[i-1].name);
                    //$.writeln( myPal.avatar_folder.item(i).name );
                }
            }
            myPal.grp.match.avatar.avatarOption.selection = myPal.avatars.indexOf ( myPal.comp.layer("Main_Avatar").source );
             }
         
        myPal.grp = myPal.add(res);

        for ( i in myPal.paletteOptionNames ) {
            myPal.grp.match.palette.paletteOption.add("item",i);
        }
        
        //myPal.avatars = [];
        
        myPal.populateAvatars ();        

        myPal.grp.match.palette.paletteOption.selection = 0;
        myPal.grp.match.palette.paletteOption.minimumSize.width = myPal.grp.match.palette.paletteOption.preferredSize.width = 75;
                                 
         myPal.grp.match.title.titleString.onChange = function () {
             //alert("changing text");
            if( myPal.comp == null )
             {
                 return;
              }            
            app.beginUndoGroup("Change Text");
            var title = myPalette.grp.match.title.titleString.text;
            applyShowTitle( title );  
            app.endUndoGroup();
         }
         myPal.grp.match.palette.paletteOption.onChange = function () {
             //alert("changing palette");
             if( myPal.comp == null )
             {
                 return;
              }
            app.beginUndoGroup("Change Palette");
            var id = myPal.paletteOptionNames[myPalette.grp.match.palette.paletteOption.selection];
            setBG( id );
            applyPallette( id );
            app.endUndoGroup();
         }
        myPal.grp.match.avatar.avatarOption.onChange = function () {
            try
            {
                applyAvatar( myPal.avatars[myPal.grp.match.avatar.avatarOption.selection.index ] );
            }
            catch(err)
            {
                return;
            }
            //applyAvatar( myPal.avatars[myPal.grp.match.avatar.avatarOption.selection.index] );
         }
        myPal.onActivate = function()
        { 
            myPal.populateAvatars ();
        }
     /*
        myPal.grp.match.avatar.avatarOption.onActivate = function () {
             myPal.populateAvatars ();
         }
         */
        /*
         //myPal.grp.doItBtn.onClick = function () 
        */
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

function formatTitle( s )
{
    title = titleCase( s );
    var exp = new RegExp(" " , 'g');
    title = title.replace(" ","");
    title = title.replace(exp, '');
    
    return title;
    }
function generateName(){
    var name = getTitle();
    name = formatTitle ( name ) + "_" + genColorCode ();
    return name
}
function genColorCode()
{
    var id = String(myPalette.grp.match.palette.paletteOption.selection);
    cc = "";
    /*
     * 
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
        */
    if ( id.search("Blu") == -1 ){   
        cc = id.substr(0,3);
    }
    else
    {
        cc = id.substr(0,3) + id[5];
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
function setBG ( id ){
    new_source = myPalette.comp.layer("DC_GEN_BG_"+String(id)).source;
    a = myPalette.comp.layer("BG");
    a.replaceSource(new_source,false)
}
var paletteOptions = ["C","D","E","F","G","H"];       

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

var palettes = {
    A : {
        col_title:          colors.magenta,
        col_bubble:         colors.yellow,
        col_bubble_shadow:  colors.yellow_dark,
        col_logo_bg :       colors.yellow,
        col_logo_fg:        colors.magenta,
        col_logo_neutral:   colors.gray,
        col_logo_accent:    0x19EDFF
        },
    C : {
        col_title:          colors.magenta,
        col_bubble:         colors.yellow,
        col_bubble_shadow:  colors.yellow_dark,
        col_logo_bg :       colors.yellow,
        col_logo_fg:        colors.magenta,
        col_logo_neutral:   colors.gray,
        col_logo_accent:    colors.purple
        },
    D : {
        col_title:          colors.bluish_gray,
        col_bubble:         colors.aqua_light,
        col_bubble_shadow:  colors.aqua_dark,
        col_logo_bg :       colors.yellow,
        col_logo_fg:        colors.magenta,
        col_logo_neutral:   colors.gray,
        col_logo_accent:    colors.purple
        },
    E : {
        col_title:          colors.aqua,
        col_bubble:         colors.yellow,
        col_bubble_shadow:  colors.yellow_dark,
        col_logo_bg :       colors.purple,
        col_logo_fg:        colors.yellow,
        col_logo_neutral:   colors.gray,
        col_logo_accent:    colors.magenta
        },
    F : {
        col_title:          colors.cyan,
        col_bubble:         colors.magenta,
        col_bubble_shadow:  colors.magenta_dark,
        col_logo_bg :       colors.purple,
        col_logo_fg:        colors.cyan,
        col_logo_neutral:   colors.gray,
        col_logo_accent:    colors.magenta
        },
    G : {
        col_title:          colors.yellow,
        col_bubble:         colors.purple,
        col_bubble_shadow:  colors.purple_dark,
        col_logo_bg :       colors.purple,
        col_logo_fg:        colors.yellow,
        col_logo_neutral:   colors.cyan,
        col_logo_accent:    colors.gray
        },
    H: {
        col_title:          colors.purple,
        col_bubble:         colors.yellow,
        col_bubble_shadow:  colors.yellow_dark,
        col_logo_bg :       colors.purple,
        col_logo_fg:        colors.yellow,
        col_logo_neutral:   colors.gray,
        col_logo_accent:    0xE74DB7
        }
}

//main

var myPalette = tcd_buildUI(this);
var tcd_folderName, tcd_addFolder, tcd_origParentFolder, tcd_parentFolder, previousComps, previousFolders;

if (parseFloat(app.version) < 8) {
    alert("This script requires Adobe After Effects CS3 or later.", tcd_scriptName);
    } else {
    if (myPalette != null && myPalette instanceof Window) {
        //myPalette.center();       
        myPalette.show();
    }
}
}
