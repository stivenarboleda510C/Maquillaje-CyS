import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const envText = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
const env = {};
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const IMAGES_DIR =
  "C:/Users/HORACI~1/AppData/Local/Temp/claude/C--/839d129c-fff7-4f85-b342-2998f66f4e2d/scratchpad/catalogo/products";

const CATEGORIES = ["Cuidado de la Piel", "Maquillaje", "Accesorios"];

const SUBCATEGORIES = [
  { name: "Kits", category: "Cuidado de la Piel" },
  { name: "Serum", category: "Cuidado de la Piel" },
  { name: "Cremas", category: "Cuidado de la Piel" },
  { name: "Jabones", category: "Cuidado de la Piel" },
  { name: "Paletas de Sombras", category: "Maquillaje" },
  { name: "Labiales y Lip Gloss", category: "Maquillaje" },
  { name: "Bolsos", category: "Accesorios" },
  { name: "Joyeros", category: "Accesorios" },
];

const PRODUCTS = [
  { page: 3, name: "Kit de Rosas Bioaqua", price: 60000, subcategory: "Kits" },
  { page: 4, name: "Kit de Vitamina C Bioaqua", price: 60000, subcategory: "Kits" },
  { page: 5, name: "Kit de Acido Salicilico Bioaqua", price: 60000, subcategory: "Kits" },
  { page: 6, name: "Mini Kit de Acido Salicilico", description: "Incluye gel, serum y mascarilla", price: 22900, subcategory: "Kits" },
  { page: 7, name: "Mini Kit de Arroz", description: "Incluye serum, jabon en barra y crema", price: 26900, subcategory: "Kits" },
  { page: 8, name: "Mini Kit de Rosas", description: "Incluye crema, jabon y mascarilla", price: 22900, subcategory: "Kits" },

  { page: 10, name: "Kit de Serum x3", price: 28000, subcategory: "Serum" },
  { page: 11, name: "Serum Pequeno de Arroz", price: 7500, subcategory: "Serum" },
  { page: 12, name: "Serum de Acido Salicilico", price: 12000, subcategory: "Serum" },

  { page: 14, name: "Crema de Arroz", price: 13500, subcategory: "Cremas" },
  { page: 15, name: "Crema de Vitamina C", price: 13500, subcategory: "Cremas" },
  { page: 16, name: "Crema de Rosas", price: 13500, subcategory: "Cremas" },
  { page: 17, name: "Gel de Acido Salicilico", price: 13500, subcategory: "Cremas" },
  { page: 18, name: "Crema Anti Acne", description: "Ayuda a secar los granitos en 2 o 3 dias", price: 5000, subcategory: "Cremas" },

  { page: 20, name: "Jabon de Perilla", description: "Ayuda a prevenir arrugas y limpia muy bien la piel", price: 12000, subcategory: "Jabones" },
  { page: 21, name: "Jabon de Rosas", description: "Limpia y remueve impurezas de la piel", price: 13000, subcategory: "Jabones" },
  { page: 22, name: "Jabon Liquido de Arroz", price: 12000, subcategory: "Jabones" },

  { page: 24, name: "Paleta 3 en 1", description: "Incluye sombras, rubor e iluminador", price: 24000, subcategory: "Paletas de Sombras" },
  { page: 25, name: "Paleta Cherry", description: "Incluye iluminador, sombras y rubor", price: 24000, subcategory: "Paletas de Sombras" },
  { page: 26, name: "Paleta 35 Tonos Tierra", price: 25000, subcategory: "Paletas de Sombras" },
  { page: 27, name: "Paleta Azul 63 Tonos", price: 35000, subcategory: "Paletas de Sombras" },
  { page: 28, name: "Paleta 63 Tonos", price: 35000, subcategory: "Paletas de Sombras" },
  { page: 29, name: "Mini Paleta Tonos Tierra", description: "12 tonos", price: 12000, subcategory: "Paletas de Sombras" },
  { page: 30, name: "Iluminador Tornasol Mik", price: 22000, subcategory: "Paletas de Sombras" },
  { page: 31, name: "Iluminador 4 Tonos", price: 12000, subcategory: "Paletas de Sombras" },

  { page: 33, name: "Lip Gloss de Brillitos", price: 7000, subcategory: "Labiales y Lip Gloss" },
  { page: 34, name: "Gloss Hidratante y Voluminizador", description: "Aporta color suave dependiendo del pH", price: 6000, subcategory: "Labiales y Lip Gloss" },
  { page: 35, name: "Brillo Labial con Color", description: "El color varia dependiendo del pH", price: 5000, subcategory: "Labiales y Lip Gloss" },
  { page: 36, name: "Tinta de Labios", price: 5000, subcategory: "Labiales y Lip Gloss" },

  { page: 40, name: "Bolso Negro con Correa", price: 42000, subcategory: "Bolsos" },
  { page: 42, name: "Bolso Palo de Rosa con Correa", price: 40000, subcategory: "Bolsos" },
  { page: 43, name: "Bolso Rosa con Correa", price: 45000, subcategory: "Bolsos" },
  { page: 44, name: "Bolso Negro Acolchado con Correa", price: 40000, subcategory: "Bolsos" },

  { page: 45, name: "Joyero Pequeno Rosado", price: 13000, subcategory: "Joyeros" },
  { page: 46, name: "Joyero Rosa Claro", price: 13000, subcategory: "Joyeros" },
  { page: 47, name: "Joyero Mediano Rosa Claro", price: 23000, subcategory: "Joyeros" },
  { page: 48, name: "Joyero Mediano Azul Claro", price: 23000, subcategory: "Joyeros" },
];

async function main() {
  console.log(`Importando ${PRODUCTS.length} productos...`);

  console.log("Borrando datos anteriores...");
  await supabase.from("product_images").delete().neq("id", 0);
  await supabase.from("products").delete().neq("id", 0);
  await supabase.from("subcategories").delete().neq("id", 0);
  await supabase.from("categories").delete().neq("id", 0);

  console.log("Creando categorias...");
  const { data: catRows, error: catError } = await supabase
    .from("categories")
    .insert(CATEGORIES.map((name) => ({ name })))
    .select();
  if (catError) throw new Error("categorias: " + catError.message);
  const categoryIdByName = Object.fromEntries(catRows.map((c) => [c.name, c.id]));

  console.log("Creando subcategorias...");
  const { data: subRows, error: subError } = await supabase
    .from("subcategories")
    .insert(
      SUBCATEGORIES.map((s) => ({
        name: s.name,
        category_id: categoryIdByName[s.category],
      }))
    )
    .select();
  if (subError) throw new Error("subcategorias: " + subError.message);
  const subcategoryIdByName = Object.fromEntries(subRows.map((s) => [s.name, s.id]));
  const categoryIdBySubName = Object.fromEntries(
    SUBCATEGORIES.map((s) => [s.name, categoryIdByName[s.category]])
  );

  for (const p of PRODUCTS) {
    process.stdout.write(`Producto: ${p.name}... `);

    const filePath = `${IMAGES_DIR}/page${p.page}.png`;
    const fileBuffer = readFileSync(filePath);
    const storagePath = `import-page${p.page}-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(storagePath, fileBuffer, { contentType: "image/png" });
    if (uploadError) throw new Error(`subir imagen ${p.name}: ${uploadError.message}`);

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(storagePath);

    const { data: productRow, error: productError } = await supabase
      .from("products")
      .insert({
        name: p.name,
        description: p.description ?? null,
        price: p.price,
        stock: 10,
        category_id: categoryIdBySubName[p.subcategory],
        subcategory_id: subcategoryIdByName[p.subcategory],
      })
      .select()
      .single();
    if (productError) throw new Error(`crear producto ${p.name}: ${productError.message}`);

    const { error: imgError } = await supabase.from("product_images").insert({
      product_id: productRow.id,
      image_url: urlData.publicUrl,
      sort_order: 0,
    });
    if (imgError) throw new Error(`guardar imagen ${p.name}: ${imgError.message}`);

    console.log("ok");
  }

  console.log("Importacion completa.");
}

main().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
