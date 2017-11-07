import Brand from "./Brand";

interface BrandResponse {
    hits: Brand[];
    hitsPerPage: number;
    nbHits: number;
    nbPages: number;
    page: number
}

export default BrandResponse;