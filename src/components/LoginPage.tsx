import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

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

  password: z
    .string()
    .min(7, {
      message: "Password must be at least 7 character.",
    })
    .max(22, {
      message: "Password must be less than 22 characters.",
    }),
});

export default function LoginPage() {
  const { saveInfo } = useUserStore();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useNavigate();

  // Define a submit handler
  const [isLoging, setILoging] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setILoging(true);
      const res = await api.post("/users/login", values);
      res;
      if (
        res.data.accessToken &&
        res.data.user.role !== "super-admin" &&
        res.data.user.role !== "admin" &&
        res.data.user.role !== "editor" &&
        res.data.user.role !== "user"
      ) {
        toast.error("You are not authorized.");
        setILoging(false);

        return;
      }
      if (
        res.data.accessToken &&
        (res.data.user.role === "super-admin" ||
          res.data.user.role == "admin" ||
          res.data.user.role === "editor" ||
          res.data.user.role === "user")
      ) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("role", res.data.user.role);

        setILoging(false);
        saveInfo({
          accessToken: res.data.accessToken,
          user: res.data.user,
        });
        toast.success("Hey Admin, Welcome back to the dashboard.");
        router("/dashboard");
        return;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.msg || "An error occurred during login";
      toast.error(errorMessage);
      setILoging(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          <Card className="w-full border border-border rounded-sm">
            {/* Logo & Header */}
            <CardHeader className="text-center space-y-2 pt-6">
              <div className="flex justify-center p-4">
                <img
                  src="/logo/logo2.png"
                  alt="Company Logo"
                  width={800}
                  height={84}
                  className="w-32 h-auto"
                />
              </div>
              <CardTitle className="text-2xl font-semibold">
                Admin Login
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Please log in to continue managing the{" "}
                <span className="font-medium text-primary">Admin Portal</span>
              </CardDescription>
            </CardHeader>

            {/* Form Fields */}
            <CardContent className="grid gap-4 px-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-yellow-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="admin@example.com"
                        {...field}
                        className="bg-background py-2!"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"

                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>
                      Password <span className="text-yellow-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="********"
                          {...field}
                          className="pr-10 bg-background"
                        />

                        <div className="absolute -translate-y-1/2 top-1/2 right-3 flex items-center cursor-pointer text-muted-foreground">
                          {showPassword ? (
                            <EyeOff
                              size={18}
                              onClick={() => setShowPassword(false)}
                            />
                          ) : (
                            <Eye size={18} onClick={() => setShowPassword(true)} />
                          )}
                        </div>

                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                onCopy={(e) => e.preventDefault()}
                disabled={isLoging}
                type="submit"
              >
                {isLoging && <Loader size={16} className="animate-spin mr-2" />}
                Login
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
