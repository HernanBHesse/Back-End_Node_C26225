const { API_URL } = process.env;

if (!API_URL) {
  throw new Error("Falta configurar API_URL en el archivo .env.");
}

const [, , method, resource, ...argumentsList] = process.argv;

const printHelp = () => {
  console.log(`Uso:
  npm run start GET products
  npm run start GET products/<id>
  npm run start POST products <title> <price> <category>
  npm run start DELETE products/<id>`);
};

const request = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`La API respondió con el estado ${response.status}.`);
  }

  return response.json();
};

const showProducts = (products) => {
  const list = Array.isArray(products) ? products : [products];

  list.forEach(({ id, title, price, category }) => {
    console.log(`\n[${id}] ${title}\nPrecio: $${price}\nCategoría: ${category}`);
  });
};

const getProductId = (path) => {
  const [, id] = path.split("/");
  return id;
};

const run = async () => {
  if (!method || !resource) {
    printHelp();
    return;
  }

  const normalizedMethod = method.toUpperCase();
  const [resourceName] = resource.split("/");

  if (resourceName !== "products") {
    throw new Error('El recurso válido es "products".');
  }

  const productId = getProductId(resource);

  if (normalizedMethod === "GET") {
    const products = await request(productId ? `${API_URL}/${productId}` : API_URL);
    showProducts(products);
    return;
  }

  if (normalizedMethod === "POST") {
    const [title, price, category] = argumentsList;

    if (!title || !price || !category || Number.isNaN(Number(price))) {
      throw new Error("Para crear un producto indicá: título, precio y categoría.");
    }

    const product = await request(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price: Number(price),
        category,
      }),
    });

    console.log("Producto creado:");
    showProducts(product);
    return;
  }

  if (normalizedMethod === "DELETE") {
    if (!productId) {
      throw new Error("Indicá el ID: DELETE products/<id>.");
    }

    const product = await request(`${API_URL}/${productId}`, { method: "DELETE" });
    console.log("Producto eliminado:");
    showProducts(product);
    return;
  }

  throw new Error(`El método "${method}" no está soportado.`);
};

run().catch((error) => {
  console.error(`Error: ${error.message}`);
  printHelp();
  process.exitCode = 1;
});
