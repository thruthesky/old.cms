
function add_top_monitor( o ) {


    var defaults = {
        id: 'no-id',
        title: 'No title',
        source: 'no-source',
        sound: 'siren'
    };


    o = $.extend( defaults, o );

    var containers = '<div class=" container_server_stats ' +o.id+ '">' +
        '<div class=" server_name name_' +o.id+ '" ></div>' +
        '<hr style=" margin:0; padding:0;">' +
        '<div class=" system_time time_' +o.id+ '"></div>' +
        //    '<div class=" up_day ' +o.id+ '"></div>' +
        '<div class=" swap_total swap_used_'+o.id+ '"></div>' +
        '<div class=" graph_container graph_' +o.id+ '">' +

            
        '<div class="label label-load ' +o.id+ '"><span><h5>Load Average:</h5></span>' +
        '<span><select class="sound" style="width: 60px;">' +
        '   <option value="siren">siren</option>' +
        '   <option value="birds_phalcon">birds_phalcon</option>' +
        '</select>' +
        '<input type="text" title="Update count no. for ping drop siren." name="ping-drop-siren-no" size="2" value="'+o.count+'"></span>' +
        '</div>'+
        '<div class=" graph_load_average load_'+o.id+ '"> </div>' +

            
        '<div class="label label-cpu ' +o.id+ '"><span><h5>CPU Health:&nbsp&nbsp</span></h5></span>' +
        '<span><select class="sound" style="width: 60px;">' +
        '   <option value="siren">siren</option>' +
        '   <option value="birds_phalcon">birds_phalcon</option>' +
        '</select>' +
        '<input type="text" title="Update count no. for ping drop siren." name="ping-drop-siren-no" size="2" value="'+o.count+'"></span>' +
        '</div>'+
        '<div class=" graph_cpu cpu_' +o.id+ '"></div>' +
            
            
        '<div class="label label-memory ' +o.id+ '"><span><h5>Memory Health:</h5></span>' +
        '<span><select class="sound" style="width: 60px;">' +
        '   <option value="siren">siren</option>' +
        '   <option value="birds_phalcon">birds_phalcon</option>' +
        '</select>' +
        '<input type="text" title="Update count no. for ping drop siren." name="ping-drop-siren-no" size="2" value="'+o.count+'"></span>' +
        '</div>'+

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
  //  var up_days = data[ latest ].up_days;
    //var user = data[ latest ].no_of_user;
    var task = data[ latest ].tasks;
    var swap_free = data[ latest ].swap_free;
    var swap_total = data[ latest ].swap_total;
    //var zombie = data[ latest ].zombie;

    var new_swap_free = convert_to_mb( swap_free, 'kb' );
    var new_swap_total = convert_to_mb( swap_total, 'kb' );


    var label_style ="<h4>"+ o.title +"</h4>";
    var time_style = "<div class='title'><span>System Time:&nbsp&nbsp</span><span><h5>"+ time +"</h5></span></div>";
  //  var up_style = "<div class='title'>Up Days:</div><h5> "+ up_days +" days</h5>";
    var task_style = "<div class='title'><span>Tasks:&nbsp&nbsp</span><span><h5>"+ task +"</h5></span></div>";
    var swap_total_style ="<div class='title'><span>Swap total:&nbsp&nbsp</span><span><h5>"+ new_swap_total +"MB</h5></span></div>";
    var swap_free_style ="<div class='title'><span>Swap free:&nbsp&nbsp</span><span><h5>"+ new_swap_free +"MB</h5></span></div>";


    $(".task_"+o.id ).html(task_style);
    $(".name_"+o.id ).html(label_style);
    $(".time_"+o.id ).html(time_style);
  //  $(".up_day").html(up_style);
    $(".swaptotal_"+o.id ).html(swap_total_style);
    $(".swapfree_"+o.id ).html(swap_free_style);

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

    var height = Math.round( data  / 4);
    var top = Math.round(25 - ( height));


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

    var bar = '<span  style="' +style+ '" title="' +raw+unit+ '" id = "'+num+'">\200</span>';
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

$('body').on('click', '.container_server_stats', function () {
   console.log("high");
});