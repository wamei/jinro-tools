export type GameSettings = {
  name: string;
  roles: Role[];
};

export type Role = {
  name: string;
  color: string;
  text?: string;
};

export type User = {
  role: Role;
  status: Status;
  deception: DeceptionStatus;
  divinations: Line[];
  lines: Line[];
};

export const Status = {
  alive: "生存",
  bitten: "噛まれ",
  hanged: "吊られ",
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export type Line = {
  target: number;
  status: LineStatus;
};

export const LineStatus = {
  unknown: "？",
  white: "白",
  black: "黒",
} as const;
export type LineStatus = (typeof LineStatus)[keyof typeof LineStatus];

export const DeceptionStatus = {
  unknown: "不明",
  confirmed: "確定",
  deception: "騙り",
} as const;
export type DeceptionStatus =
  (typeof DeceptionStatus)[keyof typeof DeceptionStatus];

export const Colors = {
  blue: "#3498db",
  red: "#e74c3c",
  green: "#2ecc71",
  yellow: "#f1c40f",
  gray: "#bdc3c7",
  black: "#000",
  white: "#fff",
};

export const BaseRoles = {
  citizen: {
    name: "市民",
    color: Colors.blue,
  },
  seer: {
    name: "占い師",
    color: Colors.blue,
  },
  knight: {
    name: "騎士",
    color: Colors.blue,
  },
  medium: {
    name: "霊媒師",
    color: Colors.blue,
  },
  hunter: {
    name: "ハンター",
    color: Colors.blue,
  },
  werewolf: {
    name: "人狼",
    color: Colors.red,
  },
  madman: {
    name: "狂人",
    color: Colors.red,
  },
  fox: {
    name: "妖狐",
    color: Colors.yellow,
  },
} as const;

export const UserRoles = {
  unknown: {
    name: "？",
    color: Colors.gray,
  },
  white: {
    name: "白",
    color: Colors.white,
    text: Colors.black,
  },
  black: {
    name: "黒",
    color: Colors.black,
  },
} as const;

export const BaseGameSettings = {
  sixPlayers: {
    name: "6人",
    roles: [
      BaseRoles.citizen,
      BaseRoles.citizen,
      BaseRoles.seer,
      BaseRoles.knight,
      BaseRoles.werewolf,
      BaseRoles.werewolf,
    ],
  } as GameSettings,
  ninePlayersWithMedium: {
    name: "9人(霊媒)",
    roles: [
      BaseRoles.citizen,
      BaseRoles.citizen,
      BaseRoles.citizen,
      BaseRoles.seer,
      BaseRoles.knight,
      BaseRoles.medium,
      BaseRoles.werewolf,
      BaseRoles.werewolf,
      BaseRoles.madman,
    ],
  } as GameSettings,
  ninePlayersWithHunter: {
    name: "9人(ハンター)",
    roles: [
      BaseRoles.citizen,
      BaseRoles.citizen,
      BaseRoles.citizen,
      BaseRoles.seer,
      BaseRoles.knight,
      BaseRoles.hunter,
      BaseRoles.werewolf,
      BaseRoles.werewolf,
      BaseRoles.madman,
    ],
  } as GameSettings,
  thirteenPlayers: {
    name: "13人",
    roles: [
      BaseRoles.citizen,
      BaseRoles.citizen,
      BaseRoles.citizen,
      BaseRoles.citizen,
      BaseRoles.citizen,
      BaseRoles.seer,
      BaseRoles.knight,
      BaseRoles.medium,
      BaseRoles.hunter,
      BaseRoles.werewolf,
      BaseRoles.werewolf,
      BaseRoles.werewolf,
      BaseRoles.madman,
    ],
  } as GameSettings,
} as const;
