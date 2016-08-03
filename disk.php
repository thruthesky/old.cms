<?php
header("Access-Control-Allow-Origin: *");
$today = date('Ymd');
$content = file_get_contents( "log/df/$today.log" );
$arr = explode("\n", $content );
$stats = [];

$arr_count = count($arr);
$arr_len = $arr_count - 2;

for( $i = 1; $i <= $arr_len; $i++ ) {
    $s = [];
    $ms = preg_split('/\s+/' , $arr[$i]);
    $s['file_system'] = $ms[0];
    $s['size'] = $ms[1];
    $s['used'] = $ms[2];
    $s['available'] = $ms[3];
    $s['use_percentage'] = $ms[4];
    $s['mounted_on'] = $ms[5];
    $stats[] = $s;
}
echo json_encode( $stats );
//print_r($stats);si