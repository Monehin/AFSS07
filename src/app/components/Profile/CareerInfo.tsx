import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Instagram,
  Linkedin,
  X as Twitter,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { UseFormClearErrors, useFormContext } from "react-hook-form";
import { FormValues } from "./ProfileSchema";

const CareerInfo = ({
  clearErrors,
}: {
  clearErrors: UseFormClearErrors<FormValues>;
}) => {
  const { control, setValue, getValues } = useFormContext<FormValues>();
  const [activeFields, setActiveFields] = useState<string[]>([]);

  const platformOptions = [
    { id: "linkedin", label: "LinkedIn", icon: Linkedin },
    { id: "instagram", label: "Instagram", icon: Instagram },
    { id: "x", label: "X (formerly Twitter)", icon: Twitter },
    { id: "facebook", label: "Facebook", icon: Facebook },
    { id: "youtube", label: "YouTube", icon: Youtube },
  ];

  const addField = (id: string) => {
    setActiveFields((prev) => [...prev, id]);
    setValue("social_media_links", [
      ...getValues("social_media_links"),
      { platform: id, url: "" },
    ]);
  };

  const removeField = (id: string) => {
    setActiveFields((prev) => prev.filter((field) => field !== id));
    const updatedLinks = getValues("social_media_links").filter(
      (link) => link.platform !== id
    );
    setValue("social_media_links", updatedLinks);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="career"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Career</FormLabel>
            <FormControl>
              <Input placeholder="Enter your career" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
        <div className="flex gap-4 mb-4">
          {platformOptions.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => addField(id)}
              disabled={activeFields.includes(id)}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {getValues("social_media_links").map((link, index) => {
            const Icon = platformOptions.find(
              (option) => option.id === link.platform
            )?.icon;

            return (
              <div
                key={link.platform}
                className="flex items-center gap-4 border p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5 text-gray-600" />}
                  <FormLabel className="text-sm capitalize"></FormLabel>
                </div>
                <FormField
                  control={control}
                  name={`social_media_links.${index}.url` as const}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Enter the URL"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            clearErrors("social_media_links");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="destructive"
                  className="ml-auto"
                  onClick={() => removeField(link.platform)}
                >
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareerInfo;
