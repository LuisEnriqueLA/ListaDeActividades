const boton = document.getElementById("guardar"); 
boton.addEventListener("click", crear);

const lista = document.getElementById("lista");

document.getElementById("make").addEventListener("keypress", function(e) {
    if (e.key === "Enter") crear();
});

function crear() {
   const actividad = document.getElementById("make").value;

   if (actividad.trim() === ""){
         alert("No has escrito nada");
         return;
   }

   const nuevo = document.createElement("li");
   const borrar = document.createElement("button");

   borrar.innerText = "❌";
   borrar.className = "borrar";

   nuevo.textContent = actividad;
   nuevo.appendChild(borrar);

   nuevo.addEventListener("click", function() {
       nuevo.classList.toggle("tachado");
       guardar();
   });

   nuevo.addEventListener("dblclick", function editarTarea() {
      const li = this;
      const textoActual = li.firstChild.textContent.trim();
      const botonBorrar = li.querySelector("button");

      const editar = document.createElement("input");
      editar.type = "text";
      editar.value = textoActual;

      li.innerHTML = "";
      li.appendChild(editar);
      li.appendChild(botonBorrar);

      editar.focus();
      editar.select();

      editar.addEventListener("keypress", function(e) {
         if (e.key === "Enter") {
            guardarCambios();
         }
      });

      editar.addEventListener("blur", guardarCambios);

      function guardarCambios() {
         const nuevoTexto = editar.value.trim();
         if (nuevoTexto === "") {
            alert("El texto no puede estar vacío.");
            editar.focus();
            return;
         }

         li.innerHTML = nuevoTexto;
         li.appendChild(botonBorrar);

         li.addEventListener("click", function() {
            li.classList.toggle("tachado");
            guardar();
         });

         li.addEventListener("dblclick", editarTarea);

         guardar();
      }
   });

   borrar.addEventListener("click", function(e) {
      e.stopPropagation();
      nuevo.remove();
      guardar();
   });

   lista.appendChild(nuevo);
   document.getElementById("make").value = "";
   guardar();
}

function guardar(){
   const tareas = [];

   document.querySelectorAll("#lista li").forEach(li => {
      tareas.push({
         texto: li.childNodes[0].nodeValue.trim(),
         tachado: li.classList.contains("tachado")
      });
   });

   localStorage.setItem("tareas", JSON.stringify(tareas));
}

function cargar() {
   const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

   tareasGuardadas.forEach(tarea => {
      const nuevo = document.createElement("li");
      const borrar = document.createElement("button");

      borrar.innerText = "❌";
      borrar.className = "borrar";

      nuevo.textContent = tarea.texto;

      if (tarea.tachado) {
         nuevo.classList.add("tachado");
      }

      nuevo.addEventListener("click", function() {
         nuevo.classList.toggle("tachado");
         guardar();
      });

      nuevo.addEventListener("dblclick", function editarTarea() {
         const li = this;
         const textoActual = li.firstChild.textContent.trim();
         const botonBorrar = li.querySelector("button");

         const editar = document.createElement("input");
         editar.type = "text";
         editar.value = textoActual;

         li.innerHTML = "";
         li.appendChild(editar);
         li.appendChild(botonBorrar);

         editar.focus();
         editar.select();

         editar.addEventListener("keypress", function(e) {
               guardarCambios();
         });

         editar.addEventListener("blur", guardarCambios);

         function guardarCambios() {
         const nuevoTexto = editar.value.trim();
         li.innerHTML = nuevoTexto;
         li.appendChild(botonBorrar);

         li.addEventListener("click", function() {
            li.classList.toggle("tachado");
            guardar();
         });

         li.addEventListener("dblclick", editarTarea);

         guardar();
      }
   });

   borrar.addEventListener("click", function(e) {
         e.stopPropagation();
         nuevo.remove();
         guardar();
      });

      nuevo.appendChild(borrar);
      lista.appendChild(nuevo);
   });
}

cargar();