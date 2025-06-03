import { Plus, X } from "@phosphor-icons/react";
import { useCallback, useState } from "react";
import { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import { colours } from "src/constants/colours.constant";
import { useCreateTag } from "src/hooks/tags/useCreateTag";
import { useGetTags } from "src/hooks/tags/useGetTags";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";
import type { Slip } from "src/types/Slip.type";
import type { Tag } from "src/types/Tag.type";

type TagMultiSelectProps = {
  initialSlip: Slip;
  onChange: (tags: Tag[]) => void;
};

type Option = {
  label: string;
  value: string;
};

const getColourFromTag = (tags: Tag[], tagId: string): Colour => {
  const tag = tags.find((tag) => tag.id === tagId);

  return tag ? tag.colour : colours.orange;
};

export const TagMultiSelect = ({
  initialSlip,
  onChange,
}: TagMultiSelectProps) => {
  const { tags } = useGetTags();
  const { createTag } = useCreateTag();

  const [value, setValue] = useState<Option[]>(
    initialSlip.tags.map((tag) => ({
      value: tag.id,
      label: tag.name,
    }))
  );

  const onCreateNewTag = useCallback(
    async (tagToCreate: string) => {
      const newTag = await createTag(tagToCreate);

      setValue((currentValue) => [
        ...currentValue,
        { value: newTag.id, label: newTag.name },
      ]);

      onChange([...initialSlip.tags, newTag]);
    },
    [createTag, initialSlip.tags, onChange]
  );

  const options = tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
    colour: tag.colour,
  }));

  return (
    <div className="flex flex-row gap-2">
      <CreatableSelect
        isMulti
        options={options}
        placeholder="Add tag"
        value={value}
        onChange={(selectedTags) => {
          setValue([...selectedTags]);

          onChange(
            selectedTags.reduce((acc: Tag[], selectedTag) => {
              const tag = tags.find((tag) => tag.id === selectedTag.value);

              if (tag) {
                acc.push(tag);
              }

              return acc;
            }, [])
          );
        }}
        onCreateOption={onCreateNewTag}
        components={{
          DropdownIndicator: (props) => {
            return (
              <components.DropdownIndicator {...props}>
                <Plus weight="bold" />
              </components.DropdownIndicator>
            );
          },
          MultiValueRemove: (props) => {
            return (
              <components.MultiValueRemove {...props}>
                <X weight="bold" size={12} />
              </components.MultiValueRemove>
            );
          },
        }}
        closeMenuOnSelect={false}
        isClearable={false}
        classNames={{
          control: ({ isFocused }) => {
            return cn(
              "bg-white",
              "rounded-md",
              "hover:bg-orange-100",
              isFocused && "bg-orange-100"
            );
          },
          placeholder: () => {
            return cn("text-xs", "text-slate-500", "cursor-pointer");
          },
          multiValue: (props) => {
            const { backgroundPill, text } = getColourFromTag(
              tags,
              props.data.value
            );
            return cn(
              "rounded-full",
              "text-xs",
              "cursor-text",
              backgroundPill,
              text // TODO: This only styles the 'X' for some reason
            );
          },
          multiValueRemove: () => {
            return cn("rounded-full");
          },
          input: () => {
            return cn("text-xs");
          },
          dropdownIndicator: () => {
            return cn(
              "text-slate-500",
              "hover:text-orange-500",
              "rounded-md",
              "p-1",
              "cursor-pointer"
            );
          },
          menuList: () => cn("bg-white", "rounded-md", "p-1"),
          option: () =>
            cn(
              "leading-none",
              "text-sm",
              "p-1",
              "hover:bg-orange-100",
              "hover:text-orange-500",
              "outline-none",
              "rounded-sm",
              "cursor-pointer"
            ),
          noOptionsMessage: () => {
            return cn("text-sm", "text-slate-500", "p-1");
          },
        }}
        styles={{
          control: (base) => ({
            ...base,
            boxShadow: undefined,
            backgroundColor: undefined,
            borderWidth: undefined,
            borderRadius: undefined,
            minHeight: undefined,
          }),
          placeholder: (base) => ({
            ...base,
            cursor: undefined,
            fontSize: undefined,
            color: undefined,
          }),
          valueContainer: (base) => ({
            ...base,
            padding: undefined,
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: undefined,
            color: undefined,
            borderRadius: undefined,
          }),
          multiValueRemove: (base) => ({
            ...base,
            borderRadius: undefined,
          }),
          input: (base) => ({
            ...base,
            font: undefined,
            paddingTop: undefined,
            paddingBottom: undefined,
            margin: undefined,
          }),
          indicatorSeparator: (base) => ({
            ...base,
            display: "none",
          }),
          dropdownIndicator: () => ({}),
          option: () => ({}),
          noOptionsMessage: (base) => ({
            ...base,
            padding: undefined,
            fontSize: undefined,
            color: undefined,
          }),
        }}
      />
    </div>
  );
};
