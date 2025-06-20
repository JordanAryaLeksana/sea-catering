import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@/components/ui/form';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FormData = {
    name: string;
    phone: string;
    plansection: 'diet' | 'protein' | 'royal';
    mealtype: 'breakfast' | 'lunch' | 'dinner';
    delivery: Date;
    allergies?: string;
};
const validateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    plansection: z.enum(['diet', 'protein', 'royal'], {
        required_error: "Plan section is required",
    }),
    mealtype: z.enum(['breakfast', 'lunch', 'dinner'], {
        required_error: "Meal type is required",
    }),
    delivery: z.date({
        required_error: "Delivery date is required",
    }).min(new Date(), "Delivery date must be in the future"),
    allergies: z.string().optional(),

})


export default function SubscriptionPage() {
     const form = useForm<FormData>({
            defaultValues: {
                name: "",
                phone: "",
                plansection: "diet",
                mealtype: "breakfast",
                delivery: new Date(),
                allergies: ""
            },
            resolver: zodResolver(validateSchema)
        })
    
        const onSubmit = (data: FormData ) => {
            console.log("Form submitted:", data);
            // Here you can handle the form submission, e.g., send data to an API
        };
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <motion.div>
                <motion.h1
                    className="text-4xl font-bold mb-6 text-center"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Subscription
                </motion.h1>
                <div className='space-y-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Phone" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="plansection"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan Section</FormLabel>
                                        <FormControl>
                                            <Select {...field}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Plan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="diet">Diet</SelectItem>
                                                    <SelectItem value="protein">Protein</SelectItem>
                                                    <SelectItem value="royal">Royal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mealtype"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meal Type</FormLabel>
                                        <FormControl>
                                            <Select {...field}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Meal Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="breakfast">Breakfast</SelectItem>
                                                    <SelectItem value="lunch">Lunch</SelectItem>
                                                    <SelectItem value="dinner">Dinner</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="delivery"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Delivery Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                onChange={e => {
                                                    const dateValue = e.target.value ? new Date(e.target.value) : null;
                                                    field.onChange(dateValue);
                                                }}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Allergies (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="List any allergies" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </motion.div>
        </div>
    )
}