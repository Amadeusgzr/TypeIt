const divIcono = document.querySelector(".div-icono-ad");
const divInfo = document.querySelector(".div-icono-info");

const elementos = Array.from(document.body.children);

const btnQR = document.querySelector("#btn-qr");
const btnInfo = document.querySelector("#btn-info");
const btnVolver = document.querySelector("#btn-volver");

let divAbierto = null;

const aplicarBlur = () => {
  elementos.forEach((elemento) => {
    elemento.style.filter = elemento === divAbierto ? "none" : "blur(5px)";
  });
};

const abrirDivIcono = () => {
  btnInfo.removeEventListener("click", abrirDivInfo);

  divAbierto = divIcono;
  aplicarBlur();
  divIcono.style.visibility = "visible";
  setTimeout(() => {
    document.body.addEventListener("click", cerrarDivIcono);
  }, 1);
};

const cerrarDivIcono = (e) => {
  if (!divIcono.contains(e.target)) {
    divIcono.style.visibility = "hidden";
    elementos.forEach((elemento) => {
      elemento.style.filter = "none";
    });
    document.body.removeEventListener("click", cerrarDivIcono);
    divAbierto = null;
  }
  btnInfo.addEventListener("click", abrirDivInfo);
};

const abrirDivInfo = () => {
  btnQR.removeEventListener("click", abrirDivIcono);
  if (divAbierto === divInfo) return;

  if (divAbierto) {
    divAbierto.style.visibility = "hidden";
    divAbierto = null;
  }

  divAbierto = divInfo;
  aplicarBlur();
  divInfo.style.visibility = "visible";
  btnVolver.addEventListener("click", cerrarDivInfo);
  btnVolver.style.display = "block"; // Mostrar el botón Volver
};

const cerrarDivInfo = (e) => {
  e.preventDefault();
  e.stopPropagation();
  divInfo.style.visibility = "hidden";
  elementos.forEach((elemento) => {
    elemento.style.filter = "none";
  });
  btnVolver.removeEventListener("click", cerrarDivInfo);
  divAbierto = null;
  btnVolver.style.display = "none"; // Ocultar el botón Volver

  setTimeout(() => {
    btnQR.addEventListener("click", abrirDivIcono);
  }, 1);
};

btnQR.addEventListener("click", abrirDivIcono);
btnInfo.addEventListener("click", abrirDivInfo);


let inputs = document.querySelectorAll("input");

const divAlerta = document.getElementById("div-alerta");
const txtAlerta = document.querySelector("#h3-resultado");

const divReinicio = document.getElementById("div-reinicio");
const btnReinicio = divAlerta.firstElementChild;

const filas = document.querySelectorAll('.div-palabra');
let contadorFila = 1;
let inputsFila = [];

const palabras = ["dardo", "dedos", "balde", "joven", "viejo", "nuevo", "huevo", "hielo", "hueso", "plato", "peste", "fuego", "juego", "mundo", "ancho", "corto", "largo", "ganar", "fideo", "miedo", "falta", "salto", "baila", "cargo", "marca", "magia", "carro", "avion", "radio", "flota", "esqui", "salon", "milla", "bajar", "comer", "balon", "jabon","grafo"]
//console.log(palabras.includes(""));
let random = null;
let palabra = null;
window.addEventListener('load', function(event) {
    random = Math.random()*palabras.length;
    random = Math.floor(random);
    palabra = palabras[random];
    //console.log(palabra);
});

// limita el ingreso de datos a una sola fila
inputs.forEach(input => {
  if (input.parentElement.id === `fila${contadorFila}`) {
    inputsFila.push(input);
  } else {
    input.readOnly = true;
  }
});

function cambiarInputs() {
  inputsFila = [];
  inputs = Array.from(document.getElementById(`fila${contadorFila}`).children);
  inputs.forEach((input, i) => {
    inputsFila.push(input);
    inputsFila[0].focus();
    input.readOnly = false;
  });

  inputs.forEach(input => {
    if (input.parentElement.id === `fila${contadorFila}`) {
      inputsFila.push(input);
    } else {
      input.readOnly = true;
    }
  });
}

const regex = /^[a-zA-Z]+$/;

inputs.forEach((input, i) => {
  input.addEventListener("input", (e) => {
    const inputValue = input.value;
    if (!regex.test(inputValue)) {
      input.value = inputValue.replace(/[^a-zA-Z]/g, "");
    }
    if (e.data !== null && input.nextElementSibling != null && input.value != "") {
      input.nextElementSibling.focus();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      if (input.value === "") {
        if (i > 0) {
          const inputAnterior = input.previousElementSibling;
          inputAnterior.focus();
          inputAnterior.value = "";
        }
      } else {
        input.value = "";
      }
    }

    if (e.key === "Enter") {
      e.preventDefault(); // Evita el comportamiento predeterminado del Enter (enviar formulario, saltar a la siguiente línea)

      const fila = input.parentElement;
      const hermanos = Array.from(fila.children);
      const letras = hermanos.map((elemento) => elemento.value);

      letras.forEach(letra => {
        if (letra === "") {
          divAlerta.style.visibility = "visible";
          divAlerta.classList.add("animacion-alerta");
          divAlerta.classList.add("alerta-roja");
          txtAlerta.textContent = "La palabra no está completa";

          setTimeout(() => {
            divAlerta.style.visibility = "hidden";
            divAlerta.classList.remove("animacion-alerta");
          }, 1500);
        }
      });

      if (letras[0] !== "" && letras[1] !== "" && letras[2] !== "" && letras[3] !== "" && letras[4] !== "") {
        contadorFila += 1;
        const palabraIngresada = letras.join("");

        if (palabraIngresada === palabra) {
          letras.forEach((letra, i) => {
            inputsFila[i].style.backgroundColor = "var(--letra-verde)";
          });

          divAlerta.style.visibility = "visible";
          divAlerta.classList.add("animacion-alerta");
          divAlerta.classList.add("alerta-verde");
          txtAlerta.textContent = "¡Acertaste!";
          document.querySelector("#h2-resultado").style.color = "var(--alerta-verde)";
          document.querySelector("#h2-resultado").textContent = "!Bien hecho!";

          setTimeout(() => {
            txtAlerta.style.animationName = "desvanecido";
            txtAlerta.style.animationDuration = "1s";
            txtAlerta.style.animationFillMode = "forwards";
            setTimeout(() => {
              btnReinicio.style.visibility = "visible";
            }, 1200);
          }, 1000);

          btnReinicio.addEventListener("click", () => {
            divAlerta.style.visibility = "hidden";
            divAlerta.classList.remove("animacion-alerta");
            location.reload();
          });
        } else {
          
          const repetidas = [];
          const letrasVerdes = [];
          
          for (let i = 0; i < palabra.length; i++) {
            if (letras[i] === palabra[i]) {
              inputsFila[i].style.backgroundColor = "var(--letra-verde)";
              letrasVerdes.push(letras[i]);
            } else if (palabra.includes(letras[i]) && !letrasVerdes.includes(letras[i])) {
              const ocurrenciasEnPalabra = contarOcurrencias(palabra, letras[i]);
              const ocurrenciasEnLetrasVerdes = contarOcurrencias(letrasVerdes, letras[i]);
              const ocurrenciasEnLetrasRestantes = contarOcurrencias(letras.slice(i + 1), letras[i]);
              
              if (ocurrenciasEnPalabra > ocurrenciasEnLetrasVerdes + ocurrenciasEnLetrasRestantes) {
                inputsFila[i].style.backgroundColor = "var(--letra-amarilla)";
              } else {
                inputsFila[i].style.backgroundColor = "var(--letra-gris)";
              }
              repetidas.push(letras[i]);
            } else {
              inputsFila[i].style.backgroundColor = "var(--letra-gris)";
            }
          }
          
          function contarOcurrencias(cadena, letra) {
            let contador = 0;
            for (let i = 0; i < cadena.length; i++) {
              if (cadena[i] === letra) {
                contador++;
              }
            }
            return contador;
          }

          

          if(input.classList.contains("input-f6")){
            divAlerta.style.visibility = "visible";
            divAlerta.classList.add("animacion-alerta");
            divAlerta.classList.add("alerta-roja");
            txtAlerta.textContent = "Perdiste :(";
            document.querySelector("#h2-resultado").style.color = "var(--alerta-roja)";
            palabra = palabra.toUpperCase();
            document.querySelector("#h2-resultado").textContent = `La palabra era: ${palabra}`;

            setTimeout(() => {
              txtAlerta.style.animationName = "desvanecido";
              txtAlerta.style.animationDuration = "1s";
              txtAlerta.style.animationFillMode = "forwards";
              setTimeout(() => {
                btnReinicio.style.visibility = "visible";
              }, 1200);
            }, 1000);

            btnReinicio.addEventListener("click", () => {
              divAlerta.style.visibility = "hidden";
              divAlerta.classList.remove("animacion-alerta");
              location.reload();
            }); 
          }

          cambiarInputs();
        }
      }
    }
  });
});