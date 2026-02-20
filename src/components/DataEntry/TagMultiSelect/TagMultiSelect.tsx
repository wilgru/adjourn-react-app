import { Plus } from "@phosphor-icons/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { TagPill } from "src/components/dataDisplay/TagPill/TagPill";
import { Icon } from "src/components/general/Icon/Icon";
import { colours } from "src/constants/colours.constant";
import { useCreateTag } from "src/hooks/tags/useCreateTag";
import { useGetTags } from "src/hooks/tags/useGetTags";
import type { Colour } from "src/types/Colour.type";
import type { Tag } from "src/types/Tag.type";

type TagMultiSelectProps = {
  initialTags: Tag[];
  colour?: Colour;
  onChange: (tags: Tag[]) => void;
};

export const TagMultiSelect = ({
  initialTags,
  colour = colours.orange,
  onChange,
}: TagMultiSelectProps) => {
  const { tags } = useGetTags();
  const { createTag } = useCreateTag();

  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags);
  const [search, setSearch] = useState("");

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedTags.some((selectedTag) => selectedTag.id === tag.id),
  );

  const handleSelectTag = (tag: Tag) => {
    const newTags = [...selectedTags, tag];

    setSelectedTags(newTags);
    onChange(newTags);
    setSearch("");
  };

  const handleCreateTag = async () => {
    if (!search.trim()) {
      return;
    }

    const newTag = await createTag({
      createTagData: {
        name: search.trim(),
        description: null,
        badges: [],
        topicGroupId: null,
        colour: colours.orange,
        icon: "tag",
      },
    });
    const newTags = [...selectedTags, newTag];

    setSelectedTags(newTags);
    onChange(newTags);
    setSearch("");
  };

  const handleRemoveTag = (tagId: string) => {
    const newTags = selectedTags.filter((tag) => tag.id !== tagId);

    setSelectedTags(newTags);
    onChange(newTags);
  };

  return (
    <div className="flex flex-row gap-2 relative">
      {selectedTags.map((tag) => (
        <TagPill
          key={tag.id}
          tag={tag}
          closable
          onClick={() => handleRemoveTag(tag.id)}
        />
      ))}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div>
            <Button variant="ghost" size="sm" colour={colour} iconName="tag" />
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="flex flex-col gap-2 bg-white border border-slate-200 text-sm rounded-2xl p-2 w-40 drop-shadow"
            sideOffset={2}
            align="start"
          >
            <input
              type="text"
              className="rounded-lg px-2 py-1 text-xs border border-slate-300 focus:outline-none focus:border-orange-400"
              placeholder="search for a topic"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />

            {filteredTags.map((tag) => (
              <DropdownMenu.Item
                key={tag.id}
                className="rounded-lg flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-orange-100 text-sm"
                onClick={() => handleSelectTag(tag)}
              >
                <Icon
                  iconName={tag.icon}
                  size="sm"
                  className={tag.colour.textPill}
                  weight="regular"
                />
                {tag.name}
              </DropdownMenu.Item>
            ))}

            {search.trim().length > 0 &&
              !tags.some((tag) => tag.name === search) && (
                <DropdownMenu.Item
                  className="rounded-lg flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-orange-100 text-sm"
                  onMouseDown={handleCreateTag}
                >
                  <Plus className="fill-slate-500" size={18} />
                  Create "{search.trim()}"
                </DropdownMenu.Item>
              )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
