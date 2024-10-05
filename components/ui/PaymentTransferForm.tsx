"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { paymentTransferFormSchema } from "@/lib/utils";
import { Button } from "./button";
import CustomPaymentTransferInput from "./CustomPaymentTransferInput";


const PaymentTransferForm = () => {

    const formSchema = paymentTransferFormSchema();


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        amount: "",
        senderBank: "",
        sharableId: "",
      },
    });

      // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="space-y-8">
          <div className="flex flex-col gap-6">
                <CustomPaymentTransferInput
                    fieldLabel=""
                    fieldName="email"
                    fieldPlaceholder=""
                    control={form.control}
                />
          </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )

}

export default PaymentTransferForm;





