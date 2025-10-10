import { Button } from "src/components/controls/Button/Button";
import { Input } from "../Input/Input";
import type { TagBadge } from "src/types/Tag.type";

type MultiBadgeInputProps = {
  badges: TagBadge[];
  onChange: (badge: TagBadge) => void;
  onAddBadge: () => void;
};

export const MultiBadgeInput = ({
  badges,
  onChange,
  onAddBadge,
}: MultiBadgeInputProps) => {
  return (
    <div className="flex flex-col gap-3 p-2 bg-slate-100 rounded-md">
      {badges.map((badge) => (
        <div key={badge.id} className="flex gap-2">
          <Input
            id={badge.id}
            type="text"
            value={badge.title}
            placeholder="Title"
            required
            onChange={(e) => onChange({ ...badge, title: e.target.value })}
          />

          <Input
            id={`${badge.id}-link`}
            type="text"
            value={badge.link || ""}
            placeholder="Link (optional)"
            onChange={(e) => onChange({ ...badge, link: e.target.value })}
          />
        </div>
      ))}

      <Button size="sm" iconName="plus" variant="ghost" onClick={onAddBadge}>
        Add badge
      </Button>
    </div>
  );
};
