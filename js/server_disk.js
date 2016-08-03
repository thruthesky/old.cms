function add_disk_monitor( o ) {


    var defaults = {
        id: 'no-id',
        title: 'No title',
        source: 'no-source',
        count: 0,
        sound: 'siren'
    };


    o = $.extend( defaults, o );

    var containers = '<div class=" container_disk_stats ' +o.id+ '">'+
        '<div class=" disk_name ' +o.id+ '" ><h4>'+o.title+'</h4></div>'+
        '<hr style=" margin:4px; padding:0;">'+
        'Mute<input type="checkbox" class="mute">' +
        '<select class="sound" style="width: 60px;">' +
        '   <option value="siren">siren</option>' +
        '   <option value="birds_phalcon">birds_phalcon</option>' +
        '</select>' +
        '<input type="text" title="Update count no. for ping drop siren." name="ping-drop-siren-no" size="2" value="'+o.count+'">' +

        '<div class=" graph_container ' +o.id+ '">'+
        '<div class=" label-disk  ' +o.id+ '"><h5>Disk Health:</h5></div>'+
        '<div class=" graph_disk disk_'+o.id+ '"> </div>'+
        '</div>'+

        '';

    var m = $( containers );
    $( 'body' ).append( m );

    //function here that can populate information
    get_server_disk( o );
}



function convert_to_mb( data_int, unit ){
    var current_value;
    //console.log(unit);
    if (unit == 'G') {
        //console.log( 'giga' );
        current_value = parseInt(data_int) * 1000;
        return current_value;
        //console.log( current_value );
    }
    else if( unit == 'M' ){
        //  console.log( 'Mega' );
        current_value = parseInt(data_int);
        return current_value;
        //    console.log( current_value );
    }
    else if( unit == '' ){
        //   console.log( 'kilo' );
        current_value = parseInt(data_int) * 1000000;
        return current_value;
        // console.log( current_value );
    }
    else{
        alert( "Can only parse disk unit of giga, mega and kilobytes! Update source code!" );
    }
}





function get_total_size( data, length, data_name ){
    var raw_data = 0;
    var data_int = 0;

    //var unit = "%";
    var patt_num = /[0-9]/g;
    var patt_string = /[A-Z]/i;
    var current_value = 0;


    var previous_value;
    var data_int_old;
    var unit_old;
    var unit;

    for (var i = 0; i < length; i++) {
        switch( data_name ){
            case 'size':
                raw_data = data[i].size;

                previous_value = current_value;
                data_int_old = raw_data.match(patt_num);
                unit_old = raw_data.match(patt_string);
                data_int = data_int_old.join("");
                unit = unit_old.join("");
                //convert to megabits
                // alert(data_int);
                current_value = previous_value + convert_to_mb( data_int, unit );
                break;

            case 'available':
                raw_data = data[i].available;

                previous_value = current_value;
                data_int_old = raw_data.match(patt_num);
                unit_old = raw_data.match(patt_string);
                data_int = data_int_old.join("");
                unit = unit_old.join("");
                current_value = previous_value + convert_to_mb( data_int, unit );
                console.log( convert_to_mb( data_int, unit ) );
                break;

            default:
                alert( "Can't handle"+data_name  );
        }
    }
    return current_value;
}


function get_disk( o, data ) {

    var location = ".disk_" + o.id;
    var $graph = $(location);
    var length = data.length;

    var total_space = get_total_size( data, length, 'size' );
    var available_space = get_total_size( data, length, 'available' );
    var space_percentage;
    var raw_data;
    var data_int;

    if ($graph.children().length < 200) {

        space_percentage = ( available_space / total_space ) * 100;
        raw_data = available_space;
        data_int = parseInt( space_percentage );

        bar_graph_disk( data_int, raw_data, 'disk', location );

    }
    else{
        space_percentage = ( available_space / total_space ) * 100;
        raw_data = available_space;
        data_int = parseInt( space_percentage );

        bar_graph_disk( data_int, raw_data, 'disk', location );
        var $span = $graph.find( "span:first-child" );
        $span.remove();
    }
}






function bar_graph_disk( data, raw, num, location ){
    // var id = o.id;
    var $graph = $( location );
    var color = '#356F07';
    var data_int = data;
    var new_raw = raw.toLocaleString();

    if ( data_int < 10 ){ color = 'red';}
    else if ( data_int < 20 ){ color = '#883322';}
    else if ( data_int < 35 ){ color = '#6F320B';}
    else if ( data_int < 50 ){ color = '#6F5F13';}
    else if ( data_int > 51 ){ color = '#356F07';}


    var height = Math.round( data  / 2);
    var top = Math.round(50 - ( height));


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

    var bar = '<span  " style="' +style+ '" title="' +new_raw+ 'MB '+data_int+'% free" id = "'+num+'">\200</span>';
    $graph.append( bar );
}


function get_server_disk( o ) {

    $.get(o.source, function (json) {

        var data = JSON.parse(json);


        get_disk( o, data );

    });
    setTimeout( function(){
        get_server_disk( o );
    }, 60999 );
}