# Galway Bar

Sitio web estático para presentar la información principal del bar Galway, su menú, eventos y datos de contacto.

## Estructura del proyecto

```
.
├── index.html
├── assets
│   ├── script.js
│   └── styles.css
├── data
│   ├── menu.js
│   └── site-info.js
└── README.md
```

- **index.html**: estructura base de la página.
- **assets/styles.css**: estilos principales.
- **assets/script.js**: lógica para renderizar el menú, la galería, los eventos y la información de contacto.
- **data/menu.js**: fuente editable del menú, eventos y galería.
- **data/site-info.js**: datos de contacto y enlaces.

## Cómo personalizar

1. Abre `data/site-info.js` y reemplaza los valores con la información real del bar (dirección, teléfono, redes sociales, etc.).
2. Edita `data/menu.js` para actualizar categorías, productos, precios, eventos y galería. Cada categoría tiene un `id` que se usa para el filtrado.
3. Si lo deseas, puedes reemplazar las imágenes de la galería por URLs propias o cambiar los textos por mensajes promocionales.

## Visualización

Puedes abrir `index.html` directamente en tu navegador o servirlo con un servidor estático:

```bash
python -m http.server 8000
```

Luego visita [http://localhost:8000](http://localhost:8000) para ver el sitio.

## Capturas o branding

El diseño utiliza fuentes de Google Fonts y colores oscuros con acentos dorados inspirados en pubs irlandeses. Ajusta el CSS según la identidad visual del bar.
