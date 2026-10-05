# Gestión de productos por consola

CLI en Node.js que consume la API pública [FakeStore](https://fakestoreapi.com/).

## Requisitos

Node.js 18 o superior. No requiere dependencias externas, porque Node incluye `fetch`.

La URL de la API se configura en `.env`:

```env
API_URL=https://fakestoreapi.com/products
```

## Ejecución

```bash
npm run start GET products
npm run start GET products/1
npm run start POST products T-Shirt-Rex 300 remeras
npm run start DELETE products/7
```

> FakeStore es una API de prueba: las operaciones `POST` y `DELETE` devuelven una respuesta simulada y no modifican permanentemente su catálogo.

## Estructura

- `index.js`: interpreta los argumentos de consola y concentra las solicitudes HTTP.
- `.env`: almacena la configuración de la API.
- `package.json`: habilita ES Modules y carga `.env` al iniciar.
