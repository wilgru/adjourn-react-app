import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";

type EmptyStateProps = {
  text: string;
  onAdd?: () => void;
};

export const EmptyState = ({ text, onAdd }: EmptyStateProps) => {
  return (
    <div className="h-full w-full flex-1 flex flex-col items-center justify-center gap-3">
      <p className="text-gray-400 text-sm">{text}</p>

      {onAdd && (
        <Button
          variant="ghost"
          size="lg"
          colour={colours.grey}
          iconName="plus"
          onClick={onAdd}
        />
      )}
    </div>
  );
};
