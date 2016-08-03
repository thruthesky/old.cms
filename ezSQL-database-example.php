<?php
///
/// Dependency Injection
///
class a {
    public $data = [];

    public function __construct( )
    {
        return $this;
    }


    public function set( $k, $v ) {
        $this->data[ $k ] = $v;
        return $this;
    }

    public function __set($name, $value)
    {
        $this->set( $name, $value);
    }

    public function __get( $name ) {
        return isset( $this->data[ $name ] ) ? $this->data[ $name ] : null;
    }


    public function display( ) {
        print_r( $this->data );
        return $this;
    }

    public function create() {

        // Include ezSQL core
        include_once "ezSQL-master/shared/ez_sql_core.php";

        // Include ezSQL database specific component
        include_once "ezSQL-master/mysqli/ez_sql_mysqli.php";

        // Initialise database object and establish a connection
        // at the same time - db_user / db_password / db_name / db_host
        // db_host can "host:port" notation if you need to specify a custom port
        $db = new ezSQL_mysqli('root','7777','test','localhost');

        $db->query("INSERT INTO user (name, address) VALUES ('{$this->data['name']}', '{$this->data['address']}')");

        return $this;
    }

    public static function load() {
        return new a();
    }
}

function a () {
    return new a();
}

/*
$a = (new a())
    ->set('name', 'jaeho')
    ->set('address', 'Balibago, Angeles')
    ->create();

$o = new a();
$o
    ->set('name', 'My name')
    ->set('address', 'My Address')
    ->create();
*/
// magic..

/*
$o = new a();
$o->name = 'name 1';
$o->address = 'address 2';


echo $o->hello;

*/


a()
    ->set('name', 'hello')
    ->set('address', 'world')
    ->create();

