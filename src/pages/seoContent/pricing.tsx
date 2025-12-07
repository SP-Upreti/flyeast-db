"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import List from "./list";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: { cat: string; feature: string[] }[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
}

export function Pricing({ plans }: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsl(var(--red-500 text))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-500 mb-2">
          SEO Features
        </h1>
        <p className="text-lg text-muted-foreground">
          This is a premium page. Please select one of the plans and contact to
          our <br />
          SEO experts to be listed through out the internet.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4"></h2>

      <div className="flex justify-center pb-4 ">
        <label className="relative inline-flex items-center cursor-pointer">
          <Label>
            <Switch
              ref={switchRef as any}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative"
            />
          </Label>
        </label>
        <span className="ml-2 font-semibold">
          Annual billing <span className="text-green-500 text">(Save 20%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 sm:2 gap-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={cn(
              ` border-[1px] rounded-2xl h-fit p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative`,
              plan.isPopular
                ? "border-red-500 text border-2"
                : "border-border",
              "flex flex-col",
              !plan.isPopular && "mt-5",
              index === 0 || index === 2
                ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                : "z-10",
              index === 0 && "origin-right",
              index === 2 && "origin-left"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-red-500 text py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="text-white h-4 w-4 fill-current" />
                <span className="text-white ml-1 font-sans font-semibold">
                  Popular
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold text-muted-foreground">
                  {plan.name}
                </p>
                <p className="text-sm leading-5 text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  Rs.
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    transformTiming={{
                      duration: 500,
                      easing: "ease-out",
                    }}
                    willChange
                    className="font-variant-numeric: tabular-nums"
                  />
                </span>
                <p className="text-sm leading-5 text-muted-foreground">
                  {isMonthly ? "/per Month" : "/per Year"}
                </p>
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                {isMonthly ? "billed monthly" : "billed annually"}
              </p>

              <ul className="mt-5 gap-2 flex flex-col">
                <List plans={plan} />
              </ul>

              <hr className="w-full my-4" />

              <Link
                to={plan.href}
                target="_blank"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-red-500 text hover:ring-offset-1 hover:bg-red-500 text hover:text-white text-foreground",
                  plan.isPopular
                    ? "bg-red-500 text-white"
                    : "bg-background text-foreground"
                )}
              >
                {plan.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
