"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import{
    Form,
    FormControl,    
    FormField,
    FormItem,
    FormLabel,
    FormMessage

}from "@/components/ui/form"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { title } from "process";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFormProps {
    initialData:{
        description: string;
    };
    courseId: string;
};

const formSchema = z.object({
    description: z.string().min(1,{
        message:"Description is required",
    }),
});


const DescriptionForm = ({
    initialData,
    courseId
}:DescriptionFormProps) => {
    const [isEditing, setisEditing] = useState(false)

    const toggleEdit=() => setisEditing((current) => !current)
    const router =useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:  zodResolver(formSchema),
        defaultValues: initialData
    });

    const { isSubmitting , isValid }= form.formState;

    const onSubmit = async (values:z.infer<typeof formSchema>) => {
       try {
        await axios.patch(`/api/courses/${courseId}` , values);
        toast.success("course updated")
        toggleEdit();
        router.refresh();
       } catch (error) {
        toast.error("Something went wrong")
       }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Add description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) :
                    
                         (
                            <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit Description
                            </>
                        )
                    }
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {initialData.description || "No description"}
                </p>
            )}
            {/* below code is for editing the form */}
            {/* when isediting becomes true which by default false */}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField 
                            control={form.control}
                            name="description"
                            render={ ({field}) => (
                                <FormItem>                                    
                                    <FormControl>
                                        {/* if we are update req on api we are gonna disable this input */}
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'This couse is about ... '"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>                                
                             ) }
                        />
                        <div className="flex items-center gap-x-2 ">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
     )
}
 
export default DescriptionForm;