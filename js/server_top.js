
function add_top_monitor( o ) {


    var defaults = {
        id: 'no-id',
        title: 'No title',
        source: 'no-source',
        count: 0,
        sound: 'siren'
    };


    o = $.extend( defaults, o );

    var containers = '<div class=" container_server_stats ' +o.id+ '">' +
        '<div class=" server_name ' +o.id+ '" ></div>' +
        '<hr style=" margin:0; padding:0;">' +
        '<div class=" system_time ' +o.id+ '"></div>' +
        '<div class=" up_day ' +o.id+ '"></div>' +
        '<div class=" no_task ' +o.id+ '"></div>' +
        '<div class=" swap_total ' +o.id+ '"></div>' +
        '<div class=" swap_free ' +o.id+ '"></div>' +

            //graph
        '<div class=" graph_container ' +o.id+ '">' +

        '<hr style=" margin:0; padding:0;">' +
        '<div class=" label-load ' +o.id+ '"><h5>Load Average:</h5></div>' +
        'Mute<input type="checkbox" class="mute">' +
        '<select class="sound" style="width: 60px;">' +
        '   <option value="siren">siren</option>' +
        '   <option value="birds_phalcon">birds_phalcon</option>' +
        '</select>' +
        '<input type="text" title="Update count no. for ping drop siren." name="ping-drop-siren-no" size="2" value="'+o.count+'">' +
        '<div class=" graph_load_average load_'+o.id+ '"> </div>' +

        '<hr style=" margin:0; padding:0;">' +
        '<div class=" label-cpu ' +o.id+ '"><h5>CPU Health:</h5></div>' +
        'Mute<input type="checkbox" class="mute">' +
        '<select class="sound" style="width: 60px;">' +
        '   <option value="siren">siren</option>' +
        '   <option value="birds_phalcon">birds_phalcon</option>' +
        '</select>' +
        '<input type="text" title="Update count no. for ping drop siren." name="ping-drop-siren-no" size="2" value="'+o.count+'">' +
        '<div class=" graph_cpu cpu_' +o.id+ '"></div>' +

        '<hr style=" margin:0; padding:0;">' +
        '<div class=" label-memory ' +o.id+ '"><h5>Memory Health:</h5></div>' +
        'Mute<input type="checkbox" class="mute">' +
        '<select class="sound" style="width: 60px;">' +
        '   <option value="siren">siren</option>' +
        '   <option value="birds_phalcon">birds_phalcon</option>' +
        '</select>' +
        '<input type="text" title="Update count no. for ping drop siren." name="ping-drop-siren-no" size="2" value="'+o.count+'">' +
        '<div class=" graph_memory memory_' +o.id+ '"></div>' +
        '</div>' +
        '</div>' +
        '';

    var m = $( containers );
    $( 'body' ).append( m );

    //function here that can populate information



    get_server_stat( o );
}

//add_server_stat();
//  add_server_stat( { id: 'withcenter', title: 'dev.withcenter.com', source: 'http://218.50.181.110/monitor/index.php' } );
//
//
//


function get_basic_information( o, data ){

    var latest = data.length - 1;
    var time = data[ latest ].system_time;
    var up_days = data[ latest ].up_days;
    //var user = data[ latest ].no_of_user;
    var task = data[ latest ].tasks;
    var swap_free = data[ latest ].swap_free;
    var swap_total = data[ latest ].swap_total;
    //var zombie = data[ latest ].zombie;

    var label_style ="<h4>"+ o.title +"</h4>";
    var time_style = "<div class='title'>System Time:</div><h5>"+ time +"</h5>";
    var up_style = "<div class='title'>Up Days:</div><h5> "+ up_days +" days</h5>";
    var task_style = "<div class='title'>Tasks:</div><h5>"+ task +"</h5>";
    var swap_total_style ="<div class='title'>Swap total:</div><h5>"+ swap_total +" kb</h5>";
    var swap_free_style ="<div class='title'>Swap free:</div><h5>"+ swap_free +" kb</h5>";


    $(".no_task").html(task_style);
    $(".server_name").html(label_style);
    $(".system_time").html(time_style);
    $(".up_day").html(up_style);
    $(".swap_total").html(swap_total_style);
    $(".swap_free").html(swap_free_style);

}




function get_load_average( o, data ){
    var location = ".load_"+o.id;
    var $graph = $( location );
    var length = data.length;
    var raw_data=0;
    var data_int=0;
    var unit ="load average";


    if( $graph.children().length == 0 ) {
        var eldest_data = length >= 200 ? length - 200 : 0;
        for ( var i = eldest_data; i < length; i++ ){

            raw_data=data[ i ].load_average;
            data_int = parseInt( parseFloat( raw_data * 100 ) );
            bar_graph_top( data_int, raw_data, i, location, unit,  o);
            // console.log( raw_data );
        }
    }else{

        raw_data = data[ length -1 ].load_average;
        data_int = parseInt( parseFloat( raw_data * 100 ) );
        bar_graph_top( data_int, raw_data, length-1, location, unit, o);
        // console.log( raw_data );
        var $span = $graph.find( "span:first-child" );
        $span.remove();
    }
}



function get_cpu_health( o, data ){
    var location = ".cpu_"+o.id;
    var $graph = $( location );
    var length = data.length;
    var raw_data=0;
    var data_int=0;
    var unit = "%";
    if( $graph.children().length == 0 ) {
        var eldest_data = length >= 200 ? length - 200 : 0;
        for ( var i = eldest_data; i < length; i++ ){

            raw_data=parseFloat( data[ i ].cpu_idle ).toFixed(2);
            data_int = parseInt( raw_data );
            bar_graph_top( data_int, raw_data, length-1, location, unit, o);
            //console.log( data_int );
        }
    }else{

        raw_data=parseFloat( data[ length-1 ].cpu_idle ).toFixed(2);
        data_int = parseInt( raw_data );
        bar_graph_top( data_int, raw_data, length-1, location, unit, o);
        //console.log( raw_data );

        var $span = $graph.find( "span:first-child" );
        $span.remove();
    }
}

function get_memory(  o, data ){
    // partial divide total then multiply 100 (roundo off)
    var location = ".memory_"+o.id;
    var $graph = $( location );
    var length = data.length;
    var raw_data=0;
    var data_int=0;
    var unit = "%";
    var memory_total;
    var memory_free;
    var memory_percentage;

    if( $graph.children().length == 0 ) {
        var eldest_data = length >= 200 ? length - 200 : 0;

        for ( var i = eldest_data; i < length; i++ ){

             memory_total= data[ i ].memory_total;
             memory_free = data[ i ].memory_free;

             memory_percentage = ( memory_free / memory_total ) * 100;
            raw_data = parseFloat( memory_percentage ).toFixed(2);
            data_int = parseInt(  raw_data  );
            bar_graph_top( data_int, raw_data, i, location, unit, o );
        }
    }
    else{

         memory_total= data[ length - 1 ].memory_total;
         memory_free = data[ length - 1 ].memory_free;

         memory_percentage = ( memory_free / memory_total ) * 100;
        raw_data = parseFloat( memory_percentage ).toFixed(2);
        data_int = parseInt(  raw_data  );
        bar_graph_top( data_int, raw_data, length-1, location, unit, o);

        var $span = $graph.find( "span:first-child" );
        $span.remove();
    }

}




function bar_graph_top(data, raw, num, location, unit, o){
    var id = o.id;
    var $graph = $( location );
    var color = '#356F07';
    var data_int = data;
    if ( location == ".load_"+o.id ){
//console.log( id );
        if ( data_int > 130 ) color = 'red';
        else if ( data_int > 100 ) color = '#883322';
        else if ( data_int > 90 ) color = '#6F320B';
        else if ( data_int > 80 ) color = '#6F5F13';
        else if ( data_int < 80 ) color = '#356F07';
    }else{
//console.log( o.id );
        if ( data_int < 10 ) color = 'red';
        else if ( data_int < 20 ) color = '#883322';
        else if ( data_int < 35 ) color = '#6F320B';
        else if ( data_int < 50 ) color = '#6F5F13';
        else if ( data_int > 51 ) color = '#356F07';
    }

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

    var bar = '<span  " style="' +style+ '" title="' +raw+unit+ '" id = "'+num+'">\200</span>';
    $graph.append( bar );
}

function get_server_stat( o ) {

    $.get(o.source, function (json) {

        var data = JSON.parse(json);

        get_basic_information( o , data );
        get_load_average( o, data );
        get_cpu_health( o, data );
        get_memory( o, data );
    });
    setTimeout( function(){
        get_server_stat( o );
    }, 60999 );

}