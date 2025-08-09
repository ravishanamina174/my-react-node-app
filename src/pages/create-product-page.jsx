import CreateProductForm from "../components/CreateProductForm";
import { categories } from "../data";

function CreateProductPage() {

    // const { data:categories} = useGetAllCategoriesQuery();
    return (
        <main className="px-16 min-h-screen py-8">
              <h2 className="text-4xl font-bold">Create Product</h2>
              <CreateProductForm   categories={categories} />
        </main>
    );
}

export default CreateProductPage;