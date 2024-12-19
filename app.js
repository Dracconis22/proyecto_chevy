const api_url = "https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata";
const api_url_random ="https://www.themealdb.com/api/json/v1/1/random.php";
const refresh = document.getElementById("refresh");
//const gallery = document.getElementById("gallery");
const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password_2 = document.getElementById("password_2");
const inputs = form.querySelectorAll("input"); // Selecciona todos los inputs dentro del formulario
const form_section = document.getElementById("form_section");
const form_container = form_section.querySelector(".form_container")
const title = document.querySelector(".title")
const img = title.querySelector("img");

async function fetch_recipe() {
  const response = await fetch(api_url_random);
  if (!response.ok) {
      throw new Error('Error al obtener la receta');
  }
  const data = await response.json();
  return data.meals[0]; // Primer elemento del arreglo "meals"
}

async function fetch_meal() {
  try {
    const response = await fetch(api_url);
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    const data = await response.json();
    console.log(data);
    display_meal(data.meals[0]); // Mostramos la primera receta encontrada
  } catch (error) {
    console.error("Error:", error);
  }
}

// Mostrar recetas random
async function update_recipes() {
  try {
      // Obtener recetas
      const [recipe1, recipe2] = await Promise.all([fetch_recipe(), fetch_recipe()]);
      
      while (recipe1.idMeal === recipe2.idMeal) {
          recipe2 = await fetch_recipe();
      }

      // Actualizar el contenido
      meal_section("second_meal", recipe1);
      recipes_gallery("second_recipe","second_meal", recipe1);
      meal_section("third_meal", recipe2);
      recipes_gallery("third_recipe", "third_meal", recipe2);
  } catch (error) {
      console.error('Error al actualizar recetas:', error);
  }
}

function recipes_gallery(selector, id, meal) {
  const element = document.getElementById(selector);
  element.innerHTML = `
          <a href="#${id}">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          </a>
          <div class="description">
            <a href="#${id}">
              <h3>${meal.strMeal}</h3>
              <small>Descripción</small>
            </a>
          </div>`;
}

function meal_section(selector, meal) {
  const element = document.getElementById(selector);
  element.innerHTML = `
  <div class="box_1">
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  </div>
  <div class="box_2">
  <h2>${meal.strMeal.toUpperCase()}</h2>
  <p><strong>Categoría:</strong> ${meal.strCategory}</p>
  <p><strong>Instrucciones:</strong> ${meal.strInstructions}</p>
  </div>
  `;
}

function display_meal(meal) {
  meal_section("first_meal", meal);
  recipes_gallery("first_recipe", "first_meal", meal);
}

refresh.addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir la recarga de la página
    update_recipes(); // Llamar a la función para actualizar las recetas
});

// Mostrar mensaje de error
function mostrar_error(input, mensaje){
    let contenedor_ingreso = input.parentElement; // Selecciona el <div> padre del input
    contenedor_ingreso.className = "form_control error"; // Cambia la clase para reflejar el error
    const small = contenedor_ingreso.querySelector("small"); // Selecciona el <small> dentro del div
    small.innerText = mensaje; // Inserta el mensaje de error
};

// Mostrar ingreso exitoso
function mostrar_success(input){
    let contenedor_ingreso = input.parentElement;
    contenedor_ingreso.className = "form_control success"; // Cambia la clase para reflejar el éxito
};


function validar_email(email) {
    const email_section = email.split("@");

    if (email_section.length !== 2) {
        return "Falta el símbolo '@' o hay más de uno";
    }

    const [usuario, dominio] = email_section;

    if (usuario.length === 0) {
        return "El nombre de usuario está vacío";
    }

    if (!dominio.includes(".")) {
        return "El dominio debe incluir un '.'";
    }
    return "";
}

function verificar_email(input) {
    const email_valor = input.value.trim(); // Obtén el valor del input

    if (validator.isEmail(email_valor)) {
        mostrar_success(input); // Muestra éxito si es válido
    } else {
        const mensaje_de_error = validar_email(email_valor); // Valida y obtiene el mensaje de error
        mostrar_error(input, mensaje_de_error || "El email no es válido"); // Muestra error si no es válido
    }
}

// Campos obligatorios
function requiere_verificar(input_array) {
    let es_requerido = false;
    input_array.forEach(function (input) {
        if (input.value.trim() === "") {
            mostrar_error(input, "El campo requiere ser completado");
            es_requerido = true;
        } else {
            mostrar_success(input);
        }
    });

    return es_requerido;
}

// Verifica la logitud de los valores almacenados en los inputs
function verificar_longitud(input, nombre_input, min, max) {
    if (input.value.length < min) {
    mostrar_error(input,`${nombre_input} debe tener un mínimo de ${min} caracteres`);
    } else if (input.value.length > max) {
    mostrar_error(input,`${nombre_input} debe tener menos de ${max} caracteres`);
    } else {
    mostrar_success(input);
    }
}

// Verificar que coincidan las contraseñas
function verificar_passwords_match(input1, input2) {
    if (input1.value !== input2.value) {
    mostrar_error(input2, "Las contraseñas no coinciden");
    }
}

// Event listeners
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!requiere_verificar([username, email, password, password_2])) {
        verificar_longitud(username, "El nombre de usuario", 3, 15);
        verificar_longitud(password, "La contraseña", 6, 25);
        verificar_email(email);
        verificar_passwords_match(password, password_2);
    }
});

/*inputs.addEventListener("click", function() {
  form_section.className = "container_blur";
});
// Iterar sobre cada input y agregar el evento
inputs.forEach((input) => {
  input.addEventListener("click", function () {
    form_section.className = "container_blur";
  });
});*/

form_container.addEventListener("mouseenter", function () {
  form_section.className = "container_blur";
});

form_container.addEventListener("mouseleave", function () {
  form_section.className = "container";
});

title.addEventListener("mouseover", function(){
  img.src = "images/chevy_logo_2.png";
});

title.addEventListener("mouseout", function(){
  img.src = "images/chevy_logo_1.png";
});

/*
title.addEventListener("mouseover", function(){
  title.innerHTML = `
  <a>
  <img src="images/chevy_logo_2.png" alt="La cocina de Chevy">
  </a>`
  ;
});

title.addEventListener("mouseout", function(){
  title.innerHTML = `
  <a>
  <img src="images/chevy_logo_1.png" alt="La cocina de Chevy">
  </a>`
  ;
});*/

// Llamar al cargar la página
fetch_meal();
update_recipes();