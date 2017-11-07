import Product from "./Product";

interface ProductResponse {
    hits: Product[];
    hitsPerPage: number;
    nbHits: number;
    nbPages: number;
    page: number
}

export default ProductResponse;