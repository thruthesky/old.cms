var siren_count = {};
var siren_count_for_play = {};

/**
 *
 * @param id
 * @param title
 * @param ip
 * @param count - is the count number for playing siren. If this value given, it will play only when the ping drops happens in straight more than this number.
 *      숫자가 주어지면, 해당 숫자 만큼 ping 이 연속으로 drop 되어야 싸이렌이 울린다.
 */
function add_ping_monitor(o) {

    var defaults = {
        id: 'no-id',
        title: 'No title',
        ip: '0.0.0.0',
        count: 0,
        sound: 'siren'
    };

    o = $.extend( defaults, o );


    if ( typeof count == 'undefined' ) count = 0;
    siren_count[o.id] = count; // @fix needs to be inside 'o'.
    siren_count_for_play[o.id] = 0;


    var m = '<div id="monitor-'+o.id+'" class="internet-monitor">' +
        '<h1>'+o.title+'(<span title="ping drop count / no. of drops for siren" class="ping-drop-count">0</span>/<span class="ping-drop-siren-no">'+o.count+'</span>)</h1>' +
        'Mute<input type="checkbox" class="mute">' +
        '<select class="sound" style="width: 60px;">' +
        '   <option value="siren">siren</option>' +
        '   <option value="birds_phalcon">birds_phalcon</option>' +
        '</select>' +
        '' +
        '<input type="text" title="Update count no. for ping drop siren." name="ping-drop-siren-no" size="2" value="'+o.count+'">' +
        '' +
        '' +
        '' +

        '    <div class="display">' +
        '       <div class="graph">' +
        '       </div>' +
        '   </div>' +
        '       <div class="last-ping-time"></div>' +
        '</div>' +
        '';


    var $m = $( m );

    $m.find('.sound').val( o.sound );

    $('body').append( $m );
    loop_ping_graph( o );
}

/*
add_ping_monitor( {
        id: 'kiss',
        title: 'KISS Internet',
        ip: '168.126.63.1'
} );

add_ping_monitor( { id: 'convergy', title: 'Convergy Internet', ip: '111.125.97.38', sound: 'birds_phalcon', count: 3 } );
add_ping_monitor( { id: 'philgo6', title: 'w6.philgo.com site', ip: 'w6.philgo.com', count: 2 } );
add_ping_monitor( { id: 'philgo7', title: 'w7.philgo.com site', ip: 'w7.philgo.com', count: 2 } );
add_ping_monitor( { id: 'philgo8', title: 'w8.philgo.com site', ip: 'w8.philgo.com', count: 2 } );
*/
function loop_ping_graph( o) {
    var exec = require('child_process').exec, child;
    child = exec('ping -n 1 ' + o.ip, function(error, stdout, stderr){

        var $monitor = get_monitor(o.id);
        if(error !== null) {
            add_bar(o, 999);
            ///$('body').append("<div>ERROR: "+error.message+"</div>");

            siren_count_for_play[o.id] ++;

            console.log("if ( "+siren_count_for_play[o.id]+" >= " + siren_count[o.id] + " )");
            if ( siren_count_for_play[o.id] >= siren_count[o.id] ) {
                if ( $monitor.find('.mute').prop('checked') ) {

                }
                else play_mp3(o);
            }
        }
        else {
            siren_count_for_play[o.id] = 0;
            var patttern = /time=([0-9]+)ms/;
            var re = patttern.exec( stdout );
            var ms = re[1];
            add_bar(o, ms);
        }
        $monitor.find('.ping-drop-count').text( siren_count_for_play[o.id] );

        // update ping drop siren count no.
        var count = $monitor.find('[name="ping-drop-siren-no"]').val();
        $monitor.find('.ping-drop-siren-no').text( count );
        siren_count[o.id] = count;
    });
    setTimeout(function() {
        loop_ping_graph( o );
    }, 1000);
}

function get_monitor( id ) {
    return $('#monitor-'+id);
}


function add_bar( o, ms ) {


    var color = '#356F07';
    if ( ms > 500 ) color = 'red';
    else if ( ms > 200 ) color = '#883322';
    else if ( ms > 150 ) color = '#6F320B';
    else if ( ms > 100 ) color = '#6F5F13';
    else if ( ms > 80 ) color = '#356F07';

    var height = Math.floor( ms / 5 );

    var p = Math.floor( 50 * height / 100 );
    //console.log(p);

    var top = 50 - p;
    if ( top < 0 ) top = 0;
    //console.log(top);

    //console.log(top);

    var $monitor = get_monitor(o.id);
    var $g = $monitor.find('.graph');
    var $d = $monitor.find(".display");
    $g.append("<span style='top:"+top+"px; width:1px; background-color:"+color+";' title='"+ms+"ms'></span>");
    var width_display = $d.width();
    var s = $g.width() - width_display;

    //console.log("display width: " + $d.width() );
    //console.log("g width: " + $g.width() );

    //console.log('s:' + s);

    if ( s >= -20 ) {
        $g.find('span').eq(0).remove();
    }
    //var n = Date.now();
    //var Y = Date.Year
    var d = new Date();
    var s = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

    $monitor.find('.last-ping-time').text( 'Last ping time: ' + s );
}


function isNodeWebkit() {
    return !!(typeof process !== "undefined" && process.versions['node-webkit']);
}

function play_mp3(o) {


    var $monitor = get_monitor( o.id );
    var sound = $monitor.find('.sound').val();
    var m;
    if ( isNodeWebkit() ) {
        m = '<audio src="mp3/'+sound+'.ogg" autoplay>Your browser does not support the <code>audio</code> element.</audio>';
    }
    else {
        m = '<audio src="mp3/'+sound+'.mp3" autoplay>Your browser does not support the <code>audio</code> element.</audio>';
    }

    $('body').append(m);


}