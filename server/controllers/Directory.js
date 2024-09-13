import path, { dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

export const imagePath = path.join(__dirname, "uploads/product-image")
