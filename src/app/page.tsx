"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  BaseGameSettings,
  BaseRoles,
  LineStatus,
  GameSettings,
  Role,
  Status,
  User,
  UserRoles,
} from "./constants";
import { GameSettingsModal } from "./components/GameSettingsModal";
import Button from "./components/Button";
import { RoleBadge } from "./components/RoleBadge";
import { Tooltip } from "./components/Tooltip";
import { FaGear } from "react-icons/fa6";

const CardWidth = 100;
const CardHeight = 50;

export default function Home() {
  // 設定値
  const [favorites] = useState<GameSettings[]>(Object.values(BaseGameSettings));
  const [roles] = useState<Role[]>(Object.values(BaseRoles));

  // ゲーム設定
  const [settings, setSettings] = useState<GameSettings>(
    BaseGameSettings.sixPlayers
  );

  // ゲーム情報
  const [users, setUsers] = useState<User[]>(
    settings.roles.map(() => ({
      role: UserRoles.unknown,
      status: Status.alive,
      divinations: [],
      lines: [],
    }))
  );
  const [order, setOrder] = useState(0);
  const [memo, setMemo] = useState("");

  useEffect(() => {
    const users = settings.roles.map(() => ({
      role: UserRoles.unknown,
      status: Status.alive,
      divinations: [],
      lines: [],
    }));
    setUsers(users);
    setOrder(0);
    setMemo(users.map((_, index) => `${index + 1}. `).join("\n\n"));
  }, [settings]);

  const uniqueRoles = [
    UserRoles.unknown,
    UserRoles.white,
    UserRoles.black,
    ...settings.roles.reduce((acc, role) => {
      if (!acc.find((r) => r.name === role.name)) {
        acc.push(role);
      }
      return acc;
    }, [] as Role[]),
  ];

  const [showGameSettingsModal, setShowGameSettingsModal] = useState(false);

  // 円描画関係
  const circleRef = useRef<HTMLDivElement>(null);
  const deg = 360.0 / settings.roles.length;
  const red = (deg * Math.PI) / 180.0;

  const width = CardWidth;
  const height = CardHeight;
  const circleR = useMemo(() => {
    if (circleRef.current === null) {
      return width * 2.5;
    }
    return Math.min(
      width * 2.5,
      circleRef.current.getBoundingClientRect().width / 2 - 20
    );
  }, [circleRef.current, width]);

  const [activeUser, setActiveUser] = useState<number | null>(null);

  return (
    <>
      <nav className="bg-black text-white p-4 flex flex-row justify-between">
        <div className="font-bold">人狼考察補助ツール</div>
        <div
          className="cursor-pointer text-gray-400 hover:text-gray-200 hidden"
          onClick={() => setShowGameSettingsModal(true)}
        >
          <FaGear />
        </div>
      </nav>
      <div className="flex flex-wrap gap-4">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="w-[40px]">村</div>
            {favorites.map((settings, index) => (
              <Button
                key={index}
                className="px-2"
                onClick={() => {
                  setSettings({ ...settings });
                }}
              >
                {settings.name}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="w-[40px]">構成</div>
            {settings.roles.map((role, i) => (
              <Tooltip
                key={i}
                trigger={<RoleBadge role={role} className="cursor-pointer" />}
              >
                <div className="flex flex-col flex-wrap gap-2">
                  {roles.map((role, j) => (
                    <RoleBadge
                      key={j}
                      role={role}
                      onClick={(role) =>
                        setSettings((prev) => ({
                          ...prev,
                          roles: prev.roles.map((r, k) => (k === i ? role : r)),
                        }))
                      }
                    />
                  ))}
                </div>
              </Tooltip>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="w-[40px]">席次</div>
            {settings.roles.map((role, index) => (
              <Button
                key={index}
                className="px-2"
                active={order === index}
                onClick={() => {
                  setOrder(index);
                }}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <div className="flex justify-start" ref={circleRef}>
            <div
              className="relative ms-8 md:ms-12"
              style={{
                marginTop: height,
                marginBottom: height,
                width: circleR * 2 + width,
                height: circleR * 2,
              }}
            >
              {users.map((user, index) => {
                const position = (index - order + users.length) % users.length;
                const x =
                  Math.cos(red * position + Math.PI / 2) * circleR + circleR;
                const y =
                  Math.sin(red * position + Math.PI / 2) * circleR + circleR;
                const areaWidth =
                  circleRef.current?.getBoundingClientRect().width ?? 0;
                const diff = areaWidth - x - 420 + width / 2;
                const offsetX = diff < 0 ? diff : 0;
                return (
                  <Fragment key={index}>
                    {(activeUser === null || activeUser === index) &&
                      user.divinations
                        .filter((d) => d.status !== LineStatus.unknown)
                        .map((d, i) => {
                          const targetPosition =
                            (d.target - order + users.length) % users.length;

                          const targetX =
                            Math.cos(red * targetPosition + Math.PI / 2) *
                              circleR +
                            circleR;
                          const targetY =
                            Math.sin(red * targetPosition + Math.PI / 2) *
                              circleR +
                            circleR;

                          const arrowBaseX = targetX;
                          const arrowBaseY = targetY;

                          const originalX = x - circleR;
                          const originalY = y - circleR;
                          const originalTargetX = targetX - circleR;
                          const originalTargetY = targetY - circleR;

                          const lineLength = 20;
                          const rad2 = Math.atan2(
                            originalY - originalTargetY,
                            originalX - originalTargetX
                          );

                          const arrowTargetX =
                            Math.cos(rad2 + (Math.PI * 30) / 180) * lineLength +
                            originalTargetX +
                            circleR;
                          const arrowTargetY =
                            Math.sin(rad2 + (Math.PI * 30) / 180) * lineLength +
                            originalTargetY +
                            circleR;
                          return (
                            <div
                              key={i}
                              className="absolute opacity-30 z-40 pointer-events-none"
                            >
                              <svg
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: circleR * 2 + width,
                                  height: circleR * 2,
                                }}
                              >
                                <line
                                  x1={x}
                                  y1={y}
                                  x2={targetX}
                                  y2={targetY}
                                  stroke={
                                    d.status === LineStatus.black
                                      ? "red"
                                      : "blue"
                                  }
                                  strokeWidth="2"
                                />
                                <line
                                  x1={arrowBaseX}
                                  y1={arrowBaseY}
                                  x2={arrowTargetX}
                                  y2={arrowTargetY}
                                  stroke={
                                    d.status === LineStatus.black
                                      ? "red"
                                      : "blue"
                                  }
                                  strokeWidth="2"
                                />
                              </svg>
                            </div>
                          );
                        })}
                    {(activeUser === null || activeUser === index) &&
                      user.lines
                        .filter(
                          (d) =>
                            d.status !== LineStatus.unknown ||
                            activeUser === null ||
                            activeUser === index
                        )
                        .map((d, i) => {
                          const targetPosition =
                            (d.target - order + users.length) % users.length;
                          const targetX =
                            Math.cos(red * targetPosition + Math.PI / 2) *
                              circleR +
                            circleR;
                          const targetY =
                            Math.sin(red * targetPosition + Math.PI / 2) *
                              circleR +
                            circleR;

                          const arrowBaseX = targetX;
                          const arrowBaseY = targetY;

                          const originalX = x - circleR;
                          const originalY = y - circleR;
                          const originalTargetX = targetX - circleR;
                          const originalTargetY = targetY - circleR;

                          const lineLength = 20;
                          const rad2 = Math.atan2(
                            originalY - originalTargetY,
                            originalX - originalTargetX
                          );

                          const arrowTargetX =
                            Math.cos(rad2 + (Math.PI * 30) / 180) * lineLength +
                            originalTargetX +
                            circleR;
                          const arrowTargetY =
                            Math.sin(rad2 + (Math.PI * 30) / 180) * lineLength +
                            originalTargetY +
                            circleR;
                          return (
                            <div
                              key={i}
                              className="absolute opacity-50 z-30 pointer-events-none"
                            >
                              <svg
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: circleR * 2 + width,
                                  height: circleR * 2,
                                }}
                              >
                                <line
                                  x1={x}
                                  y1={y}
                                  x2={targetX}
                                  y2={targetY}
                                  stroke={
                                    d.status === LineStatus.black
                                      ? "red"
                                      : "gray"
                                  }
                                  strokeWidth="1"
                                  strokeDasharray="4"
                                />
                                <line
                                  x1={arrowBaseX}
                                  y1={arrowBaseY}
                                  x2={arrowTargetX}
                                  y2={arrowTargetY}
                                  stroke={
                                    d.status === LineStatus.black
                                      ? "red"
                                      : "gray"
                                  }
                                  strokeWidth="1"
                                  strokeDasharray="4"
                                />
                              </svg>
                            </div>
                          );
                        })}
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        left: x - width / 2,
                        top: y - height / 2,
                        width: width,
                        height: height,
                      }}
                    >
                      <Tooltip
                        trigger={
                          <div
                            className={`${
                              user.status === Status.alive
                                ? "bg-white border-gray-400"
                                : user.status === Status.bitten
                                ? "bg-red-400 opacity-50 border-red-400 text-white"
                                : "bg-gray-400 opacity-50 border-gray-400 text-white"
                            } border rounded flex gap-2 p-2 cursor-pointer`}
                            onMouseEnter={() => setActiveUser(index)}
                            onMouseLeave={() => setActiveUser(null)}
                          >
                            {index + 1}
                            <RoleBadge role={user.role} />
                          </div>
                        }
                        offsetY={height + 4}
                        offsetX={offsetX}
                      >
                        <div className="w-100 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-[50px]">役職</div>
                            <div className="flex flex-wrap gap-2">
                              {uniqueRoles.map((role, i) => (
                                <RoleBadge
                                  key={i}
                                  role={role}
                                  onClick={(role) => {
                                    setUsers((prev) =>
                                      prev.map((u, j) =>
                                        j === index ? { ...u, role } : u
                                      )
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-[50px]">生死</div>
                            <div className="flex flex-wrap gap-2">
                              {Object.values(Status).map((status, i) => (
                                <Button
                                  key={i}
                                  color="bg-gray-400"
                                  activeColor={
                                    status === Status.alive
                                      ? "bg-gray-400"
                                      : status === Status.bitten
                                      ? "bg-red-400"
                                      : "bg-black"
                                  }
                                  active={user.status === status}
                                  onClick={() => {
                                    setUsers((prev) =>
                                      prev.map((u, j) =>
                                        j === index ? { ...u, status } : u
                                      )
                                    );
                                  }}
                                >
                                  {status}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-[50px]">占い</div>
                            <div className="flex flex-wrap gap-2">
                              {users.map((_, i) => {
                                const divination = user.divinations.find(
                                  (d) => d.target === i
                                );
                                const nextStatus =
                                  divination?.status === LineStatus.white
                                    ? LineStatus.black
                                    : divination?.status === LineStatus.black
                                    ? LineStatus.unknown
                                    : LineStatus.white;
                                return (
                                  <Button
                                    key={i}
                                    className="px-2"
                                    color={
                                      divination?.status === LineStatus.white
                                        ? "bg-blue-400"
                                        : divination?.status ===
                                          LineStatus.black
                                        ? "bg-red-400"
                                        : "bg-gray-400"
                                    }
                                    onClick={() => {
                                      setUsers((prev) =>
                                        prev.map((u, j) =>
                                          j === index
                                            ? {
                                                ...u,
                                                divinations: [
                                                  ...u.divinations.filter(
                                                    (d) => d.target !== i
                                                  ),
                                                  {
                                                    target: i,
                                                    status: nextStatus,
                                                  },
                                                ],
                                              }
                                            : u
                                        )
                                      );
                                    }}
                                  >
                                    {i + 1}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-[50px]">ライン</div>
                            <div className="flex flex-wrap gap-2">
                              {users.map((_, i) => {
                                const line = user.lines.find(
                                  (d) => d.target === i
                                );
                                const nextStatus =
                                  line?.status === LineStatus.white
                                    ? LineStatus.black
                                    : line?.status === LineStatus.black
                                    ? LineStatus.unknown
                                    : LineStatus.white;
                                return (
                                  <Button
                                    key={i}
                                    className="px-2"
                                    color={
                                      line?.status === LineStatus.white
                                        ? "bg-blue-400"
                                        : line?.status === LineStatus.black
                                        ? "bg-red-400"
                                        : "bg-gray-400"
                                    }
                                    onClick={() => {
                                      setUsers((prev) =>
                                        prev.map((u, j) =>
                                          j === index
                                            ? {
                                                ...u,
                                                lines: [
                                                  ...u.lines.filter(
                                                    (d) => d.target !== i
                                                  ),
                                                  {
                                                    target: i,
                                                    status: nextStatus,
                                                  },
                                                ],
                                              }
                                            : u
                                        )
                                      );
                                    }}
                                  >
                                    {i + 1}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </Tooltip>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-4">
          <textarea
            className="w-150 h-200 border border-gray-400 p-4"
            onChange={(e) => setMemo(e.target.value)}
            value={memo}
          ></textarea>
        </div>
      </div>
      <GameSettingsModal
        isOpen={showGameSettingsModal}
        onClose={() => setShowGameSettingsModal(false)}
        settings={settings}
        onSubmit={(settings) => {
          setSettings(settings);
          setShowGameSettingsModal(false);
        }}
      />
    </>
  );
}
