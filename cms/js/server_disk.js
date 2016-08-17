
function convert_to_mb( data_int, unit ){
    var current_value;
    //console.log(unit);
    if (unit == 'G') {
        //console.log( 'giga' );
        current_value = parseInt(data_int) * 1000;
        return current_value;
        //console.log( current_value );
    }
    else if( unit == 'M' ){
        //  console.log( 'Mega' );
        current_value = parseInt(data_int);
        return current_value;
        //    console.log( current_value );
    }
    else if( unit == 'kb' || '' ){
        //   console.log( 'kilo' );
        current_value = parseInt(data_int) * 0.001;
        return current_value;
        // console.log( current_value );
    }
    else{
        alert( "Can only parse disk unit of giga, mega and kilobytes! Update source code!" );
    }
}





function get_total_size( data, length, data_name ){
    var raw_data = 0;
    var data_int = 0;

    //var unit = "%";
    var patt_num = /[0-9]/g;
    var patt_string = /[A-Z]/i;
    var current_value = 0;


    var previous_value;
    var data_int_old;
    var unit_old;
    var unit;

    for (var i = 0; i < length; i++) {
        switch( data_name ){
            case 'size':
                raw_data = data[i].size;

                previous_value = current_value;
                data_int_old = raw_data.match(patt_num);
                unit_old = raw_data.match(patt_string);
                data_int = data_int_old.join("");
                unit = unit_old.join("");
                //convert to megabits
                // alert(data_int);
                current_value = previous_value + convert_to_mb( data_int, unit );
                break;

            case 'available':
                raw_data = data[i].available;

                previous_value = current_value;
                data_int_old = raw_data.match(patt_num);
                unit_old = raw_data.match(patt_string);
                data_int = data_int_old.join("");
                unit = unit_old.join("");
                current_value = previous_value + convert_to_mb( data_int, unit );
                break;

            default:
                alert( "Can't handle"+data_name  );
        }
    }
    return current_value;
}
