const formulario = document.getElementById('ingresoDatos');
cargarDatos();


function cargarDatos() {
    const xhr = new XMLHttpRequest();
    // Url de prueba para localhost en puerto 3000
    xhr.open('GET', 'http://127.0.0.1:3000/usuarios', true );
    xhr.onload = function(){
        if(this.readyState == 4 && this.status === 200 ) {
            const usuarios = JSON.parse(this.responseText);
            const ui = new Interfaz();
            if (usuarios.length >= 8) {
                ui.paginacion(usuarios);
            } else {
                ui.mostrarUsuarios(usuarios);
            }
        } else {
            console.log('Error al leer la base de datos');  
        }
    
    }
    xhr.send();
}


formulario.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    const ui = new Interfaz();

    if(nombre === '' || email === '' || telefono === '' ){
        ui.mostrarMensaje('Debe completar todos los campos', 'error');
    } else if ( email.search('@') === -1 ){
        ui.mostrarMensaje('Email incorrecto','error');
    } else if ( telefono.length !== 9 ) {
        ui.mostrarMensaje('Debe ingresar un telefono celular correcto','error');
    }
    else {
        ui.mostrarMensaje('Datos ingresados correctamente', 'exitoso');
        // Todavia no funciona agregarDatos(nombre, email, telefono);
        document.getElementById('listado').remove();
        cargarDatos();
        formulario.reset();
    }
})


class Interfaz {
    mostrarMensaje(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
       } else {
            divMensaje.classList.add('alert-success');
       }
       divMensaje.appendChild(document.createTextNode(mensaje));
       document.getElementsByClassName('mensaje')[0].appendChild(divMensaje);
       setTimeout(() => {
        document.querySelector('.alert').remove();
       }, 5000);
    }

    mostrarUsuarios(usuarios) {
        if (document.getElementById('listado') ){
            
        } else {
            const divContenido = document.createElement('div');
            divContenido.setAttribute('id', 'listado'); 
            document.getElementById('listado-de-datos').appendChild(divContenido);
        }
        for (let i = 0 ; i < 8; i++) {
            const divRow = document.createElement('div');
            divRow.classList.add('row', 'text-center', 'usuario');
            const divCol1 = document.createElement('div');
            divCol1.classList.add('col');
            const divCol2 = document.createElement('div');
            divCol2.classList.add('col');
            divCol1.innerHTML = `<p><span>Nombre:</span> ${usuarios[i].nombre}</p><p><span>Telefono:</span> ${usuarios[i].telefono}</p>`
            divCol2.innerHTML = `<p><span>Email:</span> ${usuarios[i].email}</p><p><span>Ingresado:</span> ${usuarios[i].fecha}</p>`
            divRow.appendChild(divCol1);
            divRow.appendChild(divCol2);
            document.getElementById('listado').appendChild(divRow);
        }
    }

    paginacion(usuarios){
        const ui = new Interfaz();
        let paginas = usuarios.length / 8 ;
        paginas = (Math.trunc(paginas + 1));
        ui.mostrarUsuarios(usuarios);
        // usar cantidad de paginas para definir los li
        document.getElementById('paginacion').innerHTML = `
        <nav aria-label="paginacion">
         <ul class="pagination justify-content-center">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true" name='paginacion''>Anterior</a>
          </li>
          <li class="page-item active"><a class="page-link" href="#" name='paginacion'>1</a></li>
          <li class="page-item" aria-current="page">
            <a class="page-link" href="#" name='paginacion' >2</a>
          </li>
          <li class="page-item"><a class="page-link" href="#" name='paginacion'>3</a></li>
          <li class="page-item">
            <a class="page-link" href="#" name='paginacion'>Siguiente</a>
          </li>
        </ul>
      </nav>`
      document.getElementById('paginacion').addEventListener('click', e => {
        e.preventDefault();
        ui.cambioPagina(e.target.textContent);
    } )
    }

    cambioPagina(pagina) {
        console.log(pagina);
        document.getElementById('listado').remove();
        const divContenido = document.createElement('div');
        divContenido.setAttribute('id', 'listado'); 
        // Insertar antes del nav
        document.getElementById('listado-de-datos').appendChild(divContenido);
        document.getElementById('listado').innerHTML = `Desde Paginacion`;
        // Recorrer pagina seleccionada como el for de mostrarUsuarios pero empezando con otro indice
        // Cambiar atributos del nav
    }
}

 /*  
function agregarDatos(nombre, email, telefono) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST','http://127.0.0.1:3000/usuarios', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(`nombre=${nombre}&email=${email}&telefono=${telefono}&fecha=12/03/2020`);
}
 */