import { FC } from "react";
import { Role } from "../constants";

interface RoleBadgeProps {
  role: Role;
  className?: string;
  onClick?: (role: Role) => void;
}

export const RoleBadge: FC<RoleBadgeProps> = ({ role, className, onClick }) => {
  return (
    <span
      className={`p-1 rounded text-white whitespace-nowrap text-center ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      style={{
        backgroundColor: role.color,
        ...(role.text ? { color: role.text } : {}),
      }}
      onClick={() => onClick?.(role)}
    >
      {role.name}
    </span>
  );
};
