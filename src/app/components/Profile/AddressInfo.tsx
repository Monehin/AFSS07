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

const AddressInfo = ({
  clearErrors,
}: {
  clearErrors: UseFormClearErrors<FormValues>;
}) => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your address"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  clearErrors("address");
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your country"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors("country");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your state"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors("state");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your city"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors("city");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="zip"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your ZIP code"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors("zip");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressInfo;
