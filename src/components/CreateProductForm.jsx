import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCreateProductMutation } from "../lib/api";

import ImageInput from "./ImageInput";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const createProductFormSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  stock: z.number(),
  price: z.number().nonnegative(),
});

function CreateProductForm({ categories }) {
  console.log('CreateProductForm received categories:', categories);
  
  const form = useForm({
    resolver: zodResolver(createProductFormSchema),
  });

  const [createProduct, { isLoading }] = useCreateProductMutation();

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  const onSubmit = async (values) => {
    try {
      console.log(values);

      // await createProduct(values).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  // Show error if no categories available
  if (safeCategories.length === 0) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">No Categories Available</h3>
        <p className="text-red-600 text-sm">
          Unable to load product categories. Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mt-4 w-1/4"
      >
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select  onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {safeCategories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Denim" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Write a description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageInput onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter stock qunatity"
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value) || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="This is the product price"
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value) || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateProductForm;