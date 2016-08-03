
<?php
header("Access-Control-Allow-Origin: *");
$today = date('Ymd');
$content = file_get_contents( "log/df/$today.log" );

$arr = explode("\n", $content );
$new_arr = array_chunk( $arr, 5 );

$stats = [];
foreach( $new_arr as $log ) {
    if ( empty( $log ) ) continue;
    if ( empty( $log[0] ) ) continue;
    $s = [];
    preg_match( "/([0-9]{2}:[0-9]{2}:[0-9]{2}) up ([0-9]{2,}) days.*([0-9]{1,}) user.* average: ([0-9]+\.[0-9]+)/", $log[0], $ms );
    $s['system_time'] = $ms[1];
    $s['up_days'] = $ms[2];
    $s['no_of_user'] = $ms[3];
    $s['load_average'] = $ms[4];

    preg_match( "/Tasks: ([0-9]+) total, .* ([0-9])+ zombie/", $log[1], $ms );
    $s['tasks'] = $ms[1];
    $s['zombie'] = $ms[2];

    preg_match( "/.*ni, ([0-9]+\.[0-9]+) id,/", $log[2], $ms );
    $s['cpu_idle'] = $ms[1];

    preg_match( "/([0-9]+) total, +([0-9]+) free/", $log[3], $ms );
    $s['memory_total'] = $ms[1];
    $s['memory_free'] = $ms[2];


    preg_match( "/([0-9]+) total, +([0-9]+) free/", $log[4], $ms );
    $s['swap_total'] = $ms[1];
    $s['swap_free'] = $ms[2];

    $stats[] = $s;

}

echo json_encode( $stats );




