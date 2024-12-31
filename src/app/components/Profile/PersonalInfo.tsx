import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormClearErrors, useFormContext } from "react-hook-form";
import { FormValues } from "./ProfileSchema";

const PersonalInfo = ({
  clearErrors,
}: {
  clearErrors: UseFormClearErrors<FormValues>;
}) => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your first name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors("firstName");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="flex-1 mt-4 md:mt-0">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your last name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors("lastName");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="dob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  clearErrors("dob");
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your phone number"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  clearErrors("phone");
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalInfo;
