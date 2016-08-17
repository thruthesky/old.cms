<?php
header("Access-Control-Allow-Origin: *");
$today = date('Ymd');
$content = file_get_contents( "log/df/$today.log" );
$arr = explode("\n", $content );
$new_arr = array_chunk( $arr, 12 );
$stats = [];

foreach( $new_arr as $log ) {
    if (empty($log)) continue;
    if (empty($log[0])) continue;
    $new_log = $log;
    $s = [];

    $ms[] = preg_split('/ /' , $log[1]);

    $s['size'] = $ms[0];
    $s['used'] = $ms[2];
    $s['available'] = $ms[3];
    $s['use_percentage'] = $ms[4];
    $stats[] = $s;
}

print_r($stats);
//echo json_encode( $stats );
