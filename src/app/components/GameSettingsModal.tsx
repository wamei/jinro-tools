import { FC, useEffect, useState } from "react";
import { Modal } from "./Modal";
import { BaseRoles, GameSettings } from "../constants";
import Button from "./Button";
import Input from "./Input";
import { RoleBadge } from "./RoleBadge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSubmit: (settings: GameSettings) => void;
}

export const GameSettingsModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSubmit,
}) => {
  const [settingsState, setSettingsState] = useState(settings);
  const [numberOfUsers, setNumberOfUsers] = useState(
    `${settings.roles.length}`
  );

  useEffect(() => {
    setSettingsState(settings);
    setNumberOfUsers(`${settings.roles.length}`);
  }, [settings]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">設定</h2>
        <div className="flex flex-col gap-2">
          <div className="flex">
            <Input
              label="人数"
              value={numberOfUsers}
              onChange={(e) => {
                setNumberOfUsers(e.target.value);
                const number = parseInt(e.target.value, 10);
                if (isNaN(number) || number < 1) {
                  return;
                }
                setSettingsState((prev) => {
                  const roles = prev.roles.slice(0, number);
                  if (roles.length < number) {
                    roles.push(
                      ...new Array(number - roles.length)
                        .fill(null)
                        .map(() => BaseRoles.citizen)
                    );
                  }
                  return { ...prev, roles };
                });
              }}
            />
          </div>

          <div className="p-4 flex flex-col">
            <div className="flex flex-wrap gap-2">
              {settingsState.roles.map((role, index) => (
                <RoleBadge key={index} role={role} className="cursor-pointer" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex">
          <Button onClick={() => onSubmit(settingsState)}>変更</Button>
        </div>
      </div>
    </Modal>
  );
};
