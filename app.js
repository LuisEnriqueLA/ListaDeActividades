const boton = document.getElementById("guardar"); 
boton.addEventListener("click", crear);
const numeroDeTareas = document.getElementById("numero"); 
var contador = 0;

const lista = document.getElementById("lista");

document.getElementById("make").addEventListener("keypress", function(e) {
    if (e.key === "Enter") crear();
});

function crear() {
   const actividad = document.getElementById("make").value.trim();

   if (actividad === "") {
      alert("No has escrito nada");
      return;
   }

   const tarea = crearElementoTarea(actividad);
   lista.appendChild(tarea);

   contador++;
   numeroDeTareas.innerText = contador;

   document.getElementById("make").value = "";
   guardar();
}


function crearElementoTarea(texto, tachado= false) {
   const li = document.createElement("li");
   const boton = document.createElement("button");

   li.textContent = texto;
   if(tachado) li.classList.add("tachado");

   boton.innerText = "❌";
   boton.className = "borrar";

   li.appendChild(boton);
   agregarEventosTarea(li, boton);

   return li;
}

function editarTarea(li){
   const textoActual = li.firstChild.textContent.trim();
   const botonBorrar = li.querySelector("button");

   const input = document.createElement("input");
   input.type = "text";
   input.value = textoActual;

   li.innerHTML = "";
   li.appendChild (input);
   li.appendChild(botonBorrar);

   input.focus();
   input.select();

   input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") guardarCambios();
   });

   input.addEventListener("blur", guardarCambios);

   function guardarCambios() {
      const nuevoTexto = input.value.trim();
      if (nuevoTexto === "") {
         alert("El texto no puede estar vacío.");
         input.focus();
         return;
      }

      li.innerHTML = nuevoTexto;
      li.appendChild(botonBorrar);
      agregarEventosTarea(li, botonBorrar);
      guardar();
   }
}

 function agregarEventosTarea(li, boton){
   li.addEventListener("click", () => {
      li.classList.toggle("tachado");
      guardar();
   });

   li.addEventListener("dblclick", () => editarTarea(li));

   boton.addEventListener("click", function (e) {
      e.stopPropagation();
      li.remove();
      contador--;
      numeroDeTareas.innerText = contador;
      guardar();
   });
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

   tareasGuardadas.forEach(t => {
         const tarea = crearElementoTarea(t.texto, t.tachado);
         lista.appendChild(tarea);
         contador++;
   });

   numeroDeTareas.innerText = contador;
}
cargar();