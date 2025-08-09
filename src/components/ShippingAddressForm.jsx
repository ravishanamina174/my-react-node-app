import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useCreateOrderMutation } from "@/lib/api";
import { useSelector } from "react-redux";


const shippingAddressFormSchema = z.object({
    line_1: z.string().min(1).max(50),
    line_2: z.string().min(1).max(50),
    city: z.string().min(1).max(50),
    phone: z.string().min(1).max(15),

})

function ShippingAddressForm () {
    const form = useForm({
      resolver: zodResolver(shippingAddressFormSchema),
      defaultValues:{
        line_1: "",
        line_2: "",
        city: "",
        phone: "",
      }
    });
    const cart = useSelector((state) => state.cart.cartItems);
    const [createOrder, {isLoading}] = useCreateOrderMutation();
     async function onSubmit(values) {
        console.log(values); // This logs the form values on submit
        try {
          await createOrder({
            shippingAddress:values,
            items:cart.map((item)=>({
              productId:item.product._id,
              quantity:item.quantity,
            })),
          }).unwrap();
        } catch (error) {
          console.log(error);
        }
      }
    
    return (
      <Form {...form} >
       <form onSubmit={form.handleSubmit(onSubmit)}>
         <FormField
            control={form.control}
            name="line_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="123/5" {...field} />
                </FormControl>
                <FormDescription>
                  This is the address line 1
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="line_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="123/5" {...field} />
                </FormControl>
                <FormDescription>
                  This is the address line 2
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Colombo 5" {...field} />
                </FormControl>
                <FormDescription>
                  This is the City
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+94" {...field} />
                </FormControl>
                <FormDescription>
                  This is the phone number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
         <div>
          <Button type="Submit">Submit</Button>
         </div>
        </form>
      </Form>
    );   
}

export default  ShippingAddressForm ;
















































// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Button } from "./ui/button";
// import { useState } from "react";

// function ShippingAddressForm() {
//   const [errors, setErrors] = useState({});

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     const fname = formData.get("fname");
//     if (fname.length < 4) {
//       setErrors({
//         ...errors,
//         fname: "First Name should be at least 4 char long",
//       });
//       return;
//     }
//     setErrors((prevErrors) => {
//       const newErrors = { ...prevErrors };
//       delete newErrors.fname; // Remove fname error
//       return newErrors;
//     });

//     const lname = formData.get("lname");
//     if (lname.length < 4) {
//       setErrors({
//         ...errors,
//         lname: "Last Name should be at least 4 char long",
//       });
//       return;
//     }
//     setErrors((prevErrors) => {
//       const newErrors = { ...prevErrors };
//       delete newErrors.lname; // Remove lname error
//       return newErrors;
//     });
//     console.log(fname);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <Label>First Name</Label>
//         <Input name="fname" className={errors.fname ? "border-red-500" : ""} />
//       </div>
//       <div>
//         <Label>Last Name</Label>
//         <Input name="lname" className={errors.lname ? "border-red-500" : ""} />
//       </div>
//       <Button>Submit</Button>
//     </form>
//   );
// }

// export default ShippingAddressForm;