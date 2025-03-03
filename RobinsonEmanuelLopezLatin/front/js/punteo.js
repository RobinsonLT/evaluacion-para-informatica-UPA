$(document).ready(function(){

    function validador_form(){

        let val_correo=new RegExp('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}');
        let correo_e=$('input[name=correo]').val();

        if(!val_correo.test(correo_e) || correo_e==''){
            return 'error: El campo correo es requerido y debe existir';
        }
        let punteo=$('input[name=punteo]').val();
        if(Number.isNaN(punteo) || punteo<1 || punteo>100){
            return 'error: El campo punteo es requerido y unicamente acepta numeros enteros del 1-100'
        }
        return 'ok';
    }

    function limpiar(){
        $('input[name=correo]').val('');
        $('input[name=punteo]').val('');
    }

    //codigo guardar punteo
    $('#guardar_punteo').click(function(event){
        event.preventDefault();
        let validador=validador_form();
        if(validador=='ok'){
            let correo=$('input[name=correo]').val();
            let punteo=$('input[name=punteo]').val();

            let formData={                
                correo:$('input[name=correo]').val(),
                punteo: $('input[name=punteo]').val()
            };

            console.log(JSON.stringify(formData));
            $.ajax({
                url:'http://localhost:3000/guardar_punteo',
                type:'post',
                data:JSON.stringify(formData),
                contentType: "application/json",
                beforeSend:function(){
                    toastr.warning('Procesando ....');
                    $('#guardar_punteo').html('Guardando...');
                    $('#guardar_punteo').prop('disabled',true);
                },
                success:function(data){
                    console.log(data);
                    if(data.status=='ok'){
                        toastr.success(data.datos);
                        limpiar();
                    }else{
                        toastr.error(data.datos);
                    }
                    $('#guardar_punteo').prop('disabled', false);
                    $('#guardar_punteo').html('Guardar Punteo');
                }
            });
        }else{
            toastr.error(validador);
        }
    }); 
    //codigo guardar punteo

});