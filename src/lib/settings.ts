import { prisma } from "./prisma";

export type SettingsMap = Record<string, string>;

/**
 * Get all settings as a key-value map.
 */
export async function getAllSettings(): Promise<SettingsMap> {
  const settings = await prisma.setting.findMany();
  const map: SettingsMap = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}

/**
 * Get a single setting value by key.
 */
export async function getSetting(key: string): Promise<string> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value || "";
}

/**
 * Update multiple settings at once.
 */
export async function updateSettings(settings: SettingsMap): Promise<void> {
  const operations = Object.entries(settings).map(([key, value]) =>
    prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  );
  await prisma.$transaction(operations);
}
