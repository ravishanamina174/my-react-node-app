import CreateProductForm from "../components/CreateProductForm";
import { useGetAllCategoriesQuery } from "../lib/api";

function CreateProductPage() {
    const { data: apiResponse, isLoading, isError } = useGetAllCategoriesQuery();
    
    // Extract categories array from API response object and filter out "All" category
    const allCategories = apiResponse?.data || [];
    const categories = allCategories.filter(category => category.name !== "All");

    if (isLoading) {
        return (
            <main className="px-16 min-h-screen py-8">
                <h2 className="text-4xl font-bold">Create Product</h2>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="px-16 min-h-screen py-8">
                <h2 className="text-4xl font-bold">Create Product</h2>
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Failed to load categories</h3>
                    <p className="text-gray-500 mb-4">
                        Unable to load product categories. Please try again later.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="px-16 min-h-screen py-8">
            <h2 className="text-4xl font-bold">Create Product</h2>
            <CreateProductForm categories={categories} />
        </main>
    );
}

export default CreateProductPage;