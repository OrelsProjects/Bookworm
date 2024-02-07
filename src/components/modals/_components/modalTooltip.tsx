import { Tooltip } from "react-tooltip";

const ModalTooltip = ({
  children,
  id,
  place = "top",
}: {
  children: React.ReactNode;
  id: string;
  place?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
}) => {
  return (
    <Tooltip id={id} place={place}>
      <div className="tooltipContent">{children}</div>
    </Tooltip>
  );
};
export default ModalTooltip;
