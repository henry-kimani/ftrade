'use client';

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Checkbox } from "./ui/checkbox";

const items = [ 
  {
    id: "recents",
    label: "Recents"
  },
  {
    id: "home",
    label: "Home"
  },
  {
    id: "applications",
    label: "Applications"
  }
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one item",
  }),
});

export default function StrategyCheckbox() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"]
    }
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <div className="grid gap-1.5 mb-4">
                  <FormLabel className="text-lg font-semibold">Strategy</FormLabel>
                  <FormDescription>
                    Select the strategies for this prediction
                  </FormDescription>
                </div>
                {items.map(item => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row item-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={checked => {
                                return checked 
                                ? field.onChange([ ...field.value, item.id ])
                                : field.onChange(field.value?.filter(value => value !== item.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
