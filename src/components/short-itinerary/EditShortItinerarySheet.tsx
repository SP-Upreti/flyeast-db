import { useState, useEffect } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    days: z.string().min(1, "Days description is required"),
    age: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    specialization: z.string().optional(),
});

interface EditShortItineraryPageProps {
    id: string;
    onClose: () => void;
}

export default function EditShortItineraryPage({
    id,
    onClose,
}: EditShortItineraryPageProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            days: "",
            age: "",
            yearsOfExperience: "",
            specialization: "",
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/short-itinerary/${id}`);
                const data = response.data.data || response.data;
                form.reset({
                    title: data.title || "",
                    days: data.days || "",
                    age: data.age || "",
                    yearsOfExperience: data.yearsOfExperience || "",
                    specialization: data.specialization || "",
                });
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "Failed to fetch data");
                onClose();
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsUpdating(true);
            await api.put(`/short-itinerary/${id}`, values);
            toast.success("Short itinerary updated successfully");
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <Button variant="ghost" className="mb-4" onClick={onClose}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                </Button>
                <h2 className="text-2xl font-bold">Edit Short Day Itinerary</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title *</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Summit Day" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="days"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Days Description *</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g. Early start for summit, then descend to high camp."
                                        rows={5}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 25-45" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="yearsOfExperience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 5-10 years" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Specialization</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Mountain Guide" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
