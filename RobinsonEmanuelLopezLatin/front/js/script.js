$(document).ready(function(){

    //datos del formulario de registro

    //calculo de edad
    function valida_edad(fnacimiento){
        let fecha=new Date();
        let f_nacimiento=new Date(fnacimiento);

        let edad=fecha.getFullYear()-f_nacimiento.getFullYear();
        let mes=fecha.getMonth()-f_nacimiento.getMonth();
        if(mes<0){
            edad--;
        }
        return edad;
    }
    //*calculo de edad*/

    /*limpiar datos del form*/
    function limpiar(){
        $('input[name=name]').val('');
        $('input[name=fecha_nacimiento]').val('');
        $('input[name=edad]').val('0');
        $('input[name=telefono]').val('');
        $('input[name=correo]').val('');
    }
    /*limpiar datos del form */

    function valiida_form(){

        //valida si el nombre solo contiene a-zA-Z
        let name=$('input[name=name]').val();
        let letras=/^[a-zA-Z]+$/;
        if(!letras.test(name) || name==''){
            alert('El campo nombre solo se permite usar mayusculas o minusculas');
            return;
        }
        //valida si el nombre solo contiene a-zA-Z

        //valida si solo tiene numeros 0-9
        let numeros=/^[0-9]+$/;
        let tel=$('input[name=telefono]').val();
        if(!numeros.test(tel) || tel==''){
            alert('El campo teléfono solo puede contar con digitos del 0-9.');
            return;
        }
        //valida si solo tiene numeros 0-9

        //validar correo correcto
        let val_correo=new RegExp('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}');
        let correo_e=$('input[name=correo]').val();

        if(!val_correo.test(correo_e) || correo_e==''){
            alert('el campo correo es requerido y solo permite un correo electronico real.');
            return;
        }
        //validar correo correcto

        //valida edad
        let edad=$('input[name=edad]').val();
        if(edad<1){
            alert('La fecha de nacimiento no es valida. tienes que tener mas de 1 año de edad');
        }

        //valida edad
    }

    //cambio de fecha calcula edad
    $('input[name=fecha_nacimiento]').on('change',function(){
        let f_nacimiento=$(this).val();
        if(f_nacimiento){
            let edad=valida_edad(f_nacimiento);         
            $('input[name=edad]').val(edad);
        }
    });
    //cambio de fecha calcula edad
    
    //registramos los datos al servidor
    $('#guardar_usuario').click(function(event){
        event.preventDefault();
        valiida_form();
        let formData={
            name: $('input[name=name]').val(),
            correo:$('input[name=correo]').val(),
            fecha_nacimiento:$('input[name=fecha_nacimiento').val(),
            edad: $('input[name=edad]').val(),
            telefono:$('input[name=telefono]').val(),
            correo:$('input[name=correo]').val()
        };
        $.ajax({
            type:'POST',
            url:'http://localhost:3000/guardar_usuario',//url pendiente creacion del archivo
            data:JSON.stringify(formData),
            contentType: "application/json",
            beforeSend:function(){
                $('#guardar_usuario').val('Guardando...');
                $('#guardar_usuario').prop('disabled',true);
            },success:function(data){
                if(data.status=='ok'){
                    limpiar();
                    alert('Listo:'+data.mensaje);
                }else{
                    alert('Error:'+data.mensaje);
                }
                $('#guardar_usuario').prop('disabled',false);
                //$('#guardar_usuario').val('Guardar Usuario');
            }
        });
    });
    //registramos los datos al servidor

    //fin datos del formulario de registro
});