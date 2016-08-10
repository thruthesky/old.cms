function add_server_monitor( o ){



    var defaults = {
        id: 'no-id',
        title: 'No title',
        source_top: 'no source',
        source_disk: 'no-source',
        sound: 'siren',
        time_zone:'KST',
        count:2
    };

    o = $.extend( defaults, o );

    var container = '<div class=" container_stats container_' +o.id+ '">'+
        '<div class=" server_name name_' +o.id+ '" title="Server name"><h4>Server Name</h4></div>'+
       // '<hr style=" margin:4px; padding:0;">'+

        '<div class=" contain container_option" id="monitor-' +o.id+ '" title="Options">'+
        'Mute:<input type="checkbox" class="mute mute_' +o.id+ '" title="Mute">' +
        '<select class="sound sound_' +o.id+ '" style="width: 60px;">' +
        '   <option value="siren">siren</option>' +
        '   <option value="birds_phalcon">birds_phalcon</option>' +
        '</select>' +
        '</div>'+

        '<div class=" contain system_time system_time_' +o.id+ '" title="System Time">System Time</div>'+
        '<div class=" contain swap_usage swap_usage_' +o.id+ '" title = "Swap Usage">Swap Usage</div>'+

        '<div class=" contain container_disk_' +o.id+ '" title="Disk Health">'+
        'Disk'+
        '<span class=" indicator indicator_disk_' +o.id+ '" title = "89%">\200</span>'+
        '</div>'+

        '<div class=" contain container_memory_'+o.id+'" title="Memory Health">'+
        'Memory'+
        '<span class=" indicator indicator_memory_' +o.id+ '" title = "89%">\200</span>'+
        '</div>'+
        ''+

        '<div class="contain container_load">'+
        //'Load Average' +
        '<div class=" graph_load_average graph_load_' +o.id+ '" title="Load Average"></div>' +
        ''+
        '</div>'+

        '<div class="contain container_cpu">'+
        //'CPU Usage' +
        '<div class=" graph_cpu graph_cpu_' +o.id+ '" title="CPU Usage"></div>' +
        ''+
        '</div>'+
        ''+
        '</div>';

    var $m = $( container );

    $m.find('.sound').val( o.sound );

    $('body').append( $m );



    get_server_stat( o );
//function that will populate
}
//get server name, time and swap used
function get_plane_info( o, json ){
    var latest = json.length - 1;
    var time = json[ latest ].system_time;
    var new_time = time.substr( 0, 5 )+o.time_zone;

    var swap_free = convert_to_mb( json[ latest ].swap_free, 'kb' );
    var swap_total = convert_to_mb( json[ latest ].swap_total, 'kb' );
    var swap_used = Math.round( swap_total - swap_free )+"MB swap";

    $(".name_"+o.id).html("<h4>" +o.title+ "</h4>");
    $(".system_time_"+o.id).html( new_time );
    $(".swap_usage_"+o.id).html( swap_used );
    warning( swap_used, o );
  //  console.log( o.title );
}


function get_disk( o, json ){
    var length = json.length;

    var total_space = get_total_size( json, length, 'size' );
    var available_space = get_total_size( json, length, 'available' );

    var disk_percentage = ( available_space / total_space ) * 100;
    var new_disk_percentage = Math.round( disk_percentage );

    add_indicator( o, '.container_disk_'+o.id, new_disk_percentage, total_space);

    warning( new_disk_percentage, 'memory', o );
      // console.log( new_disk_percentage+'% disk health' );
}


function get_memory( o, json ){
    var length = json.length;
    
    var mem_total = Math.round(convert_to_mb(json[ length - 1 ].memory_total, 'kb'));
    var mem_used = Math.round(convert_to_mb(json[ length - 1 ].memory_used, 'kb'));
    var mem_cache = Math.round(convert_to_mb(json[ length - 1 ].memory_cache, 'kb'));
    var mem_free = (mem_total - mem_used) - mem_cache;
    var mem_usable = mem_free + mem_cache;

    var mem_percentage = Math.round((mem_usable / mem_total) * 100);

  //  console.log( mem_percentage );
    add_indicator( o, '.container_memory_'+o.id, mem_percentage, mem_usable);

    warning( mem_percentage, 'memory', o );
    
}

function get_load_average( o, json ){
    var location = ".graph_load_"+o.id;
    var $graph = $( location ) ;
    var length = json.length;
    var unit = 'Load Average';
    // -1 bec array count starts with 0 while length stars to 1
    var raw = json[ length - 1 ].load_average;
    var data =0;
    var param = 50;

    if( $graph.children().length == 0 ) {
        var eldest_data = length >= 88 ? length - 88 : 0;
        for ( var i = eldest_data; i < length; i++ ){

            raw = json[ i ].load_average;
            data = ( raw / 2 ) * 100 ;
           // console.log( raw );
            add_graph( o, location, data, raw, unit, i );
           // console.log( data );
            param = 100 - data;
           // console.log( param );
            warning( param, 'load', o );
        }
    }else{

        raw = json[ length -1 ].load_average;
       // raw = 1.75;
        data = parseInt( parseFloat( raw * 100 ) );
        add_graph(  o, location, data, raw, unit, length-1 );
        param = 100 - data;
        warning( param, 'load', o );

        var $span = $graph.find( "span:first-child" );
        $span.remove();
    }
}


function get_cpu(  o, json ){
    var length = json.length;
    var location = ".graph_cpu_"+o.id;
    var $graph = $( location );
    var raw;
    var data;

    if( $graph.children().length == 0 ) {
        var eldest_data = length >= 88 ? length - 88 : 0;
        for ( var i = eldest_data; i < length; i++ ){

            raw = json[ i ].cpu_idle;
            //data = parseInt( parseFloat( raw * 100 ) );
            data = Math.round( raw );
            // console.log( raw );
            add_graph( o, location, data, raw, '% Cpu idle', i );
            //console.log( data );

            warning( data, 'cpu', o );
        }
    }else{

        raw = json[ length -1 ].cpu_idle;
        data = Math.round( raw );
        add_graph( o, location, data, raw, '% Cpu idle', length - 1 );
        //console.log( raw );

        warning( data, 'cpu', o );
        var $span = $graph.find( "span:first-child" );
        $span.remove();
    }



   // console.log( raw_cpu );

}
function warning( param, unit, o ){

    if ( param <= 20 ){
        var $option = $("#monitor-"+o.id);
        if( $option.find('.mute_'+o.id).prop('checked') ){
            console.log( "Muted" );
        }
        else{
            play_mp3( o );
            console.log( 'play mp3' );
        }
    }
    else{
      //  console.log('ok');
    }

}



function get_server_stat( o ) {


        $.get(o.source_top, function (json) {

            var top = JSON.parse(json);
            get_plane_info( o , top );
            get_memory( o, top );
            get_load_average( o, top );
            get_cpu( o, top );
        });


    $.get( o.source_disk, function (json){

        var disk = JSON.parse(json);
            get_disk( o, disk );
    });


        setTimeout( function(){
            get_server_stat( o );
        }, 60999 );

}