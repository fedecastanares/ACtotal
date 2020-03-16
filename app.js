const formulario = document.getElementById('ingresoDatos');
cargarDatos();


function cargarDatos() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://192.168.1.104:3000/usuarios', true );
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
            console.log('Para poder testear la app desde mi movil cambie la ruta de ajax por la ip de mi red En mi caso la ip es ');  
            console.log('192.168.1.104:3000');
            console.log('Ademas hay que levantar json server en la ip mencionada anteriormente en mi caso el comando:');
            console.log('json-server --host 192.168.1.104  --watch db.json')
        }
    
    }
    xhr.send();
}

function agregarDatos(id, nombre, email, telefono) {
    id = parseInt(id);
    let fecha = new Date();
    let anio = fecha.getFullYear();
    let mes = fecha.getMonth();
    let dia = fecha.getDate();
    fecha = dia.toString() + '/' + mes.toString() + '/' + anio.toString();
    const xhr = new XMLHttpRequest();
    xhr.open('POST','http://192.168.1.104:3000/usuarios');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // guarda el id como String no se porque :(
    xhr.send(`id=${id}&nombre=${nombre}&email=${email}&telefono=${telefono}&fecha=${fecha}`);
    // si es exitoso Mostrar  ui.mostrarMensaje como exitoso
    // prevent reload on submit
    return xhr;
}
 


formulario.addEventListener('submit', e => {
    e.preventDefault();
    let id = document.getElementById('btnGuardar').value;
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
        let datoAgregado = agregarDatos(id,nombre, email, telefono);
        console.log(datoAgregado);
        // cambiar lo siguiente leyendo el POST
        ui.mostrarMensaje('Datos ingresados correctamente', 'exitoso');
        formulario.reset();
        setTimeout(() => {
            document.querySelector('.alert').remove();
           }, 5000);
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
       if ( tipo === 'error') {
        setTimeout(() => {
        document.querySelector('.alert').remove();
       }, 5000);}
    }

    mostrarUsuarios(usuarios, pagina) {
        if (document.getElementById('listado') ){
            
        } else {
            const divContenido = document.createElement('div');
            divContenido.setAttribute('id', 'listado'); 
            document.getElementById('listado-de-datos').insertBefore(divContenido, document.getElementById('paginacion'));
        }
        let itemFinal = pagina * 8;
        let itemComienzo = itemFinal - 8;
        let delay = 0.5;
        let animated = 'slideInUp';
        usuarios = usuarios.reverse();
         for (let i = itemComienzo ; i < itemFinal; i++) {
            if (usuarios[i]){
            const divRow = document.createElement('div');
            divRow.classList.add('row', 'text-center', 'usuario', 'animated', `${animated}`, `delay-${delay}s`);
            divRow.setAttribute('value', usuarios[i].id);
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
        const btnGuardar = document.getElementById('btnGuardar');
        if( btnGuardar.getAttribute('value').length != 1) {
            btnGuardar.removeAttribute('value');
        }
        let id = usuarios[0].id;
        id = parseInt(id);
        id = id + 1;
        btnGuardar.setAttribute('value', id);
        document.getElementById('btnGuardar').remove();
        document.getElementById('ingresoDatos').appendChild(btnGuardar);
    }

    paginacion(usuarios){
        const ui = new Interfaz();
        let paginas = usuarios.length / 8 ;
        paginas = (Math.trunc(paginas + 1));
        let paginaActual = 1;
        ui.mostrarUsuarios(usuarios, paginaActual);
        let html = ''
        html += `
        <nav aria-label="paginacion">
         <ul class="pagination justify-content-center">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true" name='paginacion'>Anterior</a>
          </li>`;
        for (let i = 1 ; i <= paginas ; i++){
            if (i === paginaActual) {
                html += `
                <li class="page-item active">
                    <a class="page-link" href="#" name='paginacion'>${i}</a>
                </li>`
            } else {
                html += `
                <li class="page-item">
                    <a class="page-link" href="#" name='paginacion'>${i}</a>
                </li>`}
        }
          html += `
          <li class="page-item">
            <a class="page-link" href="#" name='paginacion'>Siguiente</a>
          </li>
        </ul>
      </nav>` ;
      document.getElementById('paginacion').innerHTML = html;
      document.getElementById('paginacion').addEventListener('click', e => {
        e.preventDefault();
        if (e.target.classList.value === 'page-item disabled'){
            return;
        } else {
        if ( e.target.textContent === 'Siguiente'){
            paginaActual = parseInt(paginaActual) + 1;
            paginaActual = paginaActual.toString();
        } else if (e.target.textContent === 'Anterior') {
            paginaActual = parseInt(paginaActual) - 1;
            paginaActual = paginaActual.toString();
        } else {
            paginaActual = e.target.textContent;
        }
        
        ui.cambioPagina(usuarios.reverse(), paginaActual, paginas);
    }} )
    }

    cambioPagina(usuarios, paginaActual, paginas) {
        
        document.getElementById('listado').remove();
        const ui = new Interfaz(); 
        ui.mostrarUsuarios(usuarios, paginaActual);
        ui.paginaActual(paginaActual, paginas);

    }

    paginaActual(paginaActual, paginas) {
        const divPaginacion = document.getElementById('paginacion');
        document.getElementById('paginacion').remove();
        let desactivar = paginaActual;
        desactivar = parseInt(desactivar) + 1;
        for (let i = 0 ; i < divPaginacion.getElementsByClassName('page-item').length ; i++) {
            if (paginaActual !== '1' || paginaActual !== desactivar ) {
                divPaginacion.getElementsByClassName('page-item')[i].classList.remove('disabled');
            } 
            divPaginacion.getElementsByClassName('page-item')[i].classList.remove('active');
            if ( i.toString() === paginaActual ) {
                divPaginacion.getElementsByClassName('page-item')[i].classList.add('active');
            }
        }
        if (paginaActual === '1') {
            divPaginacion.getElementsByClassName('page-item')[0].classList.add('disabled')
        }
        if (paginaActual === paginas.toString()){
            divPaginacion.getElementsByClassName('page-item')[desactivar].classList.add('disabled')
        } 
        document.getElementById('listado-de-datos').appendChild(divPaginacion);
        }
}