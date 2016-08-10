/**
 * Created by ontue on 8/9/2016.
 */


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