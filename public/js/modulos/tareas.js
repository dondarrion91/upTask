import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector(".listado-pendientes");


if(tareas){

    tareas.addEventListener("click",e =>{
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.dataset.tarea;
            

            //request hacia tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            

            axios.patch(url, {idTarea})
                .then(respuesta => {
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement,
                  ulList = tareaHTML.parentElement,
                  idTarea = tareaHTML.dataset.tarea;
                  
            Swal.fire({
                title: "Deseas Borrar esta Tarea?",
                text: "Una Tarea eliminada no se podran recuperar!!!!!!!!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, Borralo ya!!!!!!",
                cancelButtonText: "No , Cancelar"
            }).then(result => {
                if (result.value) {
                    
                    //axios delete
                    const url = `${location.origin}/tareas/${idTarea}`;

                    axios.delete(url,{ params: {idTarea}}) // siempre que uso delete se pasa params
                        .then(respuesta => {
                            if(respuesta.status === 200){
                                

                                tareaHTML.parentElement.removeChild(tareaHTML);

                                // muestra que no hay tareas una vez que se ha quedado vacia la tabla tareas
                                if(!ulList.hasChildNodes()){
                                    ulList.innerHTML = "No hay tareas en este proyecto";
                                }
                                
                                //alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                )

                                actualizarAvance();
                            }
                        })

                }
            })
        }
    });


}

export default tareas;