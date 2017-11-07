import Categories from "./Categories"

interface CategoryResponse {
    hits: Categories[];
    hitsPerPage: number;
    nbHits: number;
    nbPages: number;
    page: number
}

export default CategoryResponse;