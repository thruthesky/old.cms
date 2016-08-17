/**
 * Created by ontue on 8/9/2016.
 */

function add_indicator( o, location, data, raw ){
    var $indicator = $( location );

    var new_data = Math.round( data );

    var normal = 'green';
    var watch = ' #ff6600';
    var emergency = 'red';

    var color = normal;

    if ( data >= 65 ) color = normal;
    else if ( data <  30 ) color = emergency;
    else if ( data < 65 ) color = watch;

    var style =  'width: 10px;'+
        'height:10px;'+
        'margin:4px;'+
        'margin-left: 7px;'+
        'margin-right: 7px;'+
        'border-radius: 5px;'+
        'background-color:'+color+';'+
        '';

    var bar = '<span style= "'+style+'" class="indicator indicator_'+o.id+'" title = "'+new_data+'%">\200</span>';
    $indicator.append( bar );

    var $span = $indicator.find( "span:first-child" );
    $span.remove();
//console.log( location );
}



function add_graph( o, location, data, raw, unit, count ){
    var $graph = $( location );
    var height;
    var top;

    var normal = 'green';
    var watch = ' #ff6600';
    var emergency = 'red';

    var color = normal;
    if ( location == ".graph_load_"+o.id){
        if ( data >= 80 ) color = emergency;
        else if ( data < 60 ) color = normal;
        else if ( data < 80 ) color = watch;
        
        if ( data > 100 ) data = 100;
        height = Math.round( (data  / 4) + 1);
        top = Math.round(26 - ( height));

    }
    else{
    if ( data >= 65 ) color = normal;
    else if ( data <  30 ) color = emergency;
    else if ( data < 65 ) color = watch;
    
        height = Math.round( (data  / 4));
        top = Math.round(25 - ( height));
    }
    
    var style =    'margin: 0;'+
        'padding: 0;'+
        'bottom: 0;'+
        'width:1px;'+
        'display: inline-block;'+
        'position: relative;'+
        'height:'+height+'px;' +
        'background-color:'+color+';'+
        'top:'+top+'px;'+
        '';
//console.log(graph);
    var bar = '<span  style="' +style+ '" title="' +raw+unit+ '" id = "'+count+'">\200</span>';
    $graph.append( bar );
    

}