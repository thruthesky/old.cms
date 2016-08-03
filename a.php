<?php
$a = function( $f ) {
    return function () use ( $f ) {
        return $f;
    };
};
$b = $a( function() { return function () { echo 'hello, world'; }; } );
$c = $b();
$d = $c();
$e = $d();
echo $e;


