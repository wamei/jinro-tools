import { FC } from "react";
import { DeceptionStatus, Role, UserRoles } from "../constants";
import { FaQuestion, FaSkullCrossbones } from "react-icons/fa6";

interface RoleBadgeProps {
  role: Role;
  className?: string;
  onClick?: (role: Role) => void;
  deception?: DeceptionStatus;
}

export const RoleBadge: FC<RoleBadgeProps> = ({
  role,
  className,
  onClick,
  deception,
}) => {
  return (
    <span
      className={`relative p-1 rounded text-white whitespace-nowrap text-center ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      style={{
        backgroundColor: role.color,
        ...(role.text ? { color: role.text } : {}),
      }}
      onClick={() => onClick?.(role)}
    >
      {role.name}
      {deception &&
        deception !== DeceptionStatus.confirmed &&
        role.name !== UserRoles.unknown.name && (
          <span className="absolute right-[-8px] top-[-8px]">
            {deception === DeceptionStatus.unknown ? (
              <span className="text-gray-500 rounded-full bg-white inline-block border border-gray-500 text-sm">
                <FaQuestion />
              </span>
            ) : (
              <span className="text-red-500 rounded-full bg-white inline-block border border-red-500 text-sm">
                <FaSkullCrossbones />
              </span>
            )}
          </span>
        )}
    </span>
  );
};
