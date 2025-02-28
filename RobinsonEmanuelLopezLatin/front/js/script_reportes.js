$(document).ready(function(){
    //codigo de reportes

    //seleccion del reporte
    $('input[type=radio][name=btnradio]').change(function(){
        let codigo=$('input[name=btnradio]:checked').data('codigo');
        let ruta='http://localhost:3000/ejecutar_reporte/'+codigo;

        $.ajax({
            url:ruta,
            type:"POST",
            dataType:"json",
            beforeSend:function(){

            },success: function(data){
                console.log(data);
                let tabla=$('table');
                tabla.empty();

                if(data.status=='error'){
                    return tabla.append(`<tr><td colspan="8">No hay resultados</td></tr>`);
                }
                if(data.datos.length>0){
                    let head=`
                        <thead>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>F. Nacimiento</th>
                            <th>F. Creacion</th>
                            <th>Estado</th>
                        <thead>
                    `;
                    tabla.append(head);
                    data.datos.forEach((datos) => {
                        let fila=`
                        
                            <tr>
                                <td>${datos.id}</td>
                                <td>${datos.nombre}</td>
                                <td>${datos.telefono}</td>
                                <td>${datos.correo}</td>
                                <td>${datos.fecha_format}</td>
                                <td>${datos.creacion_format}</td>
                                <td>${datos.titulo}</td>
                            <tr>
                        
                        `;
                        tabla.append(fila);
                    });
                }else{
                    tabla.append(`<tr><td colspan="8">No hay resultados</td></tr>`);
                }
            }
        });
    });

    $('input[type=radio][name=btnradio]').trigger('change');


    //codigo de reportes
});