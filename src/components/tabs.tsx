import { Button } from "./button";
import { useEffect, useState } from "react";

interface TabItem {
  label: string;
  href: string;
  selected?: boolean;
}

interface TabsProps {
  items: TabItem[];
  onClick?: (href: string) => void; // Change the prop name to onClick
}

const Tabs = ({ items, onClick }: TabsProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    const selected = items.find((item) => item.selected);
    if (selected) {
      setSelectedValue(selected.href);
    }
  }, [items]);

  const handleClick = (href: string) => {
    setSelectedValue(items.find((item) => item.href === href)?.href ?? ""); // Find the index of the clicked item
    if (onClick) {
      onClick(href);
    }
  };

  return (
    <div className="flex flex-row">
      {items.map((item) => (
        <Button
          key={item.href}
          onClick={() => handleClick(item.href)}
          variant={`${selectedValue === item.href ? "default" : "outline"}`}
          // Round the corners of the first and last buttons
          className="rounded-none first:rounded-r-md last:rounded-l-md"
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
