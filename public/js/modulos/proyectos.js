import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');



if (btnEliminar) {
  btnEliminar.addEventListener("click", e => {
    const urlProyecto = e.target.dataset.proyectoUrl;

    // console.log(urlProyecto);

    // return;

    Swal.fire({
      title: "Deseas Borrar este Proyecto?",
      text: "Los cambios echos no se podran recuperar!!!!!!!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Borralo ya!!!!!!",
      cancelButtonText: "No , Cancelar"
    }).then(result => {
      if (result.value) {
        // peticion a axios
        const url = `${location.origin}/proyectos/${urlProyecto}`;
        
        axios.delete(url, { params: { urlProyecto } }).then(respuesta => {

          console.log(respuesta);  
          Swal.fire("Eliminado!", respuesta.data, "success");

          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        })
        .catch(() =>{
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'No se pudo eliminar el proyecto'
            })
        })

        
      }
    });
  });
}

export default btnEliminar;


