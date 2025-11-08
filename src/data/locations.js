// Datos simulados para los desplegables de estados y municipios.
// En una aplicación real, esto vendría de una API.

export const states = [
  { id: 7, name: "Chiapas" },
  { id: 9, name: "Ciudad de México" },
  { id: 14, name: "Jalisco" },
  { id: 19, name: "Nuevo León" },
];

export const municipalities = {
  // Municipios de Chiapas (id: 7)
  7: [
    { id: 101, name: "Tuxtla Gutiérrez" },
    { id: 82, name: "San Cristóbal de las Casas" },
    { id: 97, name: "Tapachula" },
    { id: 26, name: "Comitán de Domínguez" },
  ],
  // Municipios de Ciudad de México (id: 9)
  9: [
    { id: 15, name: "Cuauhtémoc" },
    { id: 2, name: "Benito Juárez" },
    { id: 10, name: "Coyoacán" },
    { id: 12, name: "Iztapalapa" },
  ],
  // Municipios de Jalisco (id: 14)
  14: [
    { id: 39, name: "Guadalajara" },
    { id: 98, name: "Zapopan" },
    { id: 82, name: "Tlaquepaque" },
    { id: 97, name: "Tonalá" },
  ],
  // Municipios de Nuevo León (id: 19)
  19: [
    { id: 39, name: "Monterrey" },
    { id: 46, name: "San Pedro Garza García" },
    { id: 21, name: "Guadalupe" },
    { id: 1, name: "Apodaca" },
  ],
};