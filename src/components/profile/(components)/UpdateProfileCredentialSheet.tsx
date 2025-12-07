import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilePenLine, Loader, Mail, Settings, Store } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { GlobalContext } from "@/context/GlobalContext";

const formSchema = z.object({
  email: z
    .string()
    .min(8, {
      message: "Vendor email must be at least 8 character.",
    })
    .max(40, {
      message: "Vendor email must be less than 40 characters.",
    })
    .email(),
});

export default function UpdateProfileCredentialSheet() {
  const { currentUser, setCurrentUser, isLoading } = useContext(
    GlobalContext
  ) as any;
  currentUser;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: currentUser?.email || "",
    },
  });

  // Define a submit handler
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSendingOTP(true);

    toast.success("Reset link sent successfully, please check your email.");
    form.reset();
    setIsSendingOTP(false);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className=" text-xs">
          <Settings size={14} className=" mr-1" />
          Update
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-xl z-[999]">
        <SheetHeader className=" mb-4">
          <SheetTitle className=" flex items-center gap-2">
            Update Profile <Store className=" h-4 w-4 text-primary" />{" "}
          </SheetTitle>
          <SheetDescription>Change your profile from here .</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" grid sm:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="you aremail@gmail.com" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isSendingOTP}
                className=" float-end"
                type="submit"
              >
                {isSendingOTP ? (
                  <Loader size={16} className=" animate-spin mr-2 " />
                ) : (
                  <Mail size={16} className="mr-1" />
                )}
                Sent Reset Link
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
